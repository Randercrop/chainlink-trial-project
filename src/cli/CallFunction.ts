import type { Arguments, CommandBuilder } from 'yargs'
import { EthClient } from '../clients/EthClient'
import { checkProvidedContractExists, 
        getContractFunctionToCall as getUserProvidedContractFunction, 
        getUserParameters } from '../utils/CliUtils'
import { getAbiAndBytecodeFromContractName, 
        getAllFunctionsFromAbi as getAllContractFunctionsFromAbi, 
        getContractAddress, 
        SolidityAbiFormat,
        ContractFunctionsMap
     } from '../utils/ContractUtils'

type CallFunctionCommandOptions = {
    contract: string;
};

export const command: string = 'call-contract-function <contract>';


export const builder: CommandBuilder<CallFunctionCommandOptions, CallFunctionCommandOptions> = (yargs) => {
    return yargs.positional('contract', { type: 'string', demandOption: true })
}

export const handler = async (argv: Arguments<CallFunctionCommandOptions>) => {
    const { contract } = argv
    checkProvidedContractExists(contract)

    // get the contract address from our stored transaction receipt or from user input
    const contractAddress = await getContractAddress(contract)
    const [abi, functionToCall, userProvidedParameters] = await getAbiAndFunctionParameters(contract)

    const client = new EthClient()
    let response = await client.callContractFunction(abi, functionToCall, contractAddress, userProvidedParameters)
    
    console.log(response)    
};

const getAbiAndFunctionParameters = async (contract: string) => { 
    let [abi, bytecode] = getAbiAndBytecodeFromContractName(contract)

    // ethersJS contract instance will give us the functions from the abi. We don't need this, can remove in the future
    // Format the abi into an object where the Key is the name of the function, the value is the data
    let contractFunctions: ContractFunctionsMap = getAllContractFunctionsFromAbi(abi)

    // ask for user input to determine which function from the abi they want to call
    let functionToCall = await getUserProvidedContractFunction(Object.keys(contractFunctions))

    // Using the map and user provided function, get the names of the inputs that are required for this function
    let parametersForUserProvidedFunction = contractFunctions[functionToCall]?.inputs.map(input => input.name, [])
    
    // request user to provide parameters needed for the function
    // @ts-ignore
    let userProvidedParameters = await getUserParameters(parametersForUserProvidedFunction)
    
    return [abi, functionToCall, userProvidedParameters]
}
