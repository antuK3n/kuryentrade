import express from "express";
import cors from "cors";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Contract ABIs
const KURYENTRADE_SYSTEM_ABI = [
  "function claimGeneration(uint256 tokenId, uint256 kwhGenerated)",
  "function getSystemData(uint256 tokenId) view returns (tuple(uint256 capacityWatts, bytes32 locationHash, uint256 installationDate, bytes32 hardwareId, uint8 state, uint256 totalGenerated, uint256 lastClaimTime))",
  "function ownerOf(uint256 tokenId) view returns (address)",
];

// Simulated IoT data store
interface MeterReading {
  hardwareId: string;
  tokenId: number;
  timestamp: number;
  kwhGenerated: number;
  signature: string;
}

const pendingReadings: MeterReading[] = [];

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Receive IoT meter reading
app.post("/api/meter/report", (req, res) => {
  const { hardwareId, tokenId, kwhGenerated, signature } = req.body;

  if (!hardwareId || !tokenId || !kwhGenerated) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const reading: MeterReading = {
    hardwareId,
    tokenId,
    timestamp: Date.now(),
    kwhGenerated,
    signature: signature || "0x",
  };

  pendingReadings.push(reading);
  console.log(`[IoT] Received reading: ${kwhGenerated} kWh from system #${tokenId}`);

  res.json({ success: true, reading });
});

// Get pending readings (for oracle to process)
app.get("/api/oracle/pending", (req, res) => {
  res.json({ readings: pendingReadings });
});

// Process reading and submit to blockchain (oracle simulation)
app.post("/api/oracle/process", async (req, res) => {
  const { tokenId, kwhGenerated } = req.body;

  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");
    const wallet = new ethers.Wallet(process.env.ORACLE_PRIVATE_KEY || "", provider);

    const contractAddress = process.env.KURYENTRADE_SYSTEM_NFT || "";
    const contract = new ethers.Contract(contractAddress, KURYENTRADE_SYSTEM_ABI, wallet);

    const tx = await contract.claimGeneration(tokenId, BigInt(kwhGenerated));
    await tx.wait();

    console.log(`[Oracle] Claimed ${kwhGenerated} kWh for system #${tokenId}`);
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("[Oracle] Error:", error);
    res.status(500).json({ error: "Failed to process claim" });
  }
});

// Simulate meter readings (for demo)
app.post("/api/simulate/reading", (req, res) => {
  const { tokenId, capacityKw } = req.body;

  // Simulate realistic solar generation based on capacity
  // Random between 10-80% of capacity per hour
  const efficiency = 0.1 + Math.random() * 0.7;
  const kwhGenerated = Math.round(capacityKw * efficiency * 100) / 100;

  const reading: MeterReading = {
    hardwareId: `HW-${tokenId.toString().padStart(4, "0")}`,
    tokenId,
    timestamp: Date.now(),
    kwhGenerated,
    signature: "0xSIMULATED",
  };

  pendingReadings.push(reading);
  console.log(`[Simulate] Generated ${kwhGenerated} kWh for system #${tokenId} (${(efficiency * 100).toFixed(0)}% efficiency)`);

  res.json({ success: true, reading });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║           KuryenTrade IoT Oracle Backend                  ║
╠═══════════════════════════════════════════════════════════╣
║  Server running on http://localhost:${PORT}                  ║
║                                                           ║
║  Endpoints:                                               ║
║  POST /api/meter/report    - Receive IoT readings         ║
║  GET  /api/oracle/pending  - Get pending readings         ║
║  POST /api/oracle/process  - Submit to blockchain         ║
║  POST /api/simulate/reading - Simulate meter reading      ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
