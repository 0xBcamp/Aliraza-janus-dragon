// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {DecentralizeIdentity} from "../src/DI.sol";

contract DIDeployScript is Script {
    function run() public returns (DecentralizeIdentity) {
        vm.startBroadcast();
        DecentralizeIdentity di = new DecentralizeIdentity();
        vm.stopBroadcast();
        console.log("Deployed DecentralizedIdentity.sol at: ", address(di));
        return di;
    }
}
