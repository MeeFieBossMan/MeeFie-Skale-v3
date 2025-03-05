require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Adding liquidity to Sushiswap...");

    const ROUTER_ADDRESS = "YOUR_ROUTER_ADDRESS"; // Replace with Router address
    const MFIE_ADDRESS = "YOUR_MFIE_ADDRESS"; // Replace with your token address
    const WETH_ADDRESS = "YOUR_WETH_ADDRESS"; // Replace with wrapped native token

    const router = await ethers.getContractAt("UniswapV2Router02", ROUTER_ADDRESS);
    const mfie = await ethers.getContractAt("MeeFieTestToken", MFIE_ADDRESS);
    const weth = await ethers.getContractAt("IERC20", WETH_ADDRESS);

    // Approve Router to spend MFIE and WETH
    const mfieAmount = ethers.parseEther("1000"); // Adjusted: 1000 MFIE
    const wethAmount = ethers.parseEther("1"); // Adjusted: 1 WETH

    console.log("🔹 Approving MFIE...");
    let tx = await mfie.approve(ROUTER_ADDRESS, ethers.parseEther("1000000")); // Large approval to avoid issues
    await tx.wait();
    console.log("✅ Approved MFIE");

    console.log("🔹 Approving WETH...");
    tx = await weth.approve(ROUTER_ADDRESS, ethers.parseEther("1000000")); // Large approval
    await tx.wait();
    console.log("✅ Approved WETH");

    console.log("🔹 Adding Liquidity...");

    try {
        tx = await router.addLiquidity(
            MFIE_ADDRESS,
            WETH_ADDRESS,
            mfieAmount,
            wethAmount,
            0, // Min amount MFIE
            0, // Min amount WETH
            deployer.address,
            Math.floor(Date.now() / 1000) + 60 * 10 // 10 min deadline
        );
        await tx.wait();
        console.log("✅ Liquidity added successfully!");
    } catch (error) {
        console.error("❌ Failed to add liquidity:", error);
    }
}

main().catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
});
s