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
dotenv.config();

const storage = new ThirdwebStorage({
  secretKey: process.env.IPFS_STORAGE_KEY,
});

export class DecentralizeIdentity {
  contract: DIContractInterface;

  constructor(signer: JsonRpcSigner | Signer) {
    const _contract: Contract = new ethers.Contract(
      test_contract_address,
      test_contract_abi,
      signer.provider
    );
    this.contract = _contract.connect(signer) as DIContractInterface;
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
   * @dev This function stores the DID in the wallet of the user on the blockchain
   * @param did decentralize identifier
   * @param address wallet address of user
   */
  storeDID = async (did: string, address: string) => {
    try {
      const didExists: boolean = (
        await this.contract.getDIDs(address)
      ).includes(did);
      if (didExists) {
        throw new Error("DID already exists");
      } else {
        await this.contract.assignDID(address, did);
      }
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

  /**
   * @param did decentralize identifier of the user
   * @returns all of the credentials assosiated of the user
   */
  getCredentials = async (did: string): Promise<string[]> => {
    const holded_credentials: string[] =
      await this.contract.getHoldedCredentials(did);
    const issuer_credentials: string[] =
      await this.contract.getIssuedCredentials(did);
    return [...holded_credentials, ...issuer_credentials];
  };

  /**
   * 
   * @param address wallet address of the user
   * @returns the decentralize identifiers of the user
   */
  getDIDs = async (address: string): Promise<string[]> => {
    const dids: string[] = await this.contract.getDIDs(address);
    return dids;
  };
}
