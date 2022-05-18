import { Contract, ethers, Signer } from 'ethers'
import 'dotenv/config'
import { JsonRpcProvider } from '@ethersproject/providers'
import * as fs from 'fs'
import { SolidityAbiFormat } from '../utils/ContractUtils'
import { getUserProvidedAddress } from '../utils/CliUtils'


const { API_ENDPOINT, METAMASK_PRIVATE_KEY } = process.env;

export class EthClient {
    public clientProvider: JsonRpcProvider
    public clientSigner: Signer

    // Construct an RpcProvider client using parameters passed to the constructor
    // if no parameters are passed, default to testnet and whatever endpoint is provided in the .env file
    constructor(apiKey?: string, network?: string) {
        // uncomment this line to deploy locally
        // this.clientProvider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')

        this.clientProvider = new ethers.providers.JsonRpcProvider(apiKey || API_ENDPOINT, network || 'rinkeby')


        // Tests for whether we're connected to local node with ':' port number or test net. Can be improved
        if (METAMASK_PRIVATE_KEY && this.clientProvider.connection.url.includes(':')) {
            this.clientSigner = new ethers.Wallet(METAMASK_PRIVATE_KEY, this.clientProvider)
        } else {
            // asks user for address to sign txn's with. We can also update this to a wallet and ask users for private keys
            this.clientSigner = this.clientProvider.getSigner()
            this.getLocalSigner()
        }
    }

    // simple static declaraiton of a contract object. It's only one line so can be ignored
    static createContractInstance(address: string, abi: SolidityAbiFormat[], signerOrProvider: JsonRpcProvider | Signer): Contract { 
        return new ethers.Contract(address, abi, signerOrProvider)
    }


    // Used to get the current block number. Was used for testing to ensure that contract deployments work
    async getBlockNumber(): Promise<number> {
        const blockNumber = await this.clientProvider.getBlockNumber()
        return blockNumber
    }

    async getLocalSigner() {
        let address = await getUserProvidedAddress() || undefined
        this.clientSigner = this.clientProvider.getSigner(address)
    }

    // Deploys the smartcontract to using the abi and bytecode provided
    // contract parameters need to be passed in, but contracts will not have all the same parameters
    async deployContract(abi: SolidityAbiFormat[], byteCode: string, contractParameters: any = []) {

        const contractFactory = new ethers.ContractFactory(abi, byteCode, this.clientSigner)

        const deployedContract = await contractFactory.deploy(...contractParameters)

        let txnReceipt = await deployedContract.deployTransaction.wait()
        return txnReceipt
    }

    // Calls functions on the contract address. We can also accept a Signer and make this a static function
    async callContractFunction(abi: SolidityAbiFormat[], functionName: string, contractAddress: string, parameters: any[]) {
        const EthContract = EthClient.createContractInstance(contractAddress, abi, this.clientSigner)
        let response = await EthContract[`${functionName}`](...parameters)
        return response
    }

}