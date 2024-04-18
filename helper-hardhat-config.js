const networkConfig = {
    31337: {
        name: "localhost",
        ethUsdPriceFeed: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    },
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    }
}

const developmentChains = ["hardhat", "localhost"]
module.exports = {
    networkConfig,
    developmentChains,
}