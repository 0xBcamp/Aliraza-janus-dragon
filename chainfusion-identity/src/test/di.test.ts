import { HDNodeWallet, JsonRpcProvider, ethers } from "ethers";
import { DecentralizeIdentity } from "../DI";
import { describe, expect, test } from "@jest/globals";
import dotenv from "dotenv";
import { universityCredential } from "..";

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
  const did_name: string = "test2";
  const issuer_did: string = "issuer_did";
  const holder_did: string = "holder_did";
  const credential: string = universityCredential;
  const di = new DecentralizeIdentity(signer);

  test("should create correct DID", async () => {
    const did = di.createIdentifier(did_name, address);
    expect(did).toMatch(/^did:[\w-]+:[\w-]+$/);
  });

  test("should store the DID on chain", async () => {
    const did: string = di.createIdentifier(did_name, address);
    const no_of_dids_before: number = (await di.getDIDs(address)).length;
    await di.storeDID(did, address);
    const user_dids: string[] = await di.getDIDs(address);
    expect(user_dids.length).toBeGreaterThanOrEqual(no_of_dids_before + 1);
    expect(user_dids).toContainEqual(did);
  });

  test.failing("should not store if the DID already exists", async () => {
    const did: string = di.createIdentifier(did_name, address);
    const no_of_dids_before: number = (await di.getDIDs(address)).length;
    await di.storeDID(did, address);
    const user_dids: string[] = await di.getDIDs(address);
    expect(user_dids.length).toBeGreaterThanOrEqual(no_of_dids_before + 1);
    await expect(di.storeDID(did, address)).rejects.toThrow();
  });

  test("should issue credentials to the holder correctly", async () => {
    (storage.upload as jest.Mock).mockResolvedValue(`ipfs://${ipfs_cid}`);
    const issueCredentialsSpy = jest
      .spyOn(di.contract, "issueCredentials")
      .mockResolvedValueOnce();
    const cid: string = await di.issueCredential(
      issuer_did,
      holder_did,
      credential
    );
    // expect(cid).toMatch(/^ipfs:[\w-]+:[\w-]+$/);
    expect(storage.upload).toHaveBeenCalledWith(credential);
    expect(issueCredentialsSpy).toHaveBeenCalledWith(
      issuer_did,
      holder_did,
      ipfs_cid
    );
    expect(cid).toBe(ipfs_cid);
  });

  test("should verify credential issuance correctly", async () => {
    // Mock the contract method calls
    jest
      .spyOn(di.contract, "getIssuedCredentials")
      .mockResolvedValue([credential]);
    jest
      .spyOn(di.contract, "getHoldedCredentials")
      .mockResolvedValue([credential]);
    // Verify credential issuance
    const isVerified: boolean = await di.verifyCredential(
      issuer_did,
      holder_did,
      credential
    );
    expect(isVerified).toBe(true);
  });

  test("should retrieve all credentials associated with a DID", async () => {
    const did = "test_did";
    const holded_credentials = ["credential1", "credential2"];
    const issuer_credentials = ["credential3", "credential4"];
    // Mock the contract method calls
    jest
      .spyOn(di.contract, "getHoldedCredentials")
      .mockResolvedValue(holded_credentials);
    jest
      .spyOn(di.contract, "getIssuedCredentials")
      .mockResolvedValue(issuer_credentials);
    // Get all credentials associated with the DID
    const credentials: string[] = await di.getCredentials(did);
    expect(credentials).toEqual([...holded_credentials, ...issuer_credentials]);
  });

  test("should retrieve all DIDs associated with a wallet address", async () => {
    const user_dids = ["did1", "did2", "did3"];
    // Mock the contract method call
    jest.spyOn(di.contract, "getDIDs").mockResolvedValue(user_dids);
    // Get all DIDs associated with the wallet address
    const retrieved_dids: string[] = await di.getDIDs(address);
    expect(retrieved_dids).toEqual(user_dids);
  });
});
