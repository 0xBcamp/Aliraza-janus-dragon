// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import {console} from "forge-std/Script.sol";

contract DecentralizeIdentity {
    error MAX_DIDs_Created(uint256 _dids);

    enum DIDStatus {
        ACTIVE,
        EXPIRED
    }

    uint8 private constant MAX_DIDs = 10;

    mapping(string did => bytes32[] credentials) private didToCredentials;
    mapping(address => string[]) private addressToDIDs;
    mapping(string => DIDStatus) private didToStatus;
    
    event CredentialIssued(string holder_did, bytes32 credential);

    constructor() {}

    /**
    @dev stores decentralize identifier in the wallet of user
    @param _user the address of the user
    @param _did the decentralize identifier to store
    */
    function assignDID(address _user, string memory _did) external {
        uint256 userDIDs = addressToDIDs[_user].length + 1;
        if (userDIDs > MAX_DIDs) revert MAX_DIDs_Created(userDIDs);
        addressToDIDs[_user].push(_did);
    }

    function removeDID(address _user, string memory _did) external {
        addressToDIDs[_user].length - 1;
        didToStatus[_did] = DIDStatus.EXPIRED;
    }

    /**
    @dev assigns a credential to a decentralize identifier
    @param did the decentralize identifier to assign a credential to
    @param credential the credential to assign, contains the attestation info with the did of the issuer.
    */
    function issueCredentials(string memory did, bytes32 credential) external {
        didToCredentials[did].push(credential);
        emit CredentialIssued(did, credential);
    }

    /**
    Returns all credentials of the holder
    */
    function getCredentials(
        string memory did
    ) external view returns (bytes32[] memory credentials) {
        return didToCredentials[did];
    }

    function getDIDs(address _user) external view returns (string[] memory) {
        return addressToDIDs[_user];
    }

    function maxDIDs() external pure returns (uint8) {
        return MAX_DIDs;
    }

    function getDIDStatus(string memory did) external view returns (DIDStatus) {
        return didToStatus[did];
    }
}
