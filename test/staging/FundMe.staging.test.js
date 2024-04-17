const {ethers, deployments} = require("hardhat")
const {assert, expect} = require("chai")
const {developmentChains, developmentAddress} = require("../../helper-hardhat-config")

developmentChains.includes(network.name) ?
    describe.skip
    : describe('FundMe', function () {
        let fundMe;
        let deployer;
        const sendValue = ethers.parseEther("0.1")
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            fundMe = await ethers.getContractAt("FundMe", developmentAddress);
        });

        it('should allow people to fund and withdraw', async function () {
            await fundMe.fund({value: sendValue})
            await fundMe.withdraw()
            let balance = await ethers.provider.getBalance(fundMe.target);
            assert.equal(balance.toString(), "0")
        });
    });