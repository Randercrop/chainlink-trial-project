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

    getParametersAndCallContractFunction(contract)
};

const getParametersAndCallContractFunction = async (contract: string) => { 

    // get the contract address from our stored transaction receipt or from user input
    const contractAddress = await getContractAddress(contract)

    // get parameters necessary for making the call to the contract.
    // abi is pulled from the hardhat compile build files
    // functionToCall is a string provided by the user
    // userProvidedParameters combines the abi and functionToCall to ask the user for necessary parameters
    const [abi, functionToCall, userProvidedParameters] = await getAbiAndFunctionParameters(contract)

    const client = new EthClient()
    try {
        let response = await client.callContractFunction(abi, functionToCall, contractAddress, userProvidedParameters)
    
        // response only holds the pre-confirmation response. If we want to see the output logs, we need to call response.wait()
        // We would write to an external log here
        if (response.wait !== undefined) { 
            let res = await response.wait()
            console.log(res)
            console.log(`view on etherscan! https://rinkeby.etherscan.io/tx/${res.transactionHash}`)
        } else {
            console.log(response)
        }
    } catch (err) {
        console.error(err)
        process.exit(0)
    }
    
}

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
