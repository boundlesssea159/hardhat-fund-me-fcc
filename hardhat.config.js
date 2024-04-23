require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter")
require("solidity-coverage")
require("@nomicfoundation/hardhat-verify")
require("hardhat-deploy")

const vars = require("hardhat/config").vars;

const RPC_KEY = vars.get("RPC_KEY");

const PRIVATE_KEY = vars.get("PRIVATE_KEY");

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337
            // gasPrice: 130000000000,
        },
        sepolia: {
            url: RPC_KEY,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6
        }
    },
    // etherscan: {
    //   apiKey: ETHERSCAN_API_KEY,
    //   // customChains: [], // uncomment this line if you are getting a TypeError: customChains is not iterable
    // },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0 // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        }
    },
    mocha: {
        timeout: 500000
    },
    solidity: {
        compilers: [
            {
                version: "0.8.8"
            },
            {
                version: "0.8.0"
            }
        ]
    }
};
