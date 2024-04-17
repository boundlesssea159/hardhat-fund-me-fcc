const {ethers, deployments, getNamedAccounts, network} = require("hardhat")
const {assert, expect} = require("chai")
const {developmentChains} = require("../../helper-hardhat-config")


!developmentChains.includes(network.name) ?
    describe.skip
    : describe("FundMe", async () => {
        let fundMe;
        let deployer;
        const sendValue = ethers.parseEther("1")
        let mockV3Aggregator
        beforeEach(async () => {
            mockV3Aggregator = await ethers.deployContract("MockV3Aggregator", ["8", "200000000000"])
            fundMe = await ethers.deployContract("FundMe", [mockV3Aggregator.target])
            deployer = (await getNamedAccounts()).deployer
        });

        describe("constructor", async () => {
            it("sets the aggregator address correctly", async () => {
                const response = await fundMe.getPriceFeed()
                assert.equal(response, mockV3Aggregator.target)
            })
        })

        describe("fund", async () => {
            it("fails if you don't send enough ETH", async () => {
                await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!")
            })

            it("updated the amount funded data structure", async () => {
                await fundMe.fund({value: sendValue})
                const response = await fundMe.getAddressToAmountFunded(deployer)
                assert.equal(response.toString(), sendValue.toString())
            })

            it("adds funder to array of funders", async () => {
                await fundMe.fund({value: sendValue})
                const funder = await fundMe.getFunders(0)
                assert.equal(funder, deployer)
            })
        })

        describe("withdraw", async () => {

            beforeEach(async () => {
                await fundMe.fund({value: sendValue})
            })

            it("withdraw ETH from a single funder", async () => {
                // Arrange
                const startingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
                const startingDeployerBalance = await ethers.provider.getBalance(deployer)
                // Act
                const transactionResponse = await fundMe.withdraw()
                const transactionReceipt = await transactionResponse.wait(1)
                const {gasUsed, gasPrice} = transactionReceipt
                const gasCost = gasUsed * (gasPrice)
                const endingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
                const endingDeployerBalance = await ethers.provider.getBalance(deployer)
                // Assert
                assert.equal(endingFundMeBalance, 0)
                assert.equal((startingFundMeBalance + startingDeployerBalance).toString(), (endingDeployerBalance + gasCost).toString())
            })

            it("allows us to withdraw with multiple funders", async () => {
                // get multiple accounts
                const singers = await ethers.getSigners();
                // let accounts send funding ETH to contract
                for (let i = 1; i < singers.length; i++) {
                    const singer = singers[i];
                    const fundResponse = await fundMe.connect(singer).fund({value: sendValue})
                    await fundResponse.wait(1)
                }

                const startingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
                const startingDeployerBalance = await ethers.provider.getBalance(deployer)

                // withdraw for owner
                const transactionResponse = await fundMe.withdraw()
                const transactionReceipt = await transactionResponse.wait(1)
                const {gasUsed, gasPrice} = transactionReceipt
                const gasCost = gasUsed * gasPrice

                // assert
                const endingFundMeBalance = await ethers.provider.getBalance(fundMe.target)
                const endingDeployerBalance = await ethers.provider.getBalance(deployer)
                assert.equal(endingFundMeBalance, 0)
                assert.equal(endingDeployerBalance.toString(), (startingDeployerBalance + startingFundMeBalance - gasCost).toString())
                // make sure that the funders are reset properly
                for (let i = 1; i < singers.length; i++) {
                    const singer = singers[i];
                    const response = await fundMe.getAddressToAmountFunded(singer.address)
                    assert.equal(response.toString(), "0")
                }
            })

            it('should only owner can withdraw', async function () {
                let signers = await ethers.getSigners();
                for (let i = 1; i < signers.length; i++) {
                    let signer = signers[i];
                    let contractWithNewAccount = await fundMe.connect(signer);
                    await expect(contractWithNewAccount.withdraw()).to.be.revertedWithCustomError(fundMe, "FundMe_NotOwner")
                }
            });
        })
    })