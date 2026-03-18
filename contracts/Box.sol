//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract BoxV1 is Initializable, OwnableUpgradeable, UUPSUpgradeable{
    uint256 public value;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();

        value = 50;
    } 

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner{}
}

contract BoxV2 is Initializable, OwnableUpgradeable, UUPSUpgradeable{
    uint256 public value;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();

        value = 50;
    }

    ///@custom:oz-upgrades-validate-as-initializer
    function initialize2() public reinitializer(2) {
        __Ownable_init_unchained(); 
    }

    function increment() public returns(uint256){
        return value += 1;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner{}
}

