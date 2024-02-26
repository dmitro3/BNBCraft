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
        address gameContract = address(game);
        return gameContract;
    }

    // function to get the game addresses
    function getGameAddresses() public view returns(address[] memory){
        return gameAddresses;
    }
}

/*
GameFactory: 0xE6141d6276120f7DB9C94ACeC3f3AD4da7B04380
Game: 0x3e5929D6d7a3c25654c24FeF9e8C29c09a168C9B
PlayerStatus: 0xF8433fAe984EDB98df3318fa89a821db8c33CB2B

*/
