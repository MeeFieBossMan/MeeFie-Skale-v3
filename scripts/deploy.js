require("dotenv").config();
const hre = require("hardhat");

async function main() {
    console.log("Deploying MeeFieTestToken...");

    // Get signer (deployer)
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying from:", deployer.address);

    // Read deployment variables from .env
    const initialSupply = hre.ethers.utils.parseEther("1000000"); // 1M tokens
    const treasuryWallet = deployer.address; // Change if you have a dedicated treasury address
    const initialOwner = deployer.address;

    // Get the contract factory
    const MeeFieTestToken = await hre.ethers.getContractFactory("MeeFieTestToken");

    // Deploy contract
    const token = await MeeFieTestToken.deploy(initialSupply, treasuryWallet, initialOwner);

    await token.deployed();
    console.log("MeeFieTestToken deployed to:", token.address);

    // Save deployment details
    console.log(`\n🔹 Deployment Summary:
    Token Name: MeeFieTestToken
    Token Symbol: MFIE
    Token Address: ${token.address}
    Deployed by: ${deployer.address}
    Treasury Wallet: ${treasuryWallet}`);

    // If using a blockchain explorer, verify deployment
    console.log(`🔍 Verify at: ${process.env.BLOCKEXPLORER_URL}/address/${token.address}`);
}

// Execute script
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
