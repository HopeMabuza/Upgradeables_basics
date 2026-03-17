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

    it("Should set deployer as owner", async function(){
    expect(await proxy.owner()).to.equal(await onwer)
    });

    it("Should set deployer as owner", async function(){
        expect(await proxy.owner()).to.equal(await onwer.getAddress());
    });

    it("Should deploy with 50 as initial value", async function(){
        const _value = await proxy.value();
        expect(_value).to.equal(50);
    });

    it("Should revert when I call initialize again", async function(){
        await expect(proxy.initialize()).to.be.revertedWith('Initializable: contract is already initialized');
    });

    it("Should revert when non owner tries to upgrade", async function(){
        const proxyAddress = await proxy.getAddress();
        const V2AsUser1 = V2.connect(user1);

        await expect(upgrades.upgradeProxy(proxyAddress, V2AsUser1)).to.be.reverted;
    });

    it("Should have same state after upgrade", async function(){
        const proxyAddress = await proxy.getAddress();
        await upgrades.upgradeProxy(proxyAddress, V2);

        const _value = await proxy.value();

        expect(_value).to.be.equal(50);
    });

    it("Should increase value when I increment", async function(){
        const proxyAddress = await proxy.getAddress();

        const initialValue = await proxy.value();

        const _proxy = await upgrades.upgradeProxy(proxyAddress, V2);
        await _proxy.waitForDeployment();
        

        await _proxy.increment();

        const newValue = await _proxy.value();

        expect(newValue).to.be.gt(initialValue);
    });


    it("Should increment value by exactly 1", async function(){
        const proxyAddress = await proxy.getAddress();
        const _proxy = await upgrades.upgradeProxy(proxyAddress, V2);
        await _proxy.waitForDeployment();

        await _proxy.increment();

        expect(await _proxy.value()).to.equal(51);
    });

    it("Should revert when initialize is called again after upgrade", async function(){
        const proxyAddress = await proxy.getAddress();
        const _proxy = await upgrades.upgradeProxy(proxyAddress, V2);
        await _proxy.waitForDeployment();

        await expect(_proxy.initialize()).to.be.reverted;
    });

    
});