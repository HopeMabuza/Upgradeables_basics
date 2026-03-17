//SPDX-Licensed-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract BoxV1 is Initializable, OwnableUpgradeable, UUPSUpgradeable{
    uint256 value;

    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();

        value = 50;
    } 

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner{}
}