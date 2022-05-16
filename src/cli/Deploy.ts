import type { Arguments, CommandBuilder } from 'yargs'
import { EthClient } from '../clients/EthClient'
import contractToFileMap from '../data/contractToFileMap.json'
import { checkProvidedContractExists, getUserParameters } from '../utils/CliUtils'
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
    let client = new EthClient()

    let [abi, byteCode, params] = await getContractInfo(contract)
    let txnReceipt = await client.deployContract(abi, byteCode, params)
    writeToFile(JSON.stringify(txnReceipt), contract)
    console.log(txnReceipt)
}

// This function checks that the contract has been compiled via hardhat, then passes the Solidity JSON ABI from the build directory
const getContractInfo = async (contract: string) => {
    const contractData = contractToFileMap[contract as keyof typeof contractToFileMap] || ''
    const contractArtifact = require(`../../${contractData.path}`)

    if (!contractArtifact['abi'] || !contractArtifact['bytecode']) {
        console.error(`That contract exists, but hasn't been compiled yet. Try running \`./build/cli/Cli.js compile ${contract}\``)
        process.exit(0)
    }

    const userConstructorParams = await getUserParameters(contractData.constructorParams)

    return [contractArtifact['abi'], contractArtifact['bytecode'], userConstructorParams]
}

const writeToFile = (content: string, contractName: string) => {
    console.log('writing to file')
    const fileToWrite = `${contractName}data.json`
    fs.writeFile(fileToWrite, content, (error) => {
        error && console.log('error: ', error)
    })
}