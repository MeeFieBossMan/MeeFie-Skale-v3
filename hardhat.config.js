require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20", // MeeFie contract version
      },
      {
        version: "0.6.12", // ✅ Sushiswap version
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    skaleTestnet: {
      url: process.env.SKALE_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY],
      chainId: parseInt(process.env.CHAIN_ID, 16),
    },
  },
};
