const {network, ethers, deployments} = require("hardhat")
const {buildModule} = require("@nomicfoundation/hardhat-ignition/modules");
const {networkConfig} = require("../../helper-hardhat-config");

module.exports = buildModule("FundMeModule", (m) => {
    // we should deploy contract on different chain, local chain is not contain price feed, what should we do?
    console.log("deploying fundeMe contract...")
    const fundMe = m.contract("FundMe", [networkConfig[network.config.chainId]["ethUsdPriceFeed"]]);
    console.log("deploy success! feed data address:", [networkConfig[network.config.chainId]["ethUsdPriceFeed"]])
    return {fundMe};
});
module.exports.tags = ["all", "fundme"];