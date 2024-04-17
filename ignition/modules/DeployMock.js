// deploy a mock contract
// if it was a test contract, how can we test our logic?

const { network } = require("hardhat")
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const DECIMALS = "8"
const INITIAL_PRICE = "200000000000" // 2000

module.exports = buildModule("MockV3AggregatorModule", (m) => {
    const mockV3Aggregator = m.contract("MockV3Aggregator", [DECIMALS, INITIAL_PRICE]);
    console.log("mock contract deployed!");
    return { mockV3Aggregator };
});

module.exports.tags = ["all", "mocks"]