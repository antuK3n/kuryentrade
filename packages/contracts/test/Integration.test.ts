import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { KuryenTradeSystemNFT, EnergyToken } from "../typechain-types";

describe("Integration Tests", function () {
  async function deployFullSystemFixture() {
    const [admin, prosumer1, prosumer2, consumer] = await ethers.getSigners();

    // Deploy EnergyToken
    const EnergyToken = await ethers.getContractFactory("EnergyToken");
    const energyToken = await EnergyToken.deploy();

    // Deploy KuryenTradeSystemNFT
    const KuryenTradeSystemNFT = await ethers.getContractFactory("KuryenTradeSystemNFT");
    const systemNFT = await KuryenTradeSystemNFT.deploy();

    // Configure contracts
    await energyToken.setMinter(await systemNFT.getAddress());
    await systemNFT.setEnergyToken(await energyToken.getAddress());

    return { energyToken, systemNFT, admin, prosumer1, prosumer2, consumer };
  }

  describe("Complete Flow: Onboarding -> Generation -> Trading -> Consumption", function () {
    it("Should complete full lifecycle", async function () {
      const { energyToken, systemNFT, prosumer1, prosumer2, consumer } =
        await loadFixture(deployFullSystemFixture);

      // ==========================================
      // STEP 1: ONBOARDING (Admin mints NFTs)
      // ==========================================
      const capacity1 = 5000n; // 5kW
      const capacity2 = 10000n; // 10kW
      const location1 = ethers.keccak256(ethers.toUtf8Bytes("123 Solar Ave"));
      const location2 = ethers.keccak256(ethers.toUtf8Bytes("456 Sun Blvd"));
      const hardware1 = ethers.keccak256(ethers.toUtf8Bytes("DEVICE_001"));
      const hardware2 = ethers.keccak256(ethers.toUtf8Bytes("DEVICE_002"));

      await systemNFT.mintSystem(prosumer1.address, capacity1, location1, hardware1);
      await systemNFT.mintSystem(prosumer2.address, capacity2, location2, hardware2);

      expect(await systemNFT.totalSystems()).to.equal(2);
      expect(await systemNFT.ownerOf(1)).to.equal(prosumer1.address);
      expect(await systemNFT.ownerOf(2)).to.equal(prosumer2.address);

      // ==========================================
      // STEP 2: GENERATION CLAIMING (Holder-triggered)
      // ==========================================
      // Prosumer1 claims 100 kWh
      await (systemNFT.connect(prosumer1) as KuryenTradeSystemNFT).claimGeneration(1, 100n);

      // Prosumer2 claims 200 kWh
      await (systemNFT.connect(prosumer2) as KuryenTradeSystemNFT).claimGeneration(2, 200n);

      const expectedBalance1 = 100n * BigInt(1e18);
      const expectedBalance2 = 200n * BigInt(1e18);

      expect(await energyToken.balanceOf(prosumer1.address)).to.equal(expectedBalance1);
      expect(await energyToken.balanceOf(prosumer2.address)).to.equal(expectedBalance2);
      expect(await energyToken.totalEnergyGenerated()).to.equal(expectedBalance1 + expectedBalance2);

      // ==========================================
      // STEP 3: TRADING (simulating DEX trades via direct transfers)
      // ==========================================
      // Prosumer1 sells 50 ECT to consumer
      const tradeAmount = 50n * BigInt(1e18);
      await (energyToken.connect(prosumer1) as EnergyToken).transfer(consumer.address, tradeAmount);

      expect(await energyToken.balanceOf(prosumer1.address)).to.equal(expectedBalance1 - tradeAmount);
      expect(await energyToken.balanceOf(consumer.address)).to.equal(tradeAmount);

      // ==========================================
      // STEP 4: CONSUMPTION (burn tokens)
      // ==========================================
      const consumeAmount = 30n * BigInt(1e18);
      await (energyToken.connect(consumer) as EnergyToken).burn(consumeAmount);

      expect(await energyToken.balanceOf(consumer.address)).to.equal(tradeAmount - consumeAmount);
      expect(await energyToken.totalEnergyConsumed()).to.equal(consumeAmount);

      // Verify final state
      const system1Data = await systemNFT.getSystemData(1);
      const system2Data = await systemNFT.getSystemData(2);

      expect(system1Data.totalGenerated).to.equal(100n);
      expect(system2Data.totalGenerated).to.equal(200n);
    });
  });

  describe("Admin Transfer -> New Owner Claims ECT", function () {
    it("Should route ECT to new owner after admin transfer", async function () {
      const { energyToken, systemNFT, prosumer1, prosumer2 } =
        await loadFixture(deployFullSystemFixture);

      // Mint system to prosumer1
      const capacity = 5000n;
      const location = ethers.keccak256(ethers.toUtf8Bytes("123 Solar Ave"));
      const hardware = ethers.keccak256(ethers.toUtf8Bytes("DEVICE_001"));

      await systemNFT.mintSystem(prosumer1.address, capacity, location, hardware);

      // Prosumer1 claims initial generation
      await (systemNFT.connect(prosumer1) as KuryenTradeSystemNFT).claimGeneration(1, 50n);

      expect(await energyToken.balanceOf(prosumer1.address)).to.equal(50n * BigInt(1e18));

      // Admin transfers NFT to prosumer2
      await systemNFT.adminTransfer(prosumer1.address, prosumer2.address, 1);

      // Prosumer2 now claims generation (new owner gets ECT)
      await (systemNFT.connect(prosumer2) as KuryenTradeSystemNFT).claimGeneration(1, 100n);

      // prosumer1 still has original 50 ECT
      expect(await energyToken.balanceOf(prosumer1.address)).to.equal(50n * BigInt(1e18));
      // prosumer2 now has 100 ECT
      expect(await energyToken.balanceOf(prosumer2.address)).to.equal(100n * BigInt(1e18));

      // System total is 150 kWh
      const systemData = await systemNFT.getSystemData(1);
      expect(systemData.totalGenerated).to.equal(150n);
    });
  });

  describe("Maintenance Mode Blocks Claims", function () {
    it("Should block claims during maintenance and resume after", async function () {
      const { systemNFT, prosumer1 } = await loadFixture(deployFullSystemFixture);

      // Mint system
      const capacity = 5000n;
      const location = ethers.keccak256(ethers.toUtf8Bytes("123 Solar Ave"));
      const hardware = ethers.keccak256(ethers.toUtf8Bytes("DEVICE_001"));

      await systemNFT.mintSystem(prosumer1.address, capacity, location, hardware);

      // First claim while active - should succeed
      await (systemNFT.connect(prosumer1) as KuryenTradeSystemNFT).claimGeneration(1, 50n);

      // Set to maintenance mode
      await systemNFT.setSystemState(1, 1); // MAINTENANCE

      // Try to claim - should fail
      await expect(
        (systemNFT.connect(prosumer1) as KuryenTradeSystemNFT).claimGeneration(1, 50n)
      ).to.be.revertedWithCustomError(systemNFT, "SystemNotActive");

      // Return to active state
      await systemNFT.setSystemState(1, 0); // ACTIVE

      // Claim again - should succeed
      await (systemNFT.connect(prosumer1) as KuryenTradeSystemNFT).claimGeneration(1, 50n);

      const systemData = await systemNFT.getSystemData(1);
      expect(systemData.totalGenerated).to.equal(100n);
    });
  });

  describe("Energy Statistics", function () {
    it("Should track energy generation and consumption stats", async function () {
      const { energyToken, systemNFT, prosumer1, consumer } =
        await loadFixture(deployFullSystemFixture);

      // Mint and claim
      const capacity = 5000n;
      const location = ethers.keccak256(ethers.toUtf8Bytes("location"));
      const hardware = ethers.keccak256(ethers.toUtf8Bytes("DEVICE_001"));

      await systemNFT.mintSystem(prosumer1.address, capacity, location, hardware);

      await (systemNFT.connect(prosumer1) as KuryenTradeSystemNFT).claimGeneration(1, 500n);

      // Transfer to consumer
      const transferAmount = 200n * BigInt(1e18);
      await (energyToken.connect(prosumer1) as EnergyToken).transfer(consumer.address, transferAmount);

      // Consumer burns some
      const burnAmount = 150n * BigInt(1e18);
      await (energyToken.connect(consumer) as EnergyToken).burn(burnAmount);

      // Check stats
      expect(await energyToken.totalEnergyGenerated()).to.equal(500n * BigInt(1e18));
      expect(await energyToken.totalEnergyConsumed()).to.equal(burnAmount);

      // Total supply = generated - consumed
      const expectedSupply = (500n * BigInt(1e18)) - burnAmount;
      expect(await energyToken.totalSupply()).to.equal(expectedSupply);
    });
  });

  describe("Access Control", function () {
    it("Should enforce role-based functions on KuryenTradeSystemNFT", async function () {
      const { systemNFT, prosumer1 } = await loadFixture(deployFullSystemFixture);

      const capacity = 5000n;
      const location = ethers.keccak256(ethers.toUtf8Bytes("location"));
      const hardware = ethers.keccak256(ethers.toUtf8Bytes("DEVICE_001"));

      // Non-admin cannot mint
      await expect(
        (systemNFT.connect(prosumer1) as KuryenTradeSystemNFT).mintSystem(
          prosumer1.address,
          capacity,
          location,
          hardware
        )
      ).to.be.revertedWithCustomError(systemNFT, "AccessControlUnauthorizedAccount");

      // Non-admin cannot change state
      await systemNFT.mintSystem(prosumer1.address, capacity, location, hardware);
      await expect(
        (systemNFT.connect(prosumer1) as KuryenTradeSystemNFT).setSystemState(1, 1)
      ).to.be.revertedWithCustomError(systemNFT, "AccessControlUnauthorizedAccount");
    });

    it("Should enforce minter-only functions on EnergyToken", async function () {
      const { energyToken, prosumer1 } = await loadFixture(deployFullSystemFixture);

      // Non-minter cannot mint
      await expect(
        (energyToken.connect(prosumer1) as EnergyToken).mint(prosumer1.address, 100n)
      ).to.be.revertedWithCustomError(energyToken, "OnlyMinter");
    });

    it("Should block holder NFT transfers", async function () {
      const { systemNFT, prosumer1, prosumer2 } = await loadFixture(deployFullSystemFixture);

      const capacity = 5000n;
      const location = ethers.keccak256(ethers.toUtf8Bytes("location"));
      const hardware = ethers.keccak256(ethers.toUtf8Bytes("DEVICE_001"));

      await systemNFT.mintSystem(prosumer1.address, capacity, location, hardware);

      // Holder cannot transfer
      await expect(
        (systemNFT.connect(prosumer1) as KuryenTradeSystemNFT).transferFrom(
          prosumer1.address,
          prosumer2.address,
          1
        )
      ).to.be.revertedWithCustomError(systemNFT, "TransferNotAllowed");
    });
  });
});
