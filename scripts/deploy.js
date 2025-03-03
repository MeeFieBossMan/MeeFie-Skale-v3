require("dotenv").config();
const { ethers } = require("hardhat"); // ✅ Explicitly import ethers

async function main() {
    console.log("🚀 Deploying MeeFieTestToken...");

    // Get signer (deployer)
    const [deployer] = await ethers.getSigners();
    console.log("✅ Deploying from:", deployer.address);

    // Read deployment variables from .env
    const initialSupply = ethers.parseEther("1000000"); // ✅ Corrected ethers.utils.parseEther
    const treasuryWallet = deployer.address; // Change if needed
    const initialOwner = deployer.address;

    // Get the contract factory
    const MeeFieTestToken = await ethers.getContractFactory("MeeFieTestToken");

    // Deploy contract
    const token = await MeeFieTestToken.deploy(initialSupply, treasuryWallet, initialOwner);

    await token.waitForDeployment(); // ✅ Updated for ethers v6
    const tokenAddress = await token.getAddress(); // ✅ Corrected getting deployed address

    console.log(`✅ MeeFieTestToken deployed to: ${tokenAddress}`);

    // Save deployment details
    console.log(`\n🔹 Deployment Summary:
    Token Name: MeeFieTestToken
    Token Symbol: MFIE
    Token Address: ${tokenAddress}
    Deployed by: ${deployer.address}
    Treasury Wallet: ${treasuryWallet}`);

    // If using a blockchain explorer, verify deployment
    console.log(`🔍 Verify at: ${process.env.BLOCKEXPLORER_URL}/address/${tokenAddress}`);
}

// Execute script
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
