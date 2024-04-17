require("hardhat")
const {getNamedAccounts, ethers} = require("hardhat");
const {developmentAddress} = require("../helper-hardhat-config");
const {parseEther} = require("ethers");

async function main() {
    let contract = await ethers.getContractAt("FundMe", developmentAddress);
    const transactionResponse = await contract.withdraw()
    await transactionResponse.waitForTransaction()
    console.log("withdraw!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })