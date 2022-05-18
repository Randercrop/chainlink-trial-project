import { Contract, ethers } from 'ethers';
import 'dotenv/config';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import * as fs from 'fs'
import { SolidityAbiFormat } from '../utils/ContractUtils';


const { API_ENDPOINT, METAMASK_PRIVATE_KEY, PROJECT_SECRET_KEY } = process.env;

export class EthClient {
    public clientProvider: JsonRpcProvider
    public clientSigner: JsonRpcSigner

    // Construct an Infura client using parameters passed to the constructor
    // if no parameters are passed, default to ropsten and whatever endpoint is provided in the .env file
    constructor(apiKey?: string, network?: string, signerAddress?: string) {
        // uncomment this line to deploy locally
        // this.clientProvider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')

        this.clientProvider = new ethers.providers.JsonRpcProvider(apiKey || API_ENDPOINT, network || 'rinkeby')
        this.clientSigner = this.clientProvider.getSigner(signerAddress)
    }

    // Used to get the current block number. Was used for testing to ensure that contract deployments work
    async getBlockNumber(): Promise<number> {
        const blockNumber = await this.clientProvider.getBlockNumber()
        return blockNumber
    }

    // Deploys the smartcontract to using the abi and bytecode provided
    // contract parameters need to be passed in, but contracts will not have all the same parameters
    async deployContract(abi: SolidityAbiFormat[], byteCode: string, contractParameters: any = []) {

        const contractFactory = new ethers.ContractFactory(abi, byteCode, this.clientSigner)

        const deployedContract = await contractFactory.deploy(...contractParameters)

        let txnReceipt = await deployedContract.deployTransaction.wait()
        return txnReceipt
    }

    static createContractInstance(address: string, abi: SolidityAbiFormat[], signerOrProvider: JsonRpcProvider | JsonRpcSigner): Contract { 
        return new ethers.Contract(address, abi, signerOrProvider)
    }

    async callContractFunction(abi: SolidityAbiFormat[], functionName: string, contractAddress: string, parameters: any[]) {
        const EthContract = EthClient.createContractInstance(contractAddress, abi, this.clientSigner)
        let response = await EthContract[`${functionName}`](...parameters)
        return response
    }

}