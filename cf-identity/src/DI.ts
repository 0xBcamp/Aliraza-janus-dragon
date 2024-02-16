import { createHash } from "crypto";
import { Contract, JsonRpcSigner, Signer, ethers } from "ethers";
import { DIContractInterface } from "./interfaces/Contract";
import dotenv from "dotenv";
import { contract_abi, contract_address } from "./contract";
import assert from "assert";
import { Credential } from "./types/types";
import { NFTStorage, File, Blob, CIDString } from "nft.storage";
import e from "express";
dotenv.config();

export class DecentralizeIdentity {
  private contract: DIContractInterface;
  storage: NFTStorage;

  constructor(signer: JsonRpcSigner | Signer, storage_secret_key: string) {
    const _contract: Contract = new ethers.Contract(
      contract_address,
      contract_abi,
      signer.provider
    );
    this.contract = _contract.connect(signer) as DIContractInterface;
    this.storage = new NFTStorage({ token: storage_secret_key });
  }

  /**
   * @param address - wallet address of the user
   * @param name - name of the identifier
   * @returns decentralize identifier (did)
   */
  createIdentifier = (name: string, address: string): string => {
    const hashable: string = name + address;
    const did: string =
      `did:${name}:` + createHash("sha256").update(hashable).digest("hex");
    return did;
  };

  /**
   * @dev This function stores the DID in the wallet of the user on the blockchain. This is necessary for verifying credentials.
   * @param did decentralize identifier
   * @param address wallet address of user
   */
  storeDID = async (did: string, address: string) => {
    try {
      const isValidDid: boolean = await this.verifyDID(did, address);
      if (isValidDid) {
        throw new Error("DID already exists");
      } else {
        await this.contract.assignDID(did);
      }
    } catch (error) {
      throw new Error(String(error));
    }
  };

  removeDID = async (did: string, address: string) => {
    try {
      const user_dids: string[] | undefined = await this.getDIDs(address);
      if (user_dids) {
        const index: number = user_dids.indexOf(did);
        if (index === -1) {
          throw new Error("DID not found");
        } else {
          await this.contract.removeDID(
            index,
            did,
            user_dids[user_dids.length - 1]
          );
        }
      } else {
        throw new Error("No DID found on the wallet");
      }
    } catch (error) {
      throw new Error(String(error));
    }
  };

  /**
   * @notice This function do double verification of the did, both OnChain and OffChain.
   * @param did decentralize identifier of the user to verify
   * @param address public key/wallet address
   * @returns verification check (TRUE or FALSE)
   */
  verifyDID = async (did: string, address: string): Promise<boolean> => {
    try {
      const cid_hash: string = did.split(":")[2];
      assert(
        /^did:.+:[a-z0-9]+$/.test(did) && cid_hash.length === 64,
        "Invalid DID"
      );
      const user_dids: string[] = await this.contract.getDIDs(address);
      const isDidOnChainVerified: boolean = user_dids.includes(did);
      const name: string = did.split(":")[1];
      const expected_did: string = this.createIdentifier(name, address);
      return did === expected_did && isDidOnChainVerified;
    } catch (error) {
      throw new Error(String(error));
    }
  };

  /**
   * Authorizes the user to access the credential
   * @param address - wallet address of the user to authorize the acccess
   * @param cid - ipfs cid of the credential to allow access to
   */
  authorizeForCredentialAccess = async (
    address: string,
    cid: string
  ): Promise<void> => {
    try {
      await this.contract.authroizeForCredentialAccess(address, cid);
    } catch (error) {
      throw new Error(String(error));
    }
  };

  /**
   * Revokes the user to access the credential
   * @param address - wallet address of the user
   * @param cid - ipfs cid of the credential to revoke access to
   */
  revokeCredentialAccess = async (
    address: string,
    cid: string
  ): Promise<void> => {
    try {
      const isAuthorizedAlready: boolean =
        await this.isAuthorizedForCredentialAccess(address, cid);
      if (!isAuthorizedAlready) throw new Error("User not authorized!");
      await this.contract.revokeCredentialAccess(address, cid);
    } catch (error) {
      throw new Error(String(error));
    }
  };

  /**
   * Issue Credentials
   * @param data - an Object of type Credential containing the credential (object), holder address, holder did, issuer address, and issuer did
   * @returns the ipfs CID of the credential stored.
   * @notice This function will throw an error if the credentials have been issued already. The function assigns the issuer and holder did to the credential automatically.
   */
  issueCredential = async (
    data: Credential
  ): Promise<CIDString | undefined> => {
    const {
      credential,
      holder_address,
      holder_did,
      issuer_address,
      issuer_did,
    } = data;
    const isIssuerDidVerified: boolean = await this.verifyDID(
      issuer_did,
      issuer_address
    );
    const isHolderDidVerified: boolean = await this.verifyDID(
      holder_did,
      holder_address
    );
    if (!isIssuerDidVerified || !isHolderDidVerified) {
      throw new Error("Invalid Issuer or Holder DID");
    } else {
      try {
        credential.issuer_did = issuer_did;
        credential.holder_did = holder_did;
        const credentialBlob: Blob = new Blob([JSON.stringify(credential)]);
        const ipfs_cid: CIDString = await this.storage.storeBlob(
          credentialBlob
        );
        // checking if the credentials have not been issued already
        const credentials: string[] = await this.contract.getIssuedCredentials(
          issuer_did
        );
        if (credentials.includes(ipfs_cid)) {
          throw new Error("Credentials issued already!");
        } else {
          await this.contract.issueCredentials(
            issuer_did,
            holder_did,
            ipfs_cid
          );
          return ipfs_cid;
        }
      } catch (error) {
        throw new Error(String(error));
      }
    }
  };

  /**
   * @param credential CID of the credential to verify
   * @returns verification check TRUE or FALSE
   */
  verifyCredential = async (
    address: string,
    credential: string
  ): Promise<boolean> => {
    try {
      const isAuthorized: boolean = await this.isAuthorizedForCredentialAccess(
        address,
        credential
      );
      const credentialData: any = await this.getCredentialData(credential);
      const verified: boolean = await this.contract.verifyCredential(
        credential,
        credentialData.issuer_did,
        credentialData.holder_did
      )
      return verified;
    } catch (error) {
      throw new Error(String(error));
    }
  };

  /**
   * @param did decentralize identifier of the user
   * @returns all of the credentials issued by the user
   */
  getIssuedCredentials = async (did: string): Promise<string[]> => {
    const issuer_credentials: string[] =
      await this.contract.getIssuedCredentials(did);
    return issuer_credentials;
  };

  /**
   * @notice checks if the user is authorized to access the credential
   * @param address wallet address of the user
   * @param cid ipfs cid of the credential
   * @returns a boolean indicating if the user is authorized to access the credential
   */
  isAuthorizedForCredentialAccess = async (
    address: string,
    cid: string
  ): Promise<boolean> => {
    try {
      const isAuthorized: boolean =
        await this.contract.isAuthorizedForCredentialAccess(address, cid);
      return isAuthorized;
    } catch (error) {
      throw new Error(String(error));
    }
  };

  /**
   * @param did decentralize identifier of the user
   * @returns all of the credentials, the user is holding
   */
  getOwnedCredentials = async (did: string): Promise<string[]> => {
    const owned_credentials: string[] = await this.contract.getOwnedCredentials(
      did
    );
    return owned_credentials;
  };

  /**
   * @param address wallet address of the user
   * @returns the decentralize identifiers of the user
   */
  getDIDs = async (address: string): Promise<string[] | undefined> => {
    try {
      const dids = await this.contract.getDIDs(address);
      return dids;
    } catch (error) {
      throw new Error(String(error));
    }
  };

  /**
   * @returns the maximum number of decentralized identifiers that can be created by each user
   */
  getMaxDIDs = async (): Promise<number> => {
    const max_dids: number = await this.contract.maxDIDs();
    return max_dids;
  };

  /**
   * @returns the address of the smart contract
   */
  getContractAddress = async (): Promise<string> => {
    const address: string = await this.contract.getAddress();
    return address;
  };

  /**
   * @param cid ipfs CID of the credential
   * @returns the data (object) of the credential
   */
  getCredentialData = async (cid: string): Promise<any> => {
    const dataURL: string = `https://${cid}.ipfs.nftstorage.link`;
    const response = await (await fetch(dataURL)).text();
    return JSON.parse(response);
  };
}
