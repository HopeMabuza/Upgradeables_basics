const {ethers, upgrades} = require("hardhat");

async function main(){
    const implV1 = await ethers.getContractFactory("BoxV1");

    const proxy = await upgrades.deployProxy(implV1, [], 
        {initializer : "initialize", kind : "uups"}
    );

    await proxy.waitForDeployment();
   
    const proxyAddress = await proxy.getAddress();
    console.log("Proxy address: ", proxyAddress);

    const V1Address = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log("ImplememtaionV1 address: ", V1Address);

    const _value = await proxy.value();

    console.log("Initiali value: ", _value.toString());

}
main().catch(console.error)