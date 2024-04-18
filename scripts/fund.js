import {getContractAt} from "@nomicfoundation/hardhat-ethers/internal/helpers";
import {developmentFeedDataAddress} from "../helper-hardhat-config";
import {parseEther} from "ethers";
import {ethers} from "hardhat"

async function main() {
    let contract = await ethers.getContractAt("FundMe", developmentFeedDataAddress);
    const transactionResponse = await contract.fund({value: parseEther("0.1")})
    await transactionResponse.waitForTransaction()
    console.log("funded!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })