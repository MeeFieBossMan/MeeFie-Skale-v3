require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying Sushiswap Factory from:", deployer.address);

    // Deploy Factory contract
    const Factory = await ethers.getContractFactory("UniswapV2Factory");
    const factory = await Factory.deploy(deployer.address); // Set deployer as feeToSetter

    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log("✅ Sushiswap Factory deployed at:", factoryAddress);
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
});
