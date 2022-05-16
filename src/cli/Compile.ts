import type { Arguments, CommandBuilder } from 'yargs'


type CompileCommandOptions = {
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

const performArgumentValidation = (argv: Arguments<deployCommandOptions>) => {
    try {
        const { contract } = argv
        if (contractToFileMap[contract as keyof typeof contractToFileMap] === undefined) {
            const availableContracts = Object.keys(contractToFileMap)
            console.error(`That contract is unavailable. Try again with ${availableContracts}`)
        }
    } catch (err) { 
        console.log('Invalid input! Try running with --help to view usage.')
        process.exit(0);
    }
}