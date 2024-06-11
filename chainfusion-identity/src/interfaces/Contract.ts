import { BaseContract } from "ethers";
import { User } from "../types/types";

enum DIDStatus {
  ACTIVE,
  EXPIRED,
}

export interface DIContractInterface extends BaseContract {
  assignDID(did: string, options?: any): Promise<void>;
  // removeDID(did: string, options?: any): Promise<void>;
  issueCertificate(
    issuer_did: string,
    receiver_did: string,
    certificate_uri: string
  ): Promise<void>;
  issueBulkCertificates(
    issuer_did: string,
    receiver_did: string,
    certificates_uris: string[]): Promise<void>
  getUserData(did: string): Promise<User>;
  // getIssuedCredentials(did: string): Promise<string[]>;
  // getHoldedCredentials(did: string): Promise<string[]>;
  // getDIDs(options?: any): Promise<string[]>;
  getDID(options: any): Promise<string>;
  // maxDIDs(): Promise<number>;
  // getDIDStatus(did: string): Promise<DIDStatus>;
}
