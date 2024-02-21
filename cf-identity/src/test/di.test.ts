import { HDNodeWallet, JsonRpcProvider, ethers } from "ethers";
import { DecentralizeIdentity } from "../DI";
import { describe, expect, test } from "@jest/globals";
import dotenv from "dotenv";

// sample credential
const universityCredential: string = JSON.stringify({
  name: "Stanford University",
  degree: "Masters",
  program: "Computer Science",
  date: new Date().toISOString(),
  did: "did:university:d104ff2d80c041e91259a9e567b554f359d6986ab95e672cbcc1be16e9c4961a",
});

dotenv.config();

describe("Decentralized Identity", () => {
  const provider: JsonRpcProvider = new ethers.JsonRpcProvider(
    process.env.LOCAL_RPC_URL
  );
  const wallet: HDNodeWallet = ethers.Wallet.fromPhrase(
    process.env.LOCAL_PHRASE!,
    provider
  );
  const signer: HDNodeWallet = wallet.connect(provider);
  const address: string = signer.address;
  const holder_wallet: HDNodeWallet =
    ethers.Wallet.createRandom(provider).connect(provider);
  const holder_address: string = holder_wallet.address;
  const di = new DecentralizeIdentity(signer, process.env.IPFS_STORAGE_KEY!);
  const did_name: string = "test6";
  const issuer_did: string = di.createIdentifier(did_name, address);
  const holder_did: string = di.createIdentifier(did_name, holder_address);
  const credential: string = universityCredential;
  let uc_cid: string | undefined;

  test("should create correct DID", async () => {
    const did = di.createIdentifier(did_name, address);
    expect(did).toMatch(/^did:[\w-]+:[\w-]+$/);
  });

  test("should store the DID on chain", async () => {
    const did: string = di.createIdentifier(did_name, address);
    const no_of_dids_before: number = (await di.getDIDs(address))!.length;
    await di.storeDID(did, address);
    const user_dids: string[] = (await di.getDIDs(address))!;
    expect(user_dids.length).toBeGreaterThanOrEqual(no_of_dids_before + 1);
    expect(user_dids).toContainEqual(did);
  });

  test.failing("should not store if the DID already exists", async () => {
    const did: string = di.createIdentifier(did_name, address);
    const no_of_dids_before: number = (await di.getDIDs(address))!.length;
    await di.storeDID(did, address);
    const user_dids: string[] = (await di.getDIDs(address))!;
    expect(user_dids.length).toBeGreaterThanOrEqual(no_of_dids_before + 1);
    await expect(di.storeDID(did, address)).rejects.toThrow();
  });

  test("should issue credentials to the holder correctly", async () => {
    // storing holder did on chain so that issue credentials doen't throw error
    await di.storeDID(holder_did, holder_address);
    uc_cid = await di.issueCredential({
      issuer_did: issuer_did,
      issuer_address: address,
      holder_did: holder_did,
      holder_address: holder_address,
      credential: credential,
    });
    const issuer_issued_credentials: string[] = await di.getIssuedCredentials(
      issuer_did
    );
    const holder_issued_credentials: string[] = await di.getHoldedCredentials(
      holder_did
    );
    expect(issuer_issued_credentials).toContainEqual(uc_cid);
    expect(holder_issued_credentials).toContainEqual(uc_cid);
  });

  test("should return TRUE on valid credentials", async () => {
    const isCredentialValid: boolean = await di.verifyCredential(
      issuer_did,
      holder_did,
      uc_cid!
    );
    expect(isCredentialValid).toBe(true);
  });

  test("should return FALSE on invalid credentials", async () => {
    const isCredentialValid: boolean = await di.verifyCredential(
      issuer_did,
      holder_did,
      "invalid_credential_cid"
    );
    expect(isCredentialValid).toBe(false);
  });
});
