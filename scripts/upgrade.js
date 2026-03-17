const {ethers, upgrades} = require("hardhat");

async function main(){
    const PROXY_ADDRESS = "0xe9A4F73A7A1ee4A9B979e979e66d0deAaB5d8abB";

    const implV2 = await ethers.getContractFactory("BoxV2");

    const upgrade = await upgrades.upgradeProxy(PROXY_ADDRESS, implV2, {kind : "uups"});
    await upgrade.waitForDeployment();

    const upgradeAddress = await upgrade.getAddress();
    console.log("Proxy address:");
    console.log("First proxy address:", PROXY_ADDRESS, "same as upgrade address: ", upgradeAddress);

    const V2Address = await upgrades.erc1967.getImplementationAddress(upgradeAddress);
    console.log("New Implementaion address: ", V2Address);
}
main().catch(console.error)

