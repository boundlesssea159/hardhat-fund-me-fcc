const {network} = require("hardhat");
const {networkConfig, developmentChains} = require("../helper-hardhat-config");
const {verify} = require("../utils/verify")
const net = require("net");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const networkName = network.name
    let ethUsdPriceFeedAddress
    if (networkName === "hardhat") {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
        console.log("mock ethUsdAggregator address:", ethUsdPriceFeedAddress)
    } else {
        ethUsdPriceFeedAddress = networkConfig[networkName]["ethUsdPriceFeed"]
        console.log("dev ethUsdAggregator address:", ethUsdPriceFeedAddress)
    }
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`FundMe deployed at ${fundMe.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }
}

module.exports.tags = ["all", "fundme"];