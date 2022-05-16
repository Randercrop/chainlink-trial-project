import * as hre from 'hardhat'

export const command: string = 'compile';

export const handler = (): void => {
    compileAllContracts()
};

const compileAllContracts = () => {
    hre.run("compile")
}