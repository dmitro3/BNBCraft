require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const privateKey = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.20",
  networks: {
    opBnB: {
      url: "https://opbnb-testnet-rpc.bnbchain.org/",
      accounts: [`0x${privateKey}`],
    },
  },
};
