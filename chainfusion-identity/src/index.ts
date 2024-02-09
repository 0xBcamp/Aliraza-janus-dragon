import { ethers } from "ethers";
import { DecentralizeIdentity } from "./DI";
import dotenv from "dotenv"
dotenv.config();

// sample credential
export const universityCredential: string = JSON.stringify({
  name: "Stanford University",
  degree: "Masters",
  program: "Computer Science",
  date: new Date().toISOString(),
  did: "did:university:d104ff2d80c041e91259a9e567b554f359d6986ab95e672cbcc1be16e9c4961a",
});

const main = async () => {
  console.log("Server running on port 3000...");
  // const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);
  // const wallet = ethers.Wallet.fromPhrase(process.env.PHRASE!, provider);
  // const signer = wallet.connect(provider);
  // const address: string = signer.address;
  // console.log(address, wallet.privateKey);
  // const di: DecentralizeIdentity = new DecentralizeIdentity();
  // // const wallet_address: string = di.contract_init.getWallet().address;
  // console.log(`User: ${wallet_address}`);
  // const issuer_did: string = di.createIdentifier("university", wallet_address);
  // const holder_did: string = di.createIdentifier(
  //   "education",
  //   "0x672BeB69B7129762fB2847bdA5f73E75029c9349"
  // );
  // console.log(`Issuer DID: ${issuer_did}`);
  // console.log(`Holder DID: ${holder_did}`);

  // await di.storeDID(issuer_did, wallet_address);

  // setTimeout(async () => {
  //   const isDidVerified: boolean | undefined = await di.verifyDID(
  //     issuer_did,
  //     wallet_address
  //   );
  //   console.log(
  //     `\n${issuer_did} verified: ${String(isDidVerified).toUpperCase()}`
  //   );
  // }, 1000);

  // const cid: string = await di.issueCredential(
  //   universityCredential,
  //   issuer_did,
  //   holder_did
  // );

  // setTimeout(async () => {
  //   const isCredentialVerified: boolean = await di.verifyCredential(
  //     issuer_did,
  //     holder_did,
  //     cid
  //   );
  //   console.log(
  //     `\n${cid} verified: ${String(isCredentialVerified).toUpperCase()}`
  //   );
  // }, 1000);

  // const credentials_holder: string[] = await di.getCredentials(holder_did);
  // const credentials_issuer: string[] = await di.getCredentials(holder_did);
  // console.log(
  //   `\nCredentials of ${holder_did}:\n${credentials_holder}\n\nCredentials of ${issuer_did}:\n${credentials_issuer}`
  // );
};
main();
