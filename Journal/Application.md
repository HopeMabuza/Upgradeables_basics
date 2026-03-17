To write a simple UUPS upgradeable contract you need 4 key things:

1. imports 
- ```
    "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol"
     import "@openzeppelin/contracts-upgradeable/acces/OwnableUpgradeable.sol"
     import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol" 
    ```

2. inherite all imported contracts in your contract in the correct sequence
    `contract MyContract is Initializable, OwnableUpgradeable, UUPSUgradeable{}`

3. use libraries in the initializer
    ```
    function initializer() public Initializable {
        __Ownable_init();
        __UUPSUgradeale_nit();
    }
    ```

4. Never forget the upgrade logic function
    ` function _authorizeUpgrade(address newImplementaion) internal override onlyOwner{} `
    only the owner can call this function. It comes with the UUPSUpgradeable library.


A simple deploy script must consist of the following:

1. deploy first implementaion contract
   `const ImplemetaionV1 = await ethers.getContractFactory("MyContractV1");`

2. deploy proxy contract
    `const proxy = await upgrades.deployProxy( ImplementaionV1, [], {initializer: "initialize", kind : "uups"});`

3. when we upgrade you a new implementaion contract
    `const ImplemetaionV2 = ait ethers.getContractFactory("MyContractV2");`
    `await upgrades.upgradeProxy(proxy.getAddress, ImplemetaionV2);`
