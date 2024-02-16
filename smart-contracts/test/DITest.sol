// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/Script.sol";
import {DecentralizeIdentity} from "../src/DI.sol";
import {DIDeployScript} from "../script/DIDeploy.sol";

contract DITest is Test {
    DecentralizeIdentity public di;
    DIDeployScript public diDeployScript;
    address public issuer = vm.addr(123);
    address public holder = vm.addr(456);
    address public verifier = vm.addr(789);
    string public issuer_did =
        "did:college:09fdd71c65e0dad736ac3fc201c49ecaf00b3840a544b5150c8aad68c58919aa";
    string public holder_did =
        "did:education:09fdd71c65e0dad736ac3fc201c49ecaf00b3840a544b5150c8aad68c58919aa";
    string public credential_hash = "QxHaSHasd434DXvdbvdghgsSHgSsjKSz";

    error MAX_DIDs_Created(uint256 _dids);
    error UnauthorizedCredentialsAccess();

    function setUp() public {
        diDeployScript = new DIDeployScript();
        di = diDeployScript.run();
    }

    function test_ShouldAssignDidToUser() public {
        vm.startPrank(issuer);
        di.assignDID(issuer_did);
        string[] memory userDids = di.getDIDs(issuer);
        string memory expectedUserDid = userDids[0];
        uint256 currentUserDidsLength = di.getDIDs(issuer).length;
        assertEq(currentUserDidsLength, 1);
        assertEq(expectedUserDid, issuer_did);
        vm.stopPrank();
    }

    function test_ShouldRevertOnMaxDIDs() public {
        for (uint8 i = 0; i < 10; i++) {
            vm.prank(issuer);
            di.assignDID(issuer_did);
        }
        uint256 user_dids = di.getDIDs(issuer).length + 1;
        vm.expectRevert(
            abi.encodeWithSelector(MAX_DIDs_Created.selector, user_dids)
        );
        vm.prank(issuer);
        di.assignDID(issuer_did);
    }

    function test_ShouldIssueCredentialsToHolder() public {
        di.issueCredentials(issuer_did, holder_did, credential_hash);
        vm.startPrank(holder);
        di.assignDID(holder_did);
        string[] memory holder_credentials = di.getOwnedCredentials(holder_did);
        string[] memory issuer_credentials = di.getOwnedCredentials(holder_did);
        vm.stopPrank();
        assertEq(holder_credentials.length, 1);
        assertEq(holder_credentials[0], credential_hash);
        assertEq(issuer_credentials.length, 1);
        assertEq(issuer_credentials[0], credential_hash);
    }

    function test_ShouldRevertOnRemovingTheDIDWhichDoesNotExists() public {
        vm.prank(issuer);
        di.assignDID("did:test:XYZ");
        string memory randomDID = "did:random:XYZ";
        vm.prank(issuer);
        vm.expectRevert();
        di.removeDID(1, randomDID, randomDID);
    }

    function test_ShouldNotAllowCredentialsAccessToInvalidDidOwner() public {
        vm.expectRevert(
            abi.encodeWithSelector(UnauthorizedCredentialsAccess.selector)
        );
        vm.prank(issuer);
        di.getOwnedCredentials(holder_did);
    }

    function test_ShouldAllowCredentialAccessToValidDidOwner() public {
        vm.prank(holder);
        di.assignDID(holder_did);
        vm.prank(issuer);
        di.assignDID(issuer_did);
        di.issueCredentials(issuer_did, holder_did, credential_hash);
        vm.prank(holder);
        string[] memory holder_owned_credentials = di.getOwnedCredentials(
            holder_did
        );
        vm.prank(issuer);
        string[] memory issuer_issued_credentials = di.getIssuedCredentials(
            issuer_did
        );
        assertEq(holder_owned_credentials.length, 1);
        assertEq(holder_owned_credentials[0], credential_hash);
        assertEq(issuer_issued_credentials.length, 1);
        assertEq(issuer_issued_credentials[0], credential_hash);
    }

    // Verify Credential

    function test_ShouldReturnTrueOnValidCredential() public {
        vm.prank(issuer);
        di.issueCredentials(issuer_did, holder_did, credential_hash);
        bool isValidCredential = di.verifyCredential(
            credential_hash,
            issuer_did,
            holder_did
        );
        assert(isValidCredential == true);
    }
}
