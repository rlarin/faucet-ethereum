// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";

contract FaucetContract is Owned {
    // Storage variables
    uint public numOfFunders;
    mapping(address => bool) private funders;
    mapping(uint => address) private lutFunders;

    // Constructor
    constructor() {}

    // Modifiers
    modifier onlyFunders() {
        require(funders[msg.sender], "You are not a funder");
        _;
    }

    modifier limitWithdrawal(uint amount) {
        require(amount <= address(this).balance, "Insufficient funds");
        _;
    }

    // Events

    // Functions
    function receiveFunds() public payable {}

    function addFunds() external payable {
        address funder = msg.sender;
        if (!funders[funder]) {
            funders[funder] = true;
            lutFunders[numOfFunders++] = msg.sender;
        }
    }

    function withdrawFunds(uint amount) external limitWithdrawal(amount) onlyOwner {
        payable(msg.sender).transfer(amount);
    }

    // Fallback function
}
