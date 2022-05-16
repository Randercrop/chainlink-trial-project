/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config();
const { API_ENDPOINT, METAMASK_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.4.11",
      },
      {
        version: "0.4.24",
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          }
        },
      },
    ],
  },
  paths: {
    sources: "./src/contracts",
    cache: "./build/cache",
    artifacts: "./build/artifacts"  
  },
  
  networks: {
    hardhat: {
      blockGasLimit: 0x1fffffffffffff, 
      allowUnlimitedContractSize: true,
    },
    ropsten: {
      url: API_ENDPOINT,
      accounts: [`0x${METAMASK_PRIVATE_KEY}`]
    }
 },
};
