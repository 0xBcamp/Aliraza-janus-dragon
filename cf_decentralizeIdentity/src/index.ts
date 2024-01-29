import { createHash } from "crypto";
import { Contract, HDNodeWallet, JsonRpcProvider, JsonRpcSigner, ethers } from "ethers";
import "dotenv/config";
import { contract_abi, contract_address } from "./contract";

let provider: JsonRpcProvider;
let signer: JsonRpcSigner;
let wallet: HDNodeWallet;
let contract: Contract;

const initializeWalletAndContract = async () => {
  provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  wallet = ethers.Wallet.fromPhrase(process.env.PHRASE!);
  contract = new ethers.Contract(contract_address, contract_abi, wallet);
  console.log(await contract.getAddress());
};

/**
 * @param address - wallet address of the user
 * @param name - name of the identifier
 * @returns decentralize identifier
 */
const createIdentifier = (name: string, address: string): string => {
  const hashable: string = name + address;
  const did: string =
    `did:${name}:` + createHash("sha256").update(hashable).digest("hex");
  return did;
};

const verifyDID = (did: string) => {};

const verifyIdentifier = (did: string) => {};

const main = async () => {
  await initializeWalletAndContract();
  console.log(
    createIdentifier("college", "0x672BeB69B7129762fB2847bdA5f73E75029c9349")
  );
};
main();
