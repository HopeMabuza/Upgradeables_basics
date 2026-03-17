Smart Contracts are made to be immutable so that no one can temper with the code and change logic once it is deployed to the blockchain.

But as developers we know that code can always be improved or have bugs.

It is hard to fix a bug or improve and add features to smart contracts because you have to deploy a new contract.
All the state of the initial contract must be transfered to the newly deployed contract.
Users must migrate to the new contract.

This process in painful and causes users to lose trust on the application.

To solve this problem they came up with upgradeable smart contracts.
Unlike the normal smart contracts where the state and logic is stored in one contract.
We separate the state and address to be in one contract.
And the logic to be in another contract.

The contract with the state and the address is called the proxy - it never changes and it is the one the user interacts with.
The contract with the logic is the implementation contract, it is the one that changes.

The proxy interacts with the implementation contract using `delegatecall` a function that executes the called function and updates the storage of the proxy.


With upgradeable smart contracts came a new problem. 
Proxies have their own storage first, which means if the proxy contract has state variables, the first state variable will occupy slot 0.
But when we call functions in implementation contract via delegatecall, they also store inside the proxy contract. 
The first state variable in the implementation contract will overwrite the state variable in slot 0 from the proxy contract.
This causes a contract brick.

Storage layout
   - The rule for upgradeable smart contracts is to new change the sequence of state variables in the upgrade.
    - Never replace state variables in an upgrade.
    -Just add new state varibales after the state variables that are already there.

EIP-1967 slots
   - hashed slots that are far away to store the implementaion and admin address so that normal state variables will never interfer with them.

Storage gaps
    - reserving storage for future updates, usually 50 slots
    - it is an openzepellin library that reserves space for future updates and for every state variable you add, you have you decrease the gap size.
    ```
        //initial gap
        uint256[50] private __gap;

        //when adding new state variables
        uint256[48] private __gap;
    ```

As we discussed above, the proxy contract will have administrative functions and the implementaion contract will have application functions.
Meaning in the proxy we have functions that can only be called by the admin.
And in the implementaion we have functions that can only be called by the user.

But what happens if both contracts have functions with the same name, which function will be called by the user, and which will be called by the admin.
This problem is called the function selector collision.

The Transparent Proxy Pattern solves this problem by having restrictions on the functions with the same name and parameters.
We put a require statement for a function that will be called by the admin and is in the proxy.
Otherwise, it will be delegated to the implementation function.

But the Transparent Proxy Pattern has 3 seperate contracts.
Admin - responsible for upgrades in proxy.
Proxy - responsible for storing the state and delegating calls.
Implementaion  - execute logic functions.

With each and every function call, the admin contract must check if the caller is the admin and are they trying to upgrade the implementaion contract.
If not, it goes to the proxy to delegatecall or run an admin function.
This proccess uses a lot of gas even though it is highly secure.


To solve the problems that come with the Transparent Proxy Pattern the UUPS (Universal Upgradable Proxy Standard) was created.
Developers wanted to simplify the proxy and have everything else in the implementaion contract.

Now we only have 2 contracts:
proxy - stores state and delegatecall
implementation - logic functions and upgrade logic function

This decreases gas costs because the proxy is simplified and doesnt have the check every call if its the admin.

But now we have a new problem, what if I upgrade into a new contract but forget to put the  `upgradeTo` function ?
The contract is locked, it can never be upgraded again.
This is why we use OpenZeppelin for our upgrades so that we avoid mistakes like that by using their libraries like UUPSUgradeable, Initializable, OwnableUpgradeable

Constructor vs Initializer 
We cannot use a construtor in an implementaion contract because the flow of deploying is as follow:
deploy implememntaion contract ==> deploy proxy with implementaion address ==> user interacts with proxy

if we use a constructor, the state will be initialized in the immplementaion contract upon deployment and implementation contracts are striclty for logic fumctions.

We use initializer instead so that the proxy can initialize the state upon deployment or immediately after deployment so that the state is initailized in the proxy.

We simplify this by using OpenZeppelin Initializable library that makes sure the initialize funstion is only called once and only by the owner. 
Because if the an attacker initailizes the contract, they will be the owner and they can do whatever they want with the contract.

We even have libraries for ERC20 upgradeable contracts, inside the initalizer we can have `__ERC20_init__("tokenName", "tokenSymbol")`, this replaces the constructor in upgradeable contracts. 

We have the function below to replace the constructor:
    ```
        ///@custom:oz-upgrade-unsafe-allow constructor
        constructor (){
            _disableInitializer();
        }
    ```
This function protects your contract from attackers, when you deploy your proxy contract, the implementation contract is also deployed and anyone can access it on chain.
The attacker may try to interact with the implementation contract direclty, and if i has something like, `owner = msg.sender;`. The attacker will become the owner.
Now they have the authority to add new functions to take sensitive information or add maliciuos logic in the contract








