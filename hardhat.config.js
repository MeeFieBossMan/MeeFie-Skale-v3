require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    skaleTestnet: {
      url: process.env.SKALE_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY],
      chainId: parseInt(process.env.CHAIN_ID, 16), // Convert hex chain ID to decimal
    },
  },
};
