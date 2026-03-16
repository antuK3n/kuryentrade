import { ethers } from "hardhat";

// Demo wallets (Hardhat default accounts)
const DEMO_WALLETS = {
  admin: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  user1: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  user2: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
};

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // ==========================================
  // DEPLOY ENERGYTOKEN
  // ==========================================
  console.log("\n1. Deploying EnergyToken...");
  const EnergyToken = await ethers.getContractFactory("EnergyToken");
  const energyToken = await EnergyToken.deploy();
  await energyToken.waitForDeployment();
  const energyTokenAddress = await energyToken.getAddress();
  console.log("   EnergyToken deployed to:", energyTokenAddress);

  // ==========================================
  // DEPLOY KURYENTRADESYSTEMNFT
  // ==========================================
  console.log("\n2. Deploying KuryenTradeSystemNFT...");
  const KuryenTradeSystemNFT = await ethers.getContractFactory("KuryenTradeSystemNFT");
  const systemNFT = await KuryenTradeSystemNFT.deploy();
  await systemNFT.waitForDeployment();
  const systemNFTAddress = await systemNFT.getAddress();
  console.log("   KuryenTradeSystemNFT deployed to:", systemNFTAddress);

  // ==========================================
  // DEPLOY ECTREQUESTBOARD
  // ==========================================
  console.log("\n3. Deploying ECTRequestBoard...");
  const ECTRequestBoard = await ethers.getContractFactory("ECTRequestBoard");
  const requestBoard = await ECTRequestBoard.deploy(energyTokenAddress);
  await requestBoard.waitForDeployment();
  const requestBoardAddress = await requestBoard.getAddress();
  console.log("   ECTRequestBoard deployed to:", requestBoardAddress);

  // ==========================================
  // CONFIGURE CONTRACTS
  // ==========================================
  console.log("\n4. Configuring contracts...");

  // Set minter on EnergyToken
  const setMinterTx = await energyToken.setMinter(systemNFTAddress);
  await setMinterTx.wait();
  console.log("   EnergyToken.setMinter() done");

  // Set EnergyToken on KuryenTradeSystemNFT
  const setEnergyTokenTx = await systemNFT.setEnergyToken(energyTokenAddress);
  await setEnergyTokenTx.wait();
  console.log("   KuryenTradeSystemNFT.setEnergyToken() done");

  // ==========================================
  // MINT NFT TO USER 1 (Prosumer)
  // ==========================================
  console.log("\n5. Minting NFT #1 to User 1:", DEMO_WALLETS.user1);

  const capacityWatts1 = 5000n; // 5kW system
  const locationHash1 = ethers.keccak256(ethers.toUtf8Bytes("Grid Node 47 - Unit A"));
  const hardwareId1 = ethers.keccak256(ethers.toUtf8Bytes("SOLAR_DEVICE_001"));

  const mintTx1 = await systemNFT.mintSystem(DEMO_WALLETS.user1, capacityWatts1, locationHash1, hardwareId1);
  await mintTx1.wait();
  console.log("   NFT #1 minted to User 1");

  // Set metadata for NFT #1
  const metadata1 = {
    name: "KuryenTrade System #1",
    description: "A 5kW solar panel installation. Prosumer system for energy generation.",
    image: "https://litter.catbox.moe/dfbzm6.jpeg",
    attributes: [
      { trait_type: "Capacity", value: "5 kW" },
      { trait_type: "Location", value: "Grid Node 47" },
      { trait_type: "Status", value: "Active" },
    ]
  };
  const tokenUri1 = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata1)).toString("base64")}`;
  await (await systemNFT.setTokenURI(1, tokenUri1)).wait();
  console.log("   NFT #1 metadata set");

  // ==========================================
  // MINT NFT TO USER 2 (Another Prosumer)
  // ==========================================
  console.log("\n6. Minting NFT #2 to User 2:", DEMO_WALLETS.user2);

  const capacityWatts2 = 3000n; // 3kW system
  const locationHash2 = ethers.keccak256(ethers.toUtf8Bytes("Grid Node 47 - Unit B"));
  const hardwareId2 = ethers.keccak256(ethers.toUtf8Bytes("SOLAR_DEVICE_002"));

  const mintTx2 = await systemNFT.mintSystem(DEMO_WALLETS.user2, capacityWatts2, locationHash2, hardwareId2);
  await mintTx2.wait();
  console.log("   NFT #2 minted to User 2");

  // Set metadata for NFT #2
  const metadata2 = {
    name: "KuryenTrade System #2",
    description: "A 3kW solar panel installation. Prosumer system for energy generation.",
    image: "https://litter.catbox.moe/dfbzm6.jpeg",
    attributes: [
      { trait_type: "Capacity", value: "3 kW" },
      { trait_type: "Location", value: "Grid Node 47" },
      { trait_type: "Status", value: "Active" },
    ]
  };
  const tokenUri2 = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata2)).toString("base64")}`;
  await (await systemNFT.setTokenURI(2, tokenUri2)).wait();
  console.log("   NFT #2 metadata set");

  // ==========================================
  // CLAIM INITIAL ECT FOR USERS (Simulate generation)
  // ==========================================
  console.log("\n7. Claiming initial ECT for users (simulating energy generation)...");

  // User 1 claims 150 kWh (gets 150 ECT)
  const signers = await ethers.getSigners();
  const user1Signer = signers[1]; // Account #1
  const user2Signer = signers[2]; // Account #2

  const systemNFTUser1 = systemNFT.connect(user1Signer);
  await (await systemNFTUser1.claimGeneration(1, 150n)).wait();
  console.log("   User 1 claimed 150 ECT");

  // User 2 claims 100 kWh (gets 100 ECT)
  const systemNFTUser2 = systemNFT.connect(user2Signer);
  await (await systemNFTUser2.claimGeneration(2, 100n)).wait();
  console.log("   User 2 claimed 100 ECT");

  // ==========================================
  // SUMMARY
  // ==========================================
  console.log("\n" + "=".repeat(60));
  console.log("DEPLOYMENT COMPLETE");
  console.log("=".repeat(60));
  console.log("\nContract Addresses:");
  console.log("  EnergyToken (ECT):", energyTokenAddress);
  console.log("  KuryenTradeSystemNFT:", systemNFTAddress);
  console.log("  ECTRequestBoard:", requestBoardAddress);
  console.log("\nDemo Wallets:");
  console.log("  Admin:", DEMO_WALLETS.admin);
  console.log("    - Has admin role, can mint NFTs, change states");
  console.log("    - Can access Admin Panel and Controller");
  console.log("  User 1:", DEMO_WALLETS.user1);
  console.log("    - Owns NFT #1 (5kW system)");
  console.log("    - Has 150 ECT balance");
  console.log("  User 2:", DEMO_WALLETS.user2);
  console.log("    - Owns NFT #2 (3kW system)");
  console.log("    - Has 100 ECT balance");
  console.log("\nUpdate frontend/src/lib/contracts.ts with these addresses:");
  console.log(`  energyToken: "${energyTokenAddress}",`);
  console.log(`  kuryenTradeSystemNFT: "${systemNFTAddress}",`);
  console.log(`  ectRequestBoard: "${requestBoardAddress}",`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
