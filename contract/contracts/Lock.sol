// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock {
    address payable public owner;

    event Withdrawal(uint amount, uint when);
    event Deposit(uint amount, uint when);

    constructor() payable {
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Owner is %o and sender is %o", owner, msg.sender);

        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }

    function deposit() payable public {
        emit Deposit(msg.value, block.timestamp);
    }
}
