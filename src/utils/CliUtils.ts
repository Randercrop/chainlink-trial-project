import contractToFileMap from '../data/contractToFileMap.json'
import readline from 'readline'

type OCR2AggregatorConstructor = {
    linkContractAddress: string,
    minAnswer: number,
    maxAnswer: number,
    billingAccessController: string,
    requesterAccessController: string,
    decimals: number,
    description: string
}

type ConfirmedOwnerWithProposal = {
    newOwner: string,
    pendingOwner: string    
}


// This function only checks whether the contract name matches what's in /src/data/contractToFileMap.json
export function checkProvidedContractExists (contract: string) {
    if (contractToFileMap[contract as keyof typeof contractToFileMap] === undefined) {
        const availableContracts = Object.keys(contractToFileMap).join('\t')
        console.error(`That contract is unavailable. Try again with a contract from the following list.`)
        console.error(`${availableContracts}`)
        process.exit(0)
    }
}

// Ask the user for a list of inputs. Currenlty used for contract function parameters
export async function getUserParameters(parameters: string[]): Promise<string[]> {
    if (parameters.length < 1) { return Promise.resolve([]) }
    let userResponse: string[] = []

    for (let i = 0; i < parameters.length; i++) {
        userResponse.push(await askQuestion(`Please provide the '${parameters[i]}' parameter: `))
    }

    return userResponse
}

// this creates a new RL interface each time, probably optimizable
export async function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

// Display the list of all contracts. Asks the user which one they want to call
export async function getContractFunctionToCall(contractFunctions: string[]): Promise<string> {
    const question = `\nChoose a function from the following list (case sensitive) \n${contractFunctions.join('\n')} \n\n`

    let response = await askQuestion(question)
    if (contractFunctions.indexOf(response) < 0) { 
        console.error('invalid function name')
        process.exit(0)
    }

    return response
}

export async function getUserProvidedAddress(): Promise<string> {
    return await askQuestion('What address would you like to sign from?  ')
}