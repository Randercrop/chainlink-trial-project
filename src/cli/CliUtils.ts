import type { Arguments } from 'yargs'
import contractToFileMap from '../data/contractToFileMap.json'


// This function only checks whether the contract name matches what's in /src/data/contractToFileMap.json
export function checkProvidedContractExists (contract: string) {
    if (contractToFileMap[contract as keyof typeof contractToFileMap] === undefined) {
        const availableContracts = Object.keys(contractToFileMap).join('\t')
        console.error(`That contract is unavailable. Try again with a contract from the following list.`)
        console.error(`${availableContracts}`)
        process.exit(0)
    }
}