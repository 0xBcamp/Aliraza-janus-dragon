import { createHash } from "crypto";
import { BaseContract, HDNodeWallet } from "ethers";
import {
  DecentralizeIdentityContractInit,
  DIContractInterface,
} from "./Contract";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import dotenv from "dotenv";
dotenv.config();

const storage = new ThirdwebStorage({
  secretKey: process.env.IPFS_STORAGE_KEY,
});

export class DecentralizeIdentity {
  contract_init: DecentralizeIdentityContractInit;
  contract: DIContractInterface;

  constructor() {
    this.contract_init = new DecentralizeIdentityContractInit();
    this.contract = this.contract_init.getContract();
  }

  /**
   * @param address - wallet address of the user
   * @param name - name of the identifier
   * @returns decentralize identifier
   */
  createIdentifier = (name: string, address: string): string => {
    const hashable: string = name + address;
    const did: string =
      `did:${name}:` + createHash("sha256").update(hashable).digest("hex");
    return did;
  };

  /**
   * @dev This function stores the DID in the wallet of the user on the blockchain
   * @param did decentralize identifier
   * @param address wallet address of user
   */
  storeDID = async (did: string, address: string) => {
    try {
      console.log(`Storing DID {${did}} on address {${address}}...`);
      const didExists: boolean = (
        await this.contract.getDIDs(address)
      ).includes(did);
      !didExists
        ? await this.contract.assignDID(address, did)
        : new Error("DID already exists");
      console.log(`ONCHAIN => Identity assigned successfully.`);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * @notice This function do double verification of the did, both OnChain and OffChain.
   * @param did decentralize identifier of the user to verify
   * @param address public key/wallet address
   * @returns verification check (TRUE or FALSE)
   */
  verifyDID = async (
    did: string,
    address: string
  ): Promise<boolean | undefined> => {
    try {
      console.log("Verifying Identity...");
      const user_dids: string[] = await this.contract.getDIDs(address);
      const isDidOnChainVerified: boolean = user_dids.includes(did);
      const name: string = did.split(":")[1];
      const expected_did: string = this.createIdentifier(name, address);
      return did === expected_did && isDidOnChainVerified;
    } catch (error) {
      console.log(error);
    }
  };

  issueCredential = async (
    issuer_did: string,
    holder_did: string,
    credential: string
  ): Promise<string> => {
    // get credential hash
    const ipfs_cid: string = await storage.upload(credential);
    const cid: string = ipfs_cid.split("/")[2];
    await this.contract.issueCredentials(issuer_did, holder_did, cid);
    console.log(`Issued Credential: CID => ${cid}`);
    return cid;
  };

  /**
   *
   * @param credential ipfs hash of the credential to verify
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

  getCredentials = async (did: string): Promise<string[]> => {
    const holded_credentials: string[] =
      await this.contract.getHoldedCredentials(did);
    const issuer_credentials: string[] =
      await this.contract.getIssuedCredentials(did);
    return [...holded_credentials, ...issuer_credentials];
  };
}
