require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying Wrapped Token...");

    // Deploy a simple Wrapped token (WETH equivalent)
    const WETH = await ethers.getContractFactory("WETH9");
    const weth = await WETH.deploy();

    await weth.waitForDeployment();
    const wethAddress = await weth.getAddress();
    console.log("✅ Wrapped Token deployed at:", wethAddress);
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
});
