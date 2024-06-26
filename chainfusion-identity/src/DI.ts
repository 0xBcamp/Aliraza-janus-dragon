import { createHash } from "crypto";
import {
  AbstractSigner,
  BaseContract,
  Contract,
  HDNodeWallet,
  JsonRpcSigner,
  Signer,
  ethers,
} from "ethers";
import { DIContractInterface } from "./interfaces/Contract";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import dotenv from "dotenv";
import {
  contract_abi,
  contract_address,
  test_contract_abi,
  test_contract_address,
} from "./contract";
import assert from "assert";
import { Credential } from "./types/types";
dotenv.config();

export class DecentralizeIdentity {
  private contract: DIContractInterface;
  storage: ThirdwebStorage;

  constructor(signer: JsonRpcSigner | Signer, storage_secret_key: string) {
    const _contract: Contract = new ethers.Contract(
      contract_address,
      contract_abi,
      signer.provider
    );
    this.contract = _contract.connect(signer) as DIContractInterface;
    this.storage = new ThirdwebStorage({
      secretKey: storage_secret_key,
    });
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
        await this.contract.assignDID(did, { from: address });
      }
    } catch (error) {
      console.log(error);
    }
  };

  removeDID = async (did: string, address: string) => {
    try{
      this.contract.removeDID(did, {from:address});
    } catch(error){
      console.log(error);
    }
  }

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
      const user_dids: string[] = await this.contract.getDIDs({from:address});
      const isDidOnChainVerified: boolean = user_dids.includes(did);
      const name: string = did.split(":")[1];
      const expected_did: string = this.createIdentifier(name, address);
      return did === expected_did && isDidOnChainVerified;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  issueCredential = async (data: Credential): Promise<string | undefined> => {
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
        const ipfs_cid: string = await this.storage.upload(credential);
        const cid: string = ipfs_cid.split("/")[2];
        // checking if the credentials have not been issued already
        const credentials: string[] = await this.contract.getIssuedCredentials(
          issuer_did
        );
        if (credentials.includes(cid)) {
          throw new Error("Credentils issued already!");
        } else {
          await this.contract.issueCredentials(issuer_did, holder_did, cid);
          return cid;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  /**
   *
   * @param credential cid of the credential to verify
   * @param issuer_did identifier of the issuer of credential
   * @param holder_did identifier of the holder of credential
   */
  verifyCredential = async (
    issuer_did: string,
    holder_did: string,
    credential: string
  ): Promise<boolean> => {
    const issuer_credentials: string[] =
      await this.contract.getIssuedCredentials(issuer_did);
    const holder_credentials: string[] =
      await this.contract.getHoldedCredentials(holder_did);
    return (
      issuer_credentials.includes(credential) &&
      holder_credentials.includes(credential)
    );
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
   * @param did decentralize identifier of the user
   * @returns all of the credentials, the user is holding
   */
  getHoldedCredentials = async (did: string): Promise<string[]> => {
    const holded_credentials: string[] =
      await this.contract.getHoldedCredentials(did);
    return holded_credentials;
  };

  /**
   *
   * @param address wallet address of the user
   * @returns the decentralize identifiers of the user
   */
  getDIDs = async (address: string): Promise<string[] | undefined> => {
    try {
      const dids = await this.contract.getDIDs({from:address});
      return dids;
    } catch (error) {
      console.log(error);
    }
  };

  getMaxDIDs = async (): Promise<number> => {
    const max_dids: number = await this.contract.maxDIDs();
    return max_dids;
  };

  getContractAddress = async (): Promise<string> => {
    const address: string = await this.contract.getAddress();
    return address;
  };
}