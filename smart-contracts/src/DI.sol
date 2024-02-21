// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import {console} from "forge-std/Script.sol";

contract DecentralizeIdentity {
    error MAX_DIDs_Created(uint256 _dids);
    error UnauthorizedCredentialsAccess();

    uint8 private constant MAX_DIDs = 10;

    mapping(string holder_did => string[] credentials)
        private didToIssuedCredentials;
    mapping(string issuer_did => string[] credentials)
        private didToOwnedCredentials;
    mapping(address => string[]) private addressToDIDs;
    mapping(address => mapping(string => bool))
        private addressToIsAuthorizedForCredentialAccess;

    event CredentialIssued(
        string indexed issuer,
        string credential,
        string indexed holder
    );
    event DIDAssigned(address indexed user, string indexed did);
    event DIDRemoved(address indexed user, string indexed did);

    /**
    @dev stores decentralize identifier in the wallet of user
    @param _did the decentralize identifier to store
    */
    function assignDID(string memory _did) external {
        uint256 userDIDs = addressToDIDs[msg.sender].length + 1;
        if (userDIDs > MAX_DIDs) revert MAX_DIDs_Created(userDIDs);
        addressToDIDs[msg.sender].push(_did);
        emit DIDAssigned(msg.sender, _did);
    }

    /**
    @dev removes a decentralize identifier from the wallet of user
    @param index the index of the decentralize identifier to remove
    @param didToRemove the decentralize identifier to remove
    @param lastDid the did at the last index of ```addressToDIDs``` array
    */
    function removeDID(
        uint256 index,
        string memory didToRemove,
        string memory lastDid
    ) external {
        addressToDIDs[msg.sender][index] = lastDid;
        addressToDIDs[msg.sender].pop();
        emit DIDRemoved(msg.sender, didToRemove);
    }

    /**
    @dev assigns a credential to a decentralize identifier
    @param issuer_did the decentralize identifier of the issuer
    @param holder_did the decentralize identifier to assign a credential to
    @param credential the cid of the credential to assign, contains the attestation info.
    */
    function issueCredentials(
        string memory issuer_did,
        string memory holder_did,
        string memory credential
    ) external {
        didToIssuedCredentials[issuer_did].push(credential);
        didToOwnedCredentials[holder_did].push(credential);
        emit CredentialIssued(issuer_did, credential, holder_did);
    }

    function authroizeForCredentialAccess(
        address user,
        string memory cid
    ) external {
        addressToIsAuthorizedForCredentialAccess[user][cid] = true;
    }

    function revokeCredentialAccess(address user, string memory cid) external {
        addressToIsAuthorizedForCredentialAccess[user][cid] = false;
    }

    /**
    Returns all issued credentials
    */
    function getIssuedCredentials(
        string memory did
    ) public view returns (string[] memory credentials) {
        bool _isDidOwner = isDidOwner(did, msg.sender);
        if (!_isDidOwner) revert UnauthorizedCredentialsAccess();
        return didToIssuedCredentials[did];
    }

    /**
    Returns all credentials owned by user issued on the provided did
    @param did the decentralize identifier of the user
    */
    function getOwnedCredentials(
        string memory did
    ) public view returns (string[] memory credentials) {
        bool _isDidOwner = isDidOwner(did, msg.sender);
        if (!_isDidOwner) revert UnauthorizedCredentialsAccess();
        return didToOwnedCredentials[did];
    }

    function verifyCredential(
        string memory cid,
        string memory issuer_did,
        string memory holder_did
    ) external view returns (bool) {
        bool issuance_verified = false;
        bool owned_verified = false;
        bytes32 encodedCid = bytes32(abi.encodePacked(cid));
        string[] memory issuer_issued_creds = didToIssuedCredentials[
            issuer_did
        ];
        string[] memory holder_owned_creds = didToOwnedCredentials[holder_did];
        for (uint256 i = 0; i < issuer_issued_creds.length; i++) {
            if (
                bytes32(abi.encodePacked(issuer_issued_creds[i])) == encodedCid
            ) {
                issuance_verified = true;
            }
        }
        for (uint256 i = 0; i < holder_owned_creds.length; i++) {
            if (
                bytes32(abi.encodePacked(holder_owned_creds[i])) == encodedCid
            ) {
                owned_verified = true;
            }
        }
        return issuance_verified && owned_verified;
    }

    function isDidOwner(
        string memory did,
        address owner
    ) internal view returns (bool) {
        bytes32 encodedDId = bytes32(abi.encodePacked(did));
        for (uint256 i = 0; i < addressToDIDs[owner].length; i++) {
            if (
                bytes32(abi.encodePacked(addressToDIDs[owner][i])) == encodedDId
            ) return true;
        }
        return false;
    }

    function getDIDs(address user) external view returns (string[] memory) {
        return addressToDIDs[user];
    }

    function maxDIDs() external pure returns (uint8) {
        return MAX_DIDs;
    }

    function isAuthorizedForCredentialAccess(
        address user,
        string memory cid
    ) public view returns (bool) {
        return addressToIsAuthorizedForCredentialAccess[user][cid];
    }
}
