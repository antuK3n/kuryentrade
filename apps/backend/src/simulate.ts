import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const KURYENTRADE_SYSTEM_ABI = [
  "function claimGeneration(uint256 tokenId, uint256 kwhGenerated)",
  "function getSystemData(uint256 tokenId) view returns (tuple(uint256 capacityWatts, bytes32 locationHash, uint256 installationDate, bytes32 hardwareId, uint8 state, uint256 totalGenerated, uint256 lastClaimTime))",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function totalSystems() view returns (uint256)",
];

async function simulateGeneration() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");

  // Use admin wallet for simulation
  const wallet = new ethers.Wallet(
    process.env.ORACLE_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
  );

  const contractAddress = process.env.KURYENTRADE_SYSTEM_NFT || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const contract = new ethers.Contract(contractAddress, KURYENTRADE_SYSTEM_ABI, wallet);

  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║         KuryenTrade IoT Simulation Started                ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("");

  // Get total systems
  const totalSystems = await contract.totalSystems();
  console.log(`Found ${totalSystems} registered systems\n`);

  // Simulate generation for each system every 10 seconds
  setInterval(async () => {
    for (let tokenId = 1; tokenId <= Number(totalSystems); tokenId++) {
      try {
        const data = await contract.getSystemData(tokenId);
        const capacityKw = Number(data.capacityWatts) / 1000;
        const state = Number(data.state);

        // Skip if not active
        if (state !== 0) {
          console.log(`[System #${tokenId}] Skipped - Status: ${state === 1 ? "Maintenance" : "Disconnected"}`);
          continue;
        }

        // Simulate realistic solar generation (10-80% efficiency)
        const efficiency = 0.1 + Math.random() * 0.7;
        const kwhGenerated = Math.round(capacityKw * efficiency * 10) / 10; // Scale down for demo

        const owner = await contract.ownerOf(tokenId);

        console.log(`[System #${tokenId}] Generating ${kwhGenerated} kWh (${(efficiency * 100).toFixed(0)}% of ${capacityKw}kW)`);
        console.log(`             Owner: ${owner.slice(0, 10)}...${owner.slice(-8)}`);

        // Note: In demo mode, we don't auto-claim to let users do it manually
        // Uncomment below to enable auto-claiming:
        // const tx = await contract.claimGeneration(tokenId, BigInt(Math.round(kwhGenerated)));
        // await tx.wait();
        // console.log(`             Claimed! TX: ${tx.hash.slice(0, 20)}...`);

        console.log("");
      } catch (error) {
        console.error(`[System #${tokenId}] Error:`, error);
      }
    }
    console.log("─".repeat(60));
  }, 10000); // Every 10 seconds
}

simulateGeneration().catch(console.error);
