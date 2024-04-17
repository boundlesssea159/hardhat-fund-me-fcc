const {network, ethers, deployments} = require("hardhat")
const {buildModule} = require("@nomicfoundation/hardhat-ignition/modules");
const {networkConfig} = require("../../helper-hardhat-config");


module.exports = buildModule("FundMeModule", (m) => {
    // we should deploy contract on different chain, local chain is not contain price feed, what should we do?
    let fundMe;
    console.log("deploying fundeMe contract...")
    if (network.config.chainId === 31337) {
        fundMe = m.contract("FundMe", deployments.get("MockV3Aggregator"))
    } else {
        fundMe = m.contract("FundMe", [networkConfig[network.config.chainId]["ethUsdPriceFeed"]]);
    }
    return {fundMe};
});


module.exports.tags = ["fundme"];