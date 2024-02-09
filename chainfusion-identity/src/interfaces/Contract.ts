import dotenv from "dotenv";
import { BaseContract } from "ethers";
dotenv.config();

enum DIDStatus {
  ACTIVE,
  EXPIRED,
}
export interface DIContractInterface extends BaseContract {
  assignDID(user: string, did: string): Promise<void>;
  removeDID(user: string, did: string): Promise<void>;
  issueCredentials(
    issuer_did: string,
    holder_did: string,
    credential: string
  ): Promise<void>;
  getIssuedCredentials(did: string): Promise<string[]>;
  getHoldedCredentials(did: string): Promise<string[]>;
  getDIDs(user: string): Promise<string[]>;
  maxDIDs(): Promise<number>;
  getDIDStatus(did: string): Promise<DIDStatus>;
}
