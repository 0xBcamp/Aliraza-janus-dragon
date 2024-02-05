import {
  BaseContract,
  Contract,
  HDNodeWallet,
  JsonRpcProvider,
  Wallet,
  ethers,
} from "ethers";
import { contract_abi, contract_address } from "../contract";
import dotenv from "dotenv";
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

export class DecentralizeIdentityContractInit {
  private provider: JsonRpcProvider;
  private signer: Wallet;
  private wallet: HDNodeWallet;
  private contract: DIContractInterface;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.wallet = ethers.Wallet.fromPhrase(process.env.PHRASE!, this.provider);
    this.signer = new ethers.Wallet(this.wallet.privateKey, this.provider);
    const _contract: Contract = new ethers.Contract(
      contract_address,
      contract_abi,
      this.provider
    );
    this.contract = _contract.connect(this.signer) as DIContractInterface;
  }

  getContract(): DIContractInterface {
    return this.contract;
  }

  getWallet(): HDNodeWallet {
    return this.wallet;
  }

  getSigner(): Wallet {
    return this.signer;
  }

  getProvider(): JsonRpcProvider {
    return this.provider;
  }
}
