import { BaseContract } from "ethers";

export interface DIContractInterface extends BaseContract {
  assignDID(did: string): Promise<void>;
  removeDID(index: number, didToRemove: string, lastDid: string): Promise<void>;
  issueCredentials(
    issuer_did: string,
    holder_did: string,
    credential: string
  ): Promise<void>;
  verifyCredential(
    cid: string,
    issuer_did: string,
    holder_did: string
  ): Promise<boolean>;
  authroizeForCredentialAccess(address: string, cid: string): Promise<void>;
  revokeCredentialAccess(address: string, cid: string): Promise<void>;
  getIssuedCredentials(did: string): Promise<string[]>;
  getOwnedCredentials(did: string): Promise<string[]>;
  getDIDs(address: string): Promise<string[]>;
  maxDIDs(): Promise<number>;
  isAuthorizedForCredentialAccess(
    address: string,
    cid: string
  ): Promise<boolean>;
}
