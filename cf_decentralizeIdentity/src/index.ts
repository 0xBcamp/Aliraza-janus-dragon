import { createHash } from "crypto";
import {
  BaseContract,
  Contract,
  HDNodeWallet,
  JsonRpcProvider,
  JsonRpcSigner,
  Wallet,
  ethers,
} from "ethers";
import "dotenv/config";
import { contract_abi, contract_address } from "./contract";

let provider: JsonRpcProvider;
let signer: Wallet;
let wallet: HDNodeWallet;
let contract: any;

const initializeWalletAndContract = async () => {
  provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  wallet = ethers.Wallet.fromPhrase(process.env.PHRASE!, provider);
  signer = new ethers.Wallet(wallet.privateKey, provider);
  const _contract:Contract = new ethers.Contract(contract_address, contract_abi, provider);
  contract = _contract.connect(signer);
};

export class DecentralizeIdentity {
  constructor() {}

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
    try{
      console.log(`Storing DID {${did}} on address {${address}}...`);
      await contract.assignDID(address, did);
      console.log(`ONCHAIN => Identity assigned successfully.`);
    } catch(error){
      console.log(error);
    }
  }

  /**
   * @notice This function do double verification of the did on both OnChain and OffChain.
   * @param did decentralize identifier of the user to verify
   * @param address public key/wallet address
   * @returns verification check (TRUE or FALSE)
   */
  verifyDID = async (did: string, address: string): Promise<boolean | undefined> => {
    try{
      console.log("Verifying Identity...");
      const user_dids: string[] = await contract.getDIDs(address);
      const isDidOnChainVerified: boolean = user_dids.includes(did);
      const name: string = did.split(":")[1];
      const expected_did:string = this.createIdentifier(name, address);
      return did === expected_did && isDidOnChainVerified;
    } catch(error){
      console.log(error);
    }
  };

  issueCredential = async (issuer_did: string, holder_did: string) => {
    const universityDegree: {
      name: string;
      degree: string;
      program: string;
      date: Date;
      did: string;
    } = {
      name: "Stanford University",
      degree: "Masters",
      program: "Computer Science",
      date: new Date(),
      did: issuer_did
    }
  }


  verifyCredential = async () => {}
}

const main = async () => {
  console.log("Server running on port 3000...");
  await initializeWalletAndContract();
  console.log(`Contract address: ${await contract.getAddress()} \nUser: ${wallet.address}`);
  const decentralizedIdentity: DecentralizeIdentity = new DecentralizeIdentity();
  const issuer_did: string = decentralizedIdentity.createIdentifier(
    "university",
    wallet.address
  );
  console.log(`Generated Local Identifier: ${issuer_did}`);
  // const holder_did: string = decentralizedIdentity.createIdentifier(
  //   "education",
  //   "0x672BeB69B7129762fB2847bdA5f73E75029c9349"
  // );
  // console.log(`Holder Decentralize Identifier: ${holder_did}`);
  // const holder_address: string = "0x672BeB69B7129762fB2847bdA5f73E75029c9349";
  console.log('\n');
  await decentralizedIdentity.storeDID(issuer_did, wallet.address);
  setTimeout(async () => {
    const isDidVerified: boolean | undefined = await decentralizedIdentity.verifyDID(issuer_did, wallet.address);
  console.log(`\n${issuer_did} verified: ${String(isDidVerified).toUpperCase()}`);
  }, 1000);
  
};
main();
