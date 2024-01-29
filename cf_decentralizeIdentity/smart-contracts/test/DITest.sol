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
    bytes32 public credential_hash = bytes32("credential_123");

    error MAX_DIDs_Created(uint256 _dids);

    function setUp() public {
        diDeployScript = new DIDeployScript();
        di = diDeployScript.run();
    }

    function test_ShouldAssignDidToUser() public {
        di.assignDID(msg.sender, issuer_did);
        string[] memory userDids = di.getDIDs(msg.sender);
        string memory expectedUserDid = userDids[0];
        uint256 currentUserDidsLength = di.getDIDs(msg.sender).length;
        assertEq(currentUserDidsLength, 1);
        assertEq(expectedUserDid, issuer_did);
    }

    function test_ShouldRevertOnMaxDIDs() public {
        for (uint8 i = 0; i < 10; i++) {
            di.assignDID(msg.sender, issuer_did);
        }
        uint256 user_dids = di.getDIDs(msg.sender).length + 1;
        vm.expectRevert(
            abi.encodeWithSelector(MAX_DIDs_Created.selector, user_dids)
        );
        di.assignDID(msg.sender, issuer_did);
    }

    function test_ShouldIssueCredentialsToHolder() public {
        di.issueCredentials(holder_did, credential_hash);
        bytes32[] memory credentials = di.getCredentials(holder_did);
        assertEq(credentials.length, 1);
        assertEq(credentials[0], credential_hash);
    }
}
