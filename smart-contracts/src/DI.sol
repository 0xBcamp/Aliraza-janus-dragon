// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import {console} from "forge-std/Script.sol";

contract DecentralizeIdentity {
    error MAX_DIDs_Created(uint256 _dids);
    error Unauthorized();
    error UNDEFINED_OR_EXPIRED_DID();

    enum DIDStatus {
        UNDEFINED,
        ACTIVE,
        EXPIRED
    }

    uint8 private constant MAX_DIDs = 10;

    mapping(string holder_did => string[] credentials)
        private didToIssuedCredentials;
    mapping(string issuer_did => string[] credentials)
        private didToHoldedCredentials;
    mapping(address => string[]) private addressToDIDs;
    mapping(string => DIDStatus) private didToStatus;

    event CredentialIssued(
        string indexed issuer,
        string credential,
        string indexed holder
    );
    event DIDAssigned(address indexed user, string indexed did);
    event DIDRemoved(address indexed user, string indexed did);

    constructor() {}

    /**
    @dev stores decentralize identifier in the wallet of user
    @param _did the decentralize identifier to store
    */
    function assignDID(string memory _did) external {
        uint256 userDIDs = addressToDIDs[msg.sender].length + 1;
        if (userDIDs > MAX_DIDs) revert MAX_DIDs_Created(userDIDs);
        addressToDIDs[msg.sender].push(_did);
        didToStatus[_did] = DIDStatus.ACTIVE;
        emit DIDAssigned(msg.sender, _did);
    }

    function removeDID(string memory _did) external {
        if (didToStatus[_did] != DIDStatus.ACTIVE)
            revert UNDEFINED_OR_EXPIRED_DID();
        addressToDIDs[msg.sender].length - 1;
        didToStatus[_did] = DIDStatus.EXPIRED;
        emit DIDRemoved(msg.sender, _did);
    }

    /**
    @dev assigns a credential to a decentralize identifier
    @param issuer_did the decentralize identifier of the issuer
    @param holder_did the decentralize identifier to assign a credential to
    @param credential the credential to assign, contains the attestation info with the did of the issuer.
    */
    function issueCredentials(
        string memory issuer_did,
        string memory holder_did,
        string memory credential
    ) external {
        didToIssuedCredentials[issuer_did].push(credential);
        didToHoldedCredentials[holder_did].push(credential);
        emit CredentialIssued(issuer_did, credential, holder_did);
    }

    /**
    Returns all issued credentials 
    */
    function getIssuedCredentials(
        string memory did
    ) external view returns (string[] memory credentials) {
        return didToIssuedCredentials[did];
    }

    /**
    Returns all holded credentials
    */
    function getHoldedCredentials(
        string memory did
    ) external view returns (string[] memory credentials) {
        return didToHoldedCredentials[did];
    }

    function getDIDs(address _user) external view returns (string[] memory) {
        return addressToDIDs[_user];
    }

    function maxDIDs() external pure returns (uint8) {
        return MAX_DIDs;
    }

    function getDIDStatus(string memory did) public view returns (DIDStatus) {
        return didToStatus[did];
    }
}
