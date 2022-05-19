import type { Arguments, CommandBuilder } from 'yargs'
import { EthClient } from '../clients/EthClient'
import { checkProvidedContractExists, getUserParameters } from '../utils/CliUtils'
import { getAbiAndBytecodeFromContractName, getRequiredParamsForContract } from '../utils/ContractUtils'
import fs from 'fs'

type deployCommandOptions = {
    contract: string;
};

export const command: string = 'deploy <contract>';


export const builder: CommandBuilder<deployCommandOptions, deployCommandOptions> = (yargs) => {
    return yargs.positional('contract', { type: 'string', demandOption: true })
}

export const handler = (argv: Arguments<deployCommandOptions>): void => {
    const { contract } = argv
    checkProvidedContractExists(contract)

    getParametersAndDeployContract(contract)
};

// Creates an ethereum client using default parameters in .env or parameters passed to the commandline
// We then use the client to deploy the specified contract
const getParametersAndDeployContract = async (contract: string) => {
    try {
        let client = new EthClient()

        let [abi, byteCode, params] = await getContractInfo(contract)
        let txnReceipt = await client.deployContract(abi, byteCode, params)
        writeToFile(JSON.stringify({userParams: params, ...txnReceipt}), contract)
        console.log(`View on etherscan: https://rinkeby.etherscan.io/address/${txnReceipt.contractAddress}/`)
    } catch (err) { 
        console.error(err)
        process.exit(0)
    }
}

// This function checks that the contract has been compiled via hardhat, then passes the Solidity JSON ABI from the build directory
const getContractInfo = async (contract: string) => {
    let [abi, bytecode] = getAbiAndBytecodeFromContractName(contract)
    const constructorParams = getRequiredParamsForContract(contract)

    const userProvidedConstructorParams = await getUserParameters(constructorParams)

    return [abi, bytecode, userProvidedConstructorParams]
}

// Write the transaction receipt to `root/<contractName>TransactionReceipt.json`.
// We also include the user parameteres into the json
// This transaction receipt json is then used later for determining contract address when calling contract functions
const writeToFile = (content: string, contractName: string) => {
    const fileToWrite = `${contractName}TransactionReceipt.json`
    fs.writeFile(fileToWrite, content, (error) => {
        error && console.error('error: ', error)
    })
}