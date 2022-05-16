import { ethers } from 'ethers';
import 'dotenv/config';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';


const { API_ENDPOINT, METAMASK_PRIVATE_KEY, PROJECT_SECRET_KEY } = process.env;

export class EthClient {
    private clientProvider: JsonRpcProvider
    private clientSigner: JsonRpcSigner

    // Construct an Infura client using parameters passed to the constructor
    // if no parameters are passed, default to ropsten and whatever endpoint is provided in the .env file
    constructor(apiKey?: string, network?: string, ) {
        // this.infuraProvider = new ethers.providers.JsonRpcProvider(apiKey || API_ENDPOINT, network || 'ropsten')
        this.clientProvider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
        this.clientSigner = this.clientProvider.getSigner()
        console.log(this.clientProvider)
    }

    async getBlockNumber(): Promise<number> {
        const blockNumber = await this.clientProvider.getBlockNumber()
        return blockNumber
    }

    // Deploys the smartcontract to using the abi and bytecode provided
    // contract parameters need to be passed in, but contracts will not have all the same parameters
    async deployContract(abi: any[], byteCode: string, contractParameters?: any[]) {
        const zeroAddress = "0x000000000000000000000000000000000000000000"
        const constructorParams = [zeroAddress, 0, 20000, zeroAddress, zeroAddress, 5, "testDescription"]

        const contractFactory = new ethers.ContractFactory(abi, byteCode, this.clientSigner)
        const deployedContract = await contractFactory.deploy(...constructorParams )

        console.log(deployedContract.address)
        await deployedContract.deployTransaction.wait()
        await deployedContract.value()
    }
}