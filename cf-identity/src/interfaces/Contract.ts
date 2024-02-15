import { BaseContract } from "ethers";

enum DIDStatus {
  ACTIVE,
  EXPIRED,
}

export interface DIContractInterface extends BaseContract {
  assignDID(did: string): Promise<void>;
  removeDID(did: string): Promise<void>;
  issueCredentials(
    issuer_did: string,
    holder_did: string,
    credential: string
  ): Promise<void>;
  getIssuedCredentials(did: string): Promise<string[]>;
  getHoldedCredentials(did: string): Promise<string[]>;
  getDIDs(address: string): Promise<string[]>;
  maxDIDs(): Promise<number>;
  getDIDStatus(did: string): Promise<DIDStatus>;
}
