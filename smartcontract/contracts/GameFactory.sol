// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./Game.sol";

contract GameFactory {
    address[] private gameAddresses;

    // function to create a new game
    function createGame(string memory _name, string memory _greenfield, uint _price, string[] memory _tasks) public returns (address){
        Game game = new Game(_name, _greenfield, _price, _tasks);  
        gameAddresses.push(address(game));
        game.transferOwnership(msg.sender);
        return address(game);
    }

    // function to get the game addresses
    function getGameAddresses() public view returns(address[] memory){
        return gameAddresses;
    }
}
