import { createHash } from "crypto";
import { BaseContract, HDNodeWallet } from "ethers";
import { DecentralizeIdentityContractInit, DIContractInterface } from "./Contract";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

export class DecentralizeIdentity {
    contract_init: DecentralizeIdentityContractInit;
    contract: DIContractInterface;

    constructor() {
        this.contract_init = new DecentralizeIdentityContractInit();
        this.contract = this.contract_init.getContract();
        const _helia_init = async () => {
        }
        _helia_init();
    }
  
    /**
     * @param address - wallet address of the user
     * @param name - name of the identifier
     * @returns decentralize identifier
     */
    createIdentifier = (name: string, address: string): string => {
      const hashable: string = name + address;
      const did: string =
        `did:${name}:` + createHash("sha256").update(hashable).digest("hex");
      return did;
    };
  
    /**
     * @dev This function stores the DID in the wallet of the user on the blockchain
     * @param did decentralize identifier
     * @param address wallet address of user
     */
    storeDID = async (did: string, address: string) => {
      try{
        console.log(`Storing DID {${did}} on address {${address}}...`);
        await this.contract.assignDID(address, did);
        console.log(`ONCHAIN => Identity assigned successfully.`);
    } catch(error){
        console.log(error);
      }
    }
  
    /**
     * @notice This function do double verification of the did on both OnChain and OffChain.
     * @param did decentralize identifier of the user to verify
     * @param address public key/wallet address
     * @returns verification check (TRUE or FALSE)
     */
    verifyDID = async (did: string, address: string): Promise<boolean | undefined> => {
      try{
        console.log("Verifying Identity...");
        const user_dids: string[] = await this.contract.getDIDs(address);
        const isDidOnChainVerified: boolean = user_dids.includes(did);
        const name: string = did.split(":")[1];
        const expected_did:string = this.createIdentifier(name, address);
        return did === expected_did && isDidOnChainVerified;
      } catch(error){
        console.log(error);
      }
    };
  
    issueCredential = async (credential: any,issuer_did: string, holder_did: string) => {
      // get credential hash
      // console.log(`Issued Credential: CID => ${cid}`);
      // return cid;
    }
  
    verifyCredential = async () => {}
  }