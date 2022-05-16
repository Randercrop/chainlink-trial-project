import type { Arguments, CommandBuilder } from 'yargs'
import { EthClient } from '../clients/EthClient'
import contractToFileMap from '../data/contractToFileMap.json'
import { checkProvidedContractExists } from './CliUtils'

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
    deployContract(contract)
};

// Creates an ethereum client using default parameters in .env or parameters passed to the commandline
// We then use the client to deploy the specified contract
const deployContract = async (contract: string) => {
    let client = new EthClient()

    let [abi, byteCode, params] = getAbiAndByteCodeFromContractName(contract)
    await client.deployContract(abi, byteCode, params)
}

// This function checks that the contract has been compiled via hardhat, then passes the Solidity JSON ABI from the build directory
const getAbiAndByteCodeFromContractName = (contract: string) => {
    const contractData = contractToFileMap[contract as keyof typeof contractToFileMap] || ''
    const contractArtifact = require(`../../${contractData.path}`)

    if (!contractArtifact['abi'] || !contractArtifact['bytecode']) {
        console.error(`That contract exists, but hasn't been compiled yet. Try running \`./build/cli/Cli.js compile ${contract}\``)
        process.exit(0)
    }

    return [contractArtifact['abi'], contractArtifact['bytecode'], contractData.constructorParams]
}
