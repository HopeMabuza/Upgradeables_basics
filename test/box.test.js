const{ethers, upgrades} = require("hardhat");
const{expect} = require("chai");

describe ("Box Upgradeable Tests", function (){
    let onwer;
    let user1;
    let user2;
    let proxy;
    let V1;
    let V2;

    beforeEach(async function(){
        [onwer, user1, user2] = await ethers.getSigners();

        V1 = await ethers.getContractFactory("BoxV1");
        V2 = await ethers.getContractFactory("BoxV2");

        proxy = await upgrades.deployProxy(V1, [], 
            {initializer: "initialize", kind: "uups"});
        await proxy.waitForDeployment();
    });


    //test deployment
    
})