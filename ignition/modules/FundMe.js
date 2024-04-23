const {network, deployments} = require("hardhat")
const {buildModule} = require("@nomicfoundation/hardhat-ignition/modules");
const {networkConfig} = require("../../helper-hardhat-config");

module.exports = buildModule("FundMeModule", (m) => {
    // we should deploy contract on different chain, local chain is not contain price feed, what should we do?
    console.log("deploying fundeMe contract...", network.name)
    let fundMe
    if (network.name === "localhost") {
        // todo why can't get MockV3AggregatorModule?
        deployments.get("MockV3AggregatorModule")
            .then((deployment) => {
                fundMe = m.contract("FundMe", [deployment.address]);
                console.log("deploy success in localnetwork ! feed data address:", deployment.address)
            })
            .catch((reason) => {
                console.log("fail reason:", reason)
            })
    } else {
        fundMe = m.contract("FundMe", [networkConfig[network.name]["ethUsdPriceFeed"]]);
        console.log("deploy success in remote network! feed data address:", networkConfig[network.name]["ethUsdPriceFeed"])
    }
    return {fundMe};
});


module.exports.tags = ["all", "fundme"];