# Chainlink Trial Project
#### Austin Wang

Requirements: 
- Develop a typescript CLI tool for deploying the OCR2Aggregator.sol contract
- Support configuring the feed by calling the 'setBilling' function on the contract
- Ownership of the contract can be transferred to a new owner who can also call 'setBilling'
- Contract configurations and addresses is persisted somewhere for future maintenance

## Usage
##### Step 1: 
Create a new Infura application and add the configuration to a .env file in the root directory.
The .env file should look like this:
```
API_ENDPOINT="https://ropsten.infura.io/v3/<infura project api link>"
METAMASK_PRIVATE_KEY="<metamask private key>"
PROJECT_SECRET_KEY="<infura project secret key>"
```



##### Step 2:
Compile the OCR2Aggregator.sol project by running in terminal `npx hardhat compile`.
The build assets will be located under `./build/artifacts` and `./build/cache`.



##### Step 3:
Build the CLI tool by running in terminal `npm run build`.
The tool's entrypoint will then be built into the `./build/cli` directory.



##### Step 4:
Execute CLI commands by running `./build/cli/Cli.js deploy OCR2Aggregator`. 