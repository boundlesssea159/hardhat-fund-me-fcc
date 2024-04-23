require("hardhat")
const {developmentFeedDataAddress} = require("../helper-hardhat-config");

async function main() {
    let contract = await ethers.getContractAt("FundMe", developmentFeedDataAddress);
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