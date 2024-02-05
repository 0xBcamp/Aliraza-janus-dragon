import { DecentralizeIdentity } from "./interfaces/DI";

// sample credential
const universityCredential: string = JSON.stringify({
  name: "Stanford University",
  degree: "Masters",
  program: "Computer Science",
  date: new Date().toISOString(),
  did: "did:university:d104ff2d80c041e91259a9e567b554f359d6986ab95e672cbcc1be16e9c4961a",
});

const main = async () => {
  console.log("Server running on port 3000...");
  const di: DecentralizeIdentity = new DecentralizeIdentity();
  const wallet_address: string = di.contract_init.getWallet().address;
  console.log(`User: ${wallet_address}`);
  const issuer_did: string = di.createIdentifier("university", wallet_address);
  const holder_did: string = di.createIdentifier(
    "education",
    "0x672BeB69B7129762fB2847bdA5f73E75029c9349"
  );
  console.log(`Issuer DID: ${issuer_did}`);
  console.log(`Holder DID: ${holder_did}`);
  // await di.issueCredential(universityCredential, issuer_did, holder_did);
  // console.log(`Holder Decentralize Identifier: ${holder_did}`);
  // const holder_address: string = "0x672BeB69B7129762fB2847bdA5f73E75029c9349";
  // await decentralizedIdentity.storeDID(issuer_did, wallet.address);
  // setTimeout(async () => {
  //   const isDidVerified: boolean | undefined = await di.verifyDID(issuer_did, wallet_address);
  //   console.log(`\n${issuer_did} verified: ${String(isDidVerified).toUpperCase()}`);
  // }, 1000);
};
main();
