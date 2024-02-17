// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Game is Ownable {
    string public greenfield;
    uint public price;

    constructor(string memory _greenfield, uint _price) Ownable(msg.sender) {
        greenfield = _greenfield;
        price = _price;
    }

    // purchased players metamask address to player contract address
    mapping(address => address) private players;

    function setGreenfield(string memory _greenfield) public {
        greenfield = _greenfield;
    }


    // function to buy the game
    function buyGame() external payable {
        require(players[msg.sender] == address(0), "You have already bought the game");
        require(msg.value == price, "Insufficient funds");

        payable(owner()).transfer(msg.value);

        players[msg.sender] = msg.sender;
    }

}
