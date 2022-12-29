// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract FaucetContract {
    // Storage variables
    address public owner;
    uint public numOfFunders;
    mapping(address => bool) private funders;
    mapping(uint => address) private lutFunders;

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

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

    function getAllFunders() public view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);
        for (uint i = 0; i < numOfFunders; i++) {
            _funders[i] = funders[i];
        }
        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        return funders[index];
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    // Fallback function
}
