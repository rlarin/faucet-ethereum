// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Interfaces can only inherit from other interfaces

interface IFaucet {
    function receiveFunds() external payable;
    function addFunds() external payable;
    function withdrawFunds(uint amount) external;
}
