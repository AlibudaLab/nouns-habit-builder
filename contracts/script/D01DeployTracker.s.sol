// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {Script} from "forge-std/Script.sol";
import {Tracker} from "../src/Tracker.sol";

contract Deploy is Script {
    address official_verifier = 0x29C3d6b54E2F8Ae641Fc331cF2143B6d05c97897;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        preDeploy();
        deploy();
        postDeploy();
        vm.stopBroadcast();
    }

    function preDeploy() public {}

    function deploy() public {
        address _stakingAsset = vm.envAddress("TESTNET_TOKEN");
        Tracker tracker = new Tracker("Alibuda Habit Builder", "1.0");
        tracker.register(
            address(0x883167E6b5d489B82cB97bEf9C7967afe3A3D299),
            "NFC Challenge 1",
            10,
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            uint64(block.timestamp + 10 days),
            official_verifier,
            address(0),
             _stakingAsset,
            100 * 1e6
        );
        tracker.register(
            address(0xcAb2459DE5C9109B82c3fAc92B5c80209FA53C07),
            "NFC Challenge 2",
            5,
            uint64(block.timestamp + 1 days),
            uint64(block.timestamp + 2 days),
            uint64(block.timestamp + 60 days),
            official_verifier,
            address(0),
             _stakingAsset,
            50 * 1e6
        );
        tracker.register(
            official_verifier,
            "Running Challenge June",
            10,
            1717171200, // June 1
            1719676800, // June 30
            1719676800, // June 30
            official_verifier,
            address(0),
             _stakingAsset,
            25 * 1e6
        );

        tracker.register(
            official_verifier,
            "Workout Challenge June",
            12,
            1717171200, // June 1
            1719676800, // June 30
            1719676800, // June 30
            official_verifier,
            address(0),
             _stakingAsset,
            50 * 1e6
        );

        tracker.register(
            official_verifier,
            "Running Challenge July",
            10,
            1719763200, // July 1
            1722355200, // July 31
            1722355200, // July 31
            official_verifier,
            address(0),
             _stakingAsset,
            25 * 1e6
        );

        tracker.register(
            official_verifier,
            "Workout Challenge July",
            12,
            1719763200, // July 1
            1722355200, // July 31
            1722355200, // July 31
            official_verifier,
            address(0),
             _stakingAsset,
            50 * 1e6
        );
    }

    function postDeploy() public {}
}
