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

  storeDID = async (did: string, address: string) => {
    try{
      // await contract.;
      console.log(`DID {${did}} assigned successfully.`);
    } catch(error){
      console.log(error);
    }
  }

  verifyDID = async (did: string, address: string) => {
    try{
      const user_dids = await contract.maxDIDs(address);
      console.log(user_dids);
      // return true;
    } catch(error){
      console.log(error);
    }
  };

  issueCredential = async () => {}

  verifyCredential = async () => {}
}

const main = async () => {
  console.log("Server running on port 3000...");
  await initializeWalletAndContract();
  console.log(`Contract address: ${await contract.getAddress()} \nUser: ${wallet.address}`);
  const decentralizedIdentity: DecentralizeIdentity = new DecentralizeIdentity();
  const did: string = decentralizedIdentity.createIdentifier(
    "test",
    wallet.address
  );
  // await decentralizedIdentity.storeDID(did, wallet.address);
  decentralizedIdentity.verifyDID('',wallet.address);
};
main();
