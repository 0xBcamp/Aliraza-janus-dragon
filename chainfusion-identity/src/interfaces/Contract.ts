import { BaseContract } from "ethers";

enum DIDStatus {
  ACTIVE,
  EXPIRED,
}

export interface DIContractInterface extends BaseContract {
  assignDID(did: string, options?: any): Promise<void>;
  removeDID(did: string, options?: any): Promise<void>;
  issueCredentials(
    issuer_did: string,
    holder_did: string,
    credential: string
  ): Promise<void>;
  getIssuedCredentials(did: string): Promise<string[]>;
  getHoldedCredentials(did: string): Promise<string[]>;
  getDIDs(options?: any): Promise<string[]>;
  maxDIDs(): Promise<number>;
  getDIDStatus(did: string): Promise<DIDStatus>;
}