# Chainlink Trial Project
#### Austin Wang

Requirements: 
- Develop a typescript CLI tool for deploying the OCR2Aggregator.sol contract
- Support configuring the feed by calling the 'setBilling' function on the contract
- Ownership of the contract can be transferred to a new owner who can also call 'setBilling'
- Contract configurations and addresses is persisted somewhere for future maintenance

## Usage
##### Step 1: 
Create a new Infura/Alchemy application and add the configuration to a .env file in the root directory.
The .env file should look like this:
```
API_ENDPOINT="https://rinkeby.infura.io/v3/<infura project api link>"
METAMASK_PRIVATE_KEY="<metamask private key>"
```


##### Step 2:
Compile the OCR2Aggregator.sol project by running in terminal `npx hardhat compile`.
The build assets will be located under `./build/artifacts` and `./build/cache`.



##### Step 3:
Build the CLI tool by running in terminal `npm run build`.
The tool's entrypoint will then be built into the `./build/cli` directory.



##### Step 4:
Execute CLI commands by running `./build/cli/Cli.js <command> <contract>`.
 - ex: `./build/cli/Cli.js deploy OCR2Aggregator`
 - ex: `./build/cli/Cli.js call-contract-function OCR2Aggregator`
 - If deploying the contract or calling a contract function requires parameters, the CLI will then ask you to provide those.
 - Currently this CLI only supports using one wallet address at a time. To change the signing walelt, update your private key the .env file


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

##### call-contract-function
We can take in the contract name as part of the initial cli argument, rather than having the user type it out. This is more in line with other CLI tools

