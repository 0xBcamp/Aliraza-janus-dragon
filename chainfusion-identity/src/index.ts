import { ethers } from "ethers";
import { DecentralizeIdentity } from "./DI";
import dotenv from "dotenv";
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
};
main();
