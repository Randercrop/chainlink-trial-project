import type { Arguments, CommandBuilder } from 'yargs';
import { EthClient } from '../clients/EthClient';
import contractToFileMap from '../data/contractToFileMap.json';

type deployCommandOptions = {
    contract: string;
};

export const command: string = 'deploy <contract>';


export const builder: CommandBuilder<deployCommandOptions, deployCommandOptions> = (yargs) => {
    return yargs.positional('contract', { type: 'string', demandOption: true })
}


export const handler = (argv: Arguments<deployCommandOptions>): void => {
    performArgumentValidation(argv)
    const { contract } = argv
    deployContract(contract)
};

// This function only checks whether the contract name matches what's in /src/data/contractToFileMap.json
const performArgumentValidation = (argv: Arguments<deployCommandOptions>) => {
    const { contract } = argv
    if (contractToFileMap[contract as keyof typeof contractToFileMap] === undefined) {
        const availableContracts = Object.keys(contractToFileMap)
        console.error(`That contract doesn't exist. Try again with ${availableContracts}`)
        process.exit(0)
    }
}

// Creates an 
const deployContract = async (contract: string) => {
    let client = new EthClient()
    const currentBlockNumber = await client.getBlockNumber()
    console.log(currentBlockNumber)
    let [abi, byteCode] = getAbiAndByteCodeFromContractName(contract)
    await client.deployContract(abi, byteCode)
}

// This function checks that the contract has been compiled via hardhat, then passes the Solidity JSON ABI from the build directory
const getAbiAndByteCodeFromContractName = (contract: string) => {
    const contractArtifactPath = contractToFileMap[contract as keyof typeof contractToFileMap] || ''
    const contractArtifact = require(contractArtifactPath)

    if (!contractArtifact['abi'] || !contractArtifact['bytecode']) {
        console.error(`That contract exists, but hasn't been compiled yet. Try running \`./build/cli/Cli.js compile ${contract}\``)
        process.exit(0)
    }

    return [contractArtifact['abi'], contractArtifact['bytecode']]
}