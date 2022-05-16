import { Arguments, number, string } from 'yargs'
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

export async function getUserParameters(parameters: string[]) {
    let userResponse: string[] = []

    for (let i = 0; i < parameters.length; i++) {
        userResponse.push(await askQuestion(`please provide the ${parameters[i]}: `))
    }

    console.log(userResponse)
    return userResponse
}

// this creates a new interface each time, probably optimizable
async function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}
