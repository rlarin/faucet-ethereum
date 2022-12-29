// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

abstract contract Logger {
    uint public numOfLogs;

    constructor() {
        numOfLogs = 0;
        }

    function emitLog() public virtual returns (bytes32);

    function getNumOfLogs() public view returns (uint) {
        return numOfLogs;
    }
}
