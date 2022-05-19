# Chainlink Trial Project
#### Austin Wang

Requirements: 
- Develop a typescript CLI tool for deploying the OCR2Aggregator.sol contract
- Support configuring the feed by calling the 'setBilling' function on the contract
- Ownership of the contract can be transferred to a new owner who can also call 'setBilling'
- Contract configurations and addresses are persisted somewhere for future maintenance

## Usage
##### Step 1: 
Create a new Infura/Alchemy application and add the configuration to a .env file in the root directory.
The .env file should look like this:
```
API_ENDPOINT="https://rinkeby.infura.io/v3/<infura project api link>"
METAMASK_PRIVATE_KEY="<metamask private key>"
```
- If you want to deploy locally, uncomment line 19 in EthClient before compiling and start a hardhat node in a terminal with `npx hardhat node`
- You'll then need to provide an address when signing a transaction


##### Step 2:
Compile the OCR2Aggregator.sol project by running in terminal `npm run buildSolidity`.
The build assets will be located under `./build/artifacts` and `./build/cache`.



##### Step 3:
Build the CLI tool by running in terminal `npm run compile`.
The tool's entrypoint will then be built into the `./build/cli` directory.



##### Step 4:
Execute CLI commands by running `./build/cli/Cli.js <command> <contract>`.
 - ex: `./build/cli/Cli.js deploy LinkToken`
 - ex: `./build/cli/Cli.js call-contract-function OCR2Aggregator` or `npm run callOCR2Functions`
 - If deploying the contract or calling a contract function requires parameters, the CLI will then ask you to provide those.
 - Currently this CLI only supports using one wallet address at a time. To change the signing wallet, update your private key the .env file
 ---
**NOTE**

Deploy will create a `<contractName>TransactionReceipt.json` file. We use thois file to determine contract address when calling functions on the contract. If this file is deleted, we ask the user to provide the contract address, but use the locally compiled abi. 
This file gets replaced with the newest contract Config/address each time you re-run the deploy command.


---


##### Step 5:
Verify using the Rinkeby transaction explorer that the function calls have succeeded: `https://rinkeby.etherscan.io/`

## Expansion
##### Adding new commands to CLI tool
We use yargs to manage our CLI. To add new commands, create a file under `./src/cli` with a 'command', 'builder', 'handler' export.
Documentation: https://yargs.js.org/docs/

##### Adding new contracts
To add a new contract, add a new folder under `/src/contracts` with the contract code. 
Then add the contract name and build path to `/src/data/contractToFileMap.json`. 

##### Support multiple addresses simultaneously
We could allow the user to add more private keys into their .env file, then allow the user to select which address to sign with when performing a transaction or executing a function call


## Nice to Haves
##### call-contract-function
- We can take in the contract name as part of the initial cli argument, rather than having the user type it out. This is more in line with other CLI tools
- Function outputs can be appended to some sort of log file
- Allow user to provide an ABI. We allow them to provide contract address already


##### deploy
- When taking deployment contract parameters, we can get the list of required parameters from the abi. I hardcoded because the list was small and the abi was less descriptive.
- Running the deploy command with an option can tell the script to run hardhat compile prior to deploying
- We should move the transaction receipt file into ./build

##### compile
- Take a parameter to determine which contract to compile. Currnetly we compile all solidity files in the project


###### A funny feature ;)
- If you delete the `<contractName>Transactionreceipt.json` file and provide the normal OCR2Aggregator address when trying to call a function on AccessControlledOCR2Aggregator, the script will grab the AccessControlledOCR2Aggregator.sol functions and will succeed the call. (Interfaces are the same). You're actually calling OCR2Aggregator (that's the contract address provided).