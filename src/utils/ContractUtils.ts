import contractToFileMap from '../data/contractToFileMap.json'
import { askQuestion }  from './CliUtils'

type inputOutputType = {
    indexed?: boolean,
    internalType?: string,
    name?: string,
    type?: string
}
export type SolidityAbiFormat = {
    inputs: inputOutputType[],
    name: string,
    type: string,
    anonymous?: boolean,
    outputs?: inputOutputType[],
    stateMutability?: string,
}

export type ContractFunctionsMap = {
    [key: string]: SolidityAbiFormat
}

// This references the hardcoded build path in ./src/data/contractToFileMap and pulls the abi/bytecode from that path
export function getAbiAndBytecodeFromContractName(contract: string) {
    const contractData = getContractMetadata(contract)
    const contractArtifact = require(`../../${contractData.path}`)

    if (!contractArtifact['abi'] || !contractArtifact['bytecode']) {
        console.error("couldn't find an abi or bytecode for that contract")
        process.exit(0)
    }
    return [contractArtifact['abi'], contractArtifact['bytecode']]
}

function getContractMetadata(contract: string) {
    return contractToFileMap[contract as keyof typeof contractToFileMap]
}

// hardcoded parameters needed to deploy the contract. We can probably pull these from the abi
export function getRequiredParamsForContract(contract: string) {
    const contractData = getContractMetadata(contract)
    return contractData.constructorParams
}

// Iterates through the abi and creates the ContractFunctionsMap
export function getAllFunctionsFromAbi(abi: SolidityAbiFormat[]): ContractFunctionsMap {
    let allFunctions: ContractFunctionsMap = {}
    abi.forEach((callInterface: SolidityAbiFormat) => {
        if (callInterface.type === 'function') {
            allFunctions[callInterface.name] = callInterface
        }
    })
    return allFunctions
}

// This function will try to look at script-generated files to see if the specified contract
// was deployed using our cli (locally). If not, we can also specify the address to connect to (testnets)
export async function getContractAddress(contract: string): Promise<string> {
    const txnReceiptFile = `../../${contract}TransactionReceipt.json`

    try {
        const txnReceipt = require(txnReceiptFile)
        return txnReceipt['contractAddress']
    } catch (err) { 
        return await askQuestion('Transaction receipt for the specified contract not found. You can enter it:  ')
    }
}