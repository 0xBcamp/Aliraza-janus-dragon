import { createHash } from "crypto";
import {
  AbstractSigner,
  BaseContract,
  Contract,
  HDNodeWallet,
  JsonRpcSigner,
  Signer,
  ethers,
} from "ethers";
import { DIContractInterface } from "./interfaces/Contract";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import dotenv from "dotenv";
import {
  contract_abi,
  contract_address,
  test_contract_abi,
  test_contract_address,
} from "./contract";
import assert from "assert";
import { Certificate, User } from "./types/types";
import axios from "axios";

dotenv.config();

export class DecentralizeIdentity {
  private contract: DIContractInterface;
  storage: ThirdwebStorage;

  constructor(signer: JsonRpcSigner | Signer, storage_secret_key: string) {
    const _contract: Contract = new ethers.Contract(
      contract_address,
      contract_abi,
      signer.provider
    );
    this.contract = _contract.connect(signer) as DIContractInterface;
    this.storage = new ThirdwebStorage({
      secretKey: storage_secret_key,
    });
  }

  /**
   * @param address - wallet address of the user
   * @param name - name of the identifier
   * @returns decentralize identifier (did)
   */
  createIdentifier = (name: string, address: string): string => {
    const hashable: string = name + address;
    const did: string =
      `did:${name}:` + createHash("sha256").update(hashable).digest("hex");
    return did;
  };

  /**
   * @dev This function stores the DID in the wallet of the user on the blockchain. This is necessary for verifying credentials.
   * @param did decentralize identifier
   * @param address wallet address of user
   */
  storeDID = async (did: string, address: string) => {
    try {
      const isValidDid: boolean = await this.verifyDID(did, address);
      if (isValidDid) {
        throw new Error("DID already exists");
      } else {
        await this.contract.assignDID(did, { from: address });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // removeDID = async (did: string, address: string) => {
  //   try {
  //     this.contract.removeDID(did, { from: address });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  /**
   * @notice This function do double verification of the did, both OnChain and OffChain.
   * @param did decentralize identifier of the user to verify
   * @param address public key/wallet address
   * @returns verification check (TRUE or FALSE)
   */
  verifyDID = async (did: string, address: string): Promise<boolean> => {
    try {
      const cid_hash: string = did.split(":")[2];
      assert(
        /^did:.+:[a-z0-9]+$/.test(did) && cid_hash.length === 64,
        "Invalid DID"
      );
      // const user_dids: string[] = await this.contract.getDIDs({from:address});
      const user_did: string = await this.contract.getDID({ from: address });
      const isDidOnChainVerified: boolean = user_did == did;
      const name: string = did.split(":")[1];
      const expected_did: string = this.createIdentifier(name, address);
      return did === expected_did && isDidOnChainVerified;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  PinImageToIpfs = async (file: any) => {
    const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS"; // no need to remove this
    const form_data = new FormData();
    form_data.append("file", file);

    try {
      const headers = {
        // pinata_api_key: "c3137cb993709c8b676b",
        // pinata_secret_api_key:
        //   "04fa8f75276ea59b39c5eb16ec2b5f9fb3b122d1568f94f6530e47adc686ca50",
        pinata_api_key: "867f448b2339066a900f",
        pinata_secret_api_key:
          "619d4d54f8b5d57c8836aa50c4552700383a1676a756596918eea1487c90a345",
      };

      const axiosInstance = axios.create({
        baseURL: pinataEndpoint,
        maxContentLength: Infinity,
        headers: headers,
      });

      const response = await axiosInstance.post("", form_data);
      const imageHash = response.data.IpfsHash;
      console.log(imageHash);
      return imageHash;
    } catch (err) {
      throw err;
    }
  };

  issueCertificate = async (data: Certificate): Promise<string | undefined> => {
    const {
      certificate,
      holder_address,
      holder_did,
      issuer_address,
      issuer_did,
    } = data;
    const isIssuerDidVerified: boolean = await this.verifyDID(
      issuer_did,
      issuer_address
    );
    const isHolderDidVerified: boolean = await this.verifyDID(
      holder_did,
      holder_address
    );
    if (!isIssuerDidVerified || !isHolderDidVerified) {
      throw new Error("Invalid Issuer or Holder DID");
    } else {
      try {
        const certificate_uri = await this.PinImageToIpfs(certificate);
        console.log(certificate_uri);
        // const ipfs_cid: string = await this.storage.upload(credential);
        // const cid: string = ipfs_cid.split("/")[2];
        // checking if the credentials have not been issued already
        const issued_credentials: string[] = (
          await this.getUserData(issuer_did)
        ).issued_certificates;
        if (issued_credentials.includes(certificate_uri)) {
          throw new Error("Credentils issued already!");
        } else {
          await this.contract.issueCertificate(
            issuer_did,
            holder_did,
            certificate_uri
          );
          return certificate_uri;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  issueBulkCertificates = async (
    data: Certificate
  ): Promise<string[] | undefined> => {
    const {
      certificate,
      holder_address,
      holder_did,
      issuer_address,
      issuer_did,
    } = data;
    const isIssuerDidVerified: boolean = await this.verifyDID(
      issuer_did,
      issuer_address
    );
    const isHolderDidVerified: boolean = await this.verifyDID(
      holder_did,
      holder_address
    );
    if (!isIssuerDidVerified || !isHolderDidVerified) {
      throw new Error("Invalid Issuer or Holder DID");
    } else {
      try {
        const certificates_uris = await Promise.all(
          certificate.map(async (c: any) => await this.PinImageToIpfs(c))
        );
        console.log(certificates_uris);
        // const ipfs_cid: string = await this.storage.upload(credential);
        // const cid: string = ipfs_cid.split("/")[2];
        // checking if the credentials have not been issued already
        const issued_credentials_uris: string[] = (
          await this.getUserData(issuer_did)
        ).issued_certificates;
        // const duplicate_cert_uris = issued_credentials.filter((uri) => certificates_uris.includes(uri));
        const unique_cert_uris: string[] = issued_credentials_uris.filter(
          (uri) => !certificates_uris.includes(uri)
        );
        console.log(unique_cert_uris);
        await this.contract.issueBulkCertificates(
          issuer_did,
          holder_did,
          unique_cert_uris
        );
        return unique_cert_uris;
      } catch (error) {
        console.log(error);
      }
    }
  };

  /**
   *
   * @param certificate_uri cid of the credential to verify
   * @param issuer_address address of the issuer of certificate
   * @param holder_address address of the holder of certificate
   */
  verifyCertificate = async (
    issuer_address: string,
    holder_address: string,
    credential_uri: string
  ): Promise<boolean> => {
    const issuer_certificates: string[] = await this.getIssuedCertificates(
      issuer_address
    );
    const holder_cerrificates: string[] = await this.getOwnedCertificates(
      holder_address
    );
    return (
      issuer_certificates.includes(credential_uri) &&
      holder_cerrificates.includes(credential_uri)
    );
  };

  /**
   * @param did decentralize identifier of the user
   * @returns User data.
   * @notice Check USER schema in types.ts
   */
  getUserData = async (did: string): Promise<User> => {
    const user_data = await this.contract.getUserData(did);
    return user_data;
  };

  /**
   * Get data of all owned certificates of the user
   * @param did decentralize identifier of the user
   * @returns certificates data of the user
   */
  getOwnedCertificatesData = async (did: string) => {
    try {
      const user_owned_certificates_uris = (
        await this.contract.getUserData(did)
      ).owned_certificates;
      const data = await Promise.all(
        user_owned_certificates_uris.map(async (uri: string) => {
          try {
            const cert_data = await this.URIToData(uri);
            return cert_data;
          } catch (error) {
            console.error(`Error fetching data from ${uri}:`, error);
            return {};
          }
        })
      );
      return data;
    } catch (error) {
      console.error("Error retrieving user certificates data:", error);
      throw error;
    }
  };

  /**
   * @param did decentralize identifier of the user
   * @returns all of the certificates issued by the user
   */
  getIssuedCertificates = async (did: string): Promise<string[]> => {
    const user_data = await this.getUserData(did);
    const issuer_certificates: string[] = user_data.issued_certificates;
    return issuer_certificates;
  };

  /**
   * @param did decentralize identifier of the user
   * @returns all of the credentials, the user is holding
   */
  getOwnedCertificates = async (did: string): Promise<string[]> => {
    const user_data = await this.getUserData(did);
    const issuer_certificates: string[] = user_data.owned_certificates;
    return issuer_certificates;
  };

  // /**
  //  *
  //  * @param address wallet address of the user
  //  * @returns the decentralize identifiers of the user
  //  */
  // getDIDs = async (address: string): Promise<string[] | undefined> => {
  //   try {
  //     const dids = await this.contract.getDIDs({ from: address });
  //     return dids;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  /**
   * @param address wallet address of the user
   * @returns the decentralize identifiers of the user
   */
  getUserDID = async (address: string): Promise<string | undefined> => {
    try {
      const did = await this.contract.getDID({ from: address });
      return did;
    } catch (error) {
      console.log(error);
    }
  };

  URIToData = async (uri: string): Promise<any> => {
    try {
      const fetch_url = `https://ipfs.io/ipfs/${uri}`;
      const response = await fetch(fetch_url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${uri}`);
      }
      const data: any = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching data from ${uri}:`, error);
      throw error;
    }
  };

  // getMaxDIDs = async (): Promise<number> => {
  //   const max_dids: number = await this.contract.maxDIDs();
  //   return max_dids;
  // };

  getContractAddress = async (): Promise<string> => {
    const address: string = await this.contract.getAddress();
    return address;
  };
}
