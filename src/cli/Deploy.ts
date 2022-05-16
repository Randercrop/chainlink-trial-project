import type { Arguments, CommandBuilder } from 'yargs';
import { InfuraClient } from '../clients/InfuraClient';

type deployCommandOptions = {
    contract: string;
};

export const command: string = 'deploy <contract>';


export const builder: CommandBuilder<deployCommandOptions, deployCommandOptions> = (yargs) => {
    return yargs.positional('contract', { type: 'string', demandOption: true })
}


export const handler = (argv: Arguments<deployCommandOptions>): void => {
    
    performArgumentValidation(argv)
    const { contract } = argv;
    deployContract(contract)

};

const performArgumentValidation = (argv: Arguments<deployCommandOptions>) => {
    try {
        
    } catch (err) { 
        console.log('Invalid input! Try running with --help to view usage.')
        process.exit(0);
    }
}

const deployContract = async (contract: string) => {
    let client = new InfuraClient()
    const currentBlockNumber = await client.getBlockNumber()
}