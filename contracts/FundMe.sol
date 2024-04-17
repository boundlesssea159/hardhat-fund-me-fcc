// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";
import "hardhat/console.sol";


    error FundMe_NotOwner();

contract FundMe {
    using PriceConverter for uint256;
    mapping(address => uint256) private s_addressToAmountFunded;
    address[] private s_funders;
    address private immutable  i_owner;
    uint256 private constant MINIMUM_USD = 50 * 1e18;

    AggregatorV3Interface private s_priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "You need to spend more ETH!"
        );
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert FundMe_NotOwner();
        _;
    }

    function withdraw() public onlyOwner {
        address [] memory funders = s_funders;
        uint256 length = funders.length;
        for (uint256 funderIndex = 0; funderIndex < length; funderIndex++) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool callSuccess,) = payable(msg.sender).call{
                value: address(this).balance
            }("");
        require(callSuccess, "Call failed");
    }

    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }

    function getOwner() public view returns (address)  {
        return i_owner;
    }

    function getFunders(uint256 index) public view returns (address)  {
        return s_funders[index];
    }

    function getAddressToAmountFunded(address funder) public view returns (uint256)  {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface)  {
        return s_priceFeed;
    }
}
