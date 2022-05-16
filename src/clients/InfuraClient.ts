import { ethers } from 'ethers';
import 'dotenv/config';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';


const { API_ENDPOINT, METAMASK_PRIVATE_KEY, PROJECT_SECRET_KEY } = process.env;
export class InfuraClient {
    private infuraProvider: JsonRpcProvider

    // Construct an Infura client using parameters passed to the constructor
    // if no parameters are passed, default to ropsten and whatever endpoint is provided in the .env file
    constructor(apiKey?: string, network?: string, ) {
        this.infuraProvider = new ethers.providers.JsonRpcProvider(apiKey || API_ENDPOINT, network || 'ropsten')
        console.log(this.infuraProvider)
    }

    async getBlockNumber(): Promise<number> {
        const blockNumber = await this.infuraProvider.getBlockNumber()
        return blockNumber
    }

    async deployContract(abi: any[], byteCode: string) {
        const contractFactory = new ethers.ContractFactory(abi, byteCode)
    }
}