import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { KuryenTradeSystemNFT, EnergyToken } from "../typechain-types";

describe("KuryenTradeSystemNFT", function () {
  async function deployFixture() {
    const [admin, prosumer1, prosumer2, nonAdmin] = await ethers.getSigners();

    // Deploy EnergyToken
    const EnergyToken = await ethers.getContractFactory("EnergyToken");
    const energyToken = await EnergyToken.deploy();

    // Deploy KuryenTradeSystemNFT
    const KuryenTradeSystemNFT = await ethers.getContractFactory("KuryenTradeSystemNFT");
    const systemNFT = await KuryenTradeSystemNFT.deploy();

    // Configure contracts
    await energyToken.setMinter(await systemNFT.getAddress());
    await systemNFT.setEnergyToken(await energyToken.getAddress());

    // Sample system data
    const capacityWatts = 5000n; // 5kW
    const locationHash = ethers.keccak256(ethers.toUtf8Bytes("123 Solar St, Sun City"));
    const hardwareId = ethers.keccak256(ethers.toUtf8Bytes("PUF_DEVICE_001"));

    // Role constants
    const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;

    return {
      energyToken,
      systemNFT,
      admin,
      prosumer1,
      prosumer2,
      nonAdmin,
      capacityWatts,
      locationHash,
      hardwareId,
      DEFAULT_ADMIN_ROLE,
    };
  }

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      const { systemNFT } = await loadFixture(deployFixture);

      expect(await systemNFT.name()).to.equal("KuryenTrade System NFT");
      expect(await systemNFT.symbol()).to.equal("KTSYS");
    });

    it("Should grant admin DEFAULT_ADMIN_ROLE", async function () {
      const { systemNFT, admin, DEFAULT_ADMIN_ROLE } = await loadFixture(deployFixture);

      expect(await systemNFT.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.equal(true);
    });

    it("Should have zero initial systems", async function () {
      const { systemNFT } = await loadFixture(deployFixture);

      expect(await systemNFT.totalSystems()).to.equal(0);
    });
  });

  describe("System Minting", function () {
    it("Should mint a new system NFT", async function () {
      const { systemNFT, prosumer1, capacityWatts, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await expect(
        systemNFT.mintSystem(prosumer1.address, capacityWatts, locationHash, hardwareId)
      )
        .to.emit(systemNFT, "SystemMinted")
        .withArgs(1, prosumer1.address, capacityWatts, hardwareId);

      expect(await systemNFT.ownerOf(1)).to.equal(prosumer1.address);
      expect(await systemNFT.totalSystems()).to.equal(1);
    });

    it("Should store correct system data", async function () {
      const { systemNFT, prosumer1, capacityWatts, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await systemNFT.mintSystem(prosumer1.address, capacityWatts, locationHash, hardwareId);

      const systemData = await systemNFT.getSystemData(1);

      expect(systemData.capacityWatts).to.equal(capacityWatts);
      expect(systemData.locationHash).to.equal(locationHash);
      expect(systemData.hardwareId).to.equal(hardwareId);
      expect(systemData.state).to.equal(0); // ACTIVE
      expect(systemData.totalGenerated).to.equal(0);
    });

    it("Should reject minting from non-admin", async function () {
      const { systemNFT, prosumer1, nonAdmin, capacityWatts, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await expect(
        (systemNFT.connect(nonAdmin) as KuryenTradeSystemNFT).mintSystem(
          prosumer1.address,
          capacityWatts,
          locationHash,
          hardwareId
        )
      ).to.be.revertedWithCustomError(systemNFT, "AccessControlUnauthorizedAccount");
    });

    it("Should reject zero address", async function () {
      const { systemNFT, capacityWatts, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await expect(
        systemNFT.mintSystem(ethers.ZeroAddress, capacityWatts, locationHash, hardwareId)
      ).to.be.revertedWithCustomError(systemNFT, "ZeroAddress");
    });

    it("Should reject zero capacity", async function () {
      const { systemNFT, prosumer1, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await expect(
        systemNFT.mintSystem(prosumer1.address, 0, locationHash, hardwareId)
      ).to.be.revertedWithCustomError(systemNFT, "ZeroCapacity");
    });
  });

  describe("Non-Transferable NFTs", function () {
    it("Should block holder transfers", async function () {
      const { systemNFT, prosumer1, prosumer2, capacityWatts, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await systemNFT.mintSystem(prosumer1.address, capacityWatts, locationHash, hardwareId);

      await expect(
        (systemNFT.connect(prosumer1) as KuryenTradeSystemNFT).transferFrom(
          prosumer1.address,
          prosumer2.address,
          1
        )
      ).to.be.revertedWithCustomError(systemNFT, "TransferNotAllowed");
    });

    it("Should block holder safeTransferFrom", async function () {
      const { systemNFT, prosumer1, prosumer2, capacityWatts, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await systemNFT.mintSystem(prosumer1.address, capacityWatts, locationHash, hardwareId);

      await expect(
        (systemNFT.connect(prosumer1) as KuryenTradeSystemNFT)["safeTransferFrom(address,address,uint256)"](
          prosumer1.address,
          prosumer2.address,
          1
        )
      ).to.be.revertedWithCustomError(systemNFT, "TransferNotAllowed");
    });

    it("Should allow admin transfers via adminTransfer", async function () {
      const { systemNFT, prosumer1, prosumer2, capacityWatts, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await systemNFT.mintSystem(prosumer1.address, capacityWatts, locationHash, hardwareId);

      await expect(systemNFT.adminTransfer(prosumer1.address, prosumer2.address, 1))
        .to.emit(systemNFT, "AdminTransfer")
        .withArgs(1, prosumer1.address, prosumer2.address);

      expect(await systemNFT.ownerOf(1)).to.equal(prosumer2.address);
    });

    it("Should reject adminTransfer from non-admin", async function () {
      const { systemNFT, prosumer1, prosumer2, nonAdmin, capacityWatts, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await systemNFT.mintSystem(prosumer1.address, capacityWatts, locationHash, hardwareId);

      await expect(
        (systemNFT.connect(nonAdmin) as KuryenTradeSystemNFT).adminTransfer(
          prosumer1.address,
          prosumer2.address,
          1
        )
      ).to.be.revertedWithCustomError(systemNFT, "AccessControlUnauthorizedAccount");
    });
  });

  describe("Generation Claims (Prototype - No Oracle Verification)", function () {
    it("Should allow holder to claim generation", async function () {
      const { systemNFT, energyToken, prosumer1, capacityWatts, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await systemNFT.mintSystem(prosumer1.address, capacityWatts, locationHash, hardwareId);

      const kwhGenerated = 100n;
      const expectedTokens = kwhGenerated * BigInt(1e18);

      await expect(
        (systemNFT.connect(prosumer1) as KuryenTradeSystemNFT).claimGeneration(1, kwhGenerated)
      )
        .to.emit(systemNFT, "GenerationClaimed")
        .withArgs(1, prosumer1.address, kwhGenerated, expectedTokens);

      expect(await energyToken.balanceOf(prosumer1.address)).to.equal(expectedTokens);
    });

    it("Should accumulate total generation", async function () {
      const { systemNFT, energyToken, prosumer1, capacityWatts, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await systemNFT.mintSystem(prosumer1.address, capacityWatts, locationHash, hardwareId);

      await (systemNFT.connect(prosumer1) as KuryenTradeSystemNFT).claimGeneration(1, 100n);
      await (systemNFT.connect(prosumer1) as KuryenTradeSystemNFT).claimGeneration(1, 200n);

      const systemData = await systemNFT.getSystemData(1);
      expect(systemData.totalGenerated).to.equal(300n);

      expect(await energyToken.balanceOf(prosumer1.address)).to.equal(300n * BigInt(1e18));
    });

    it("Should reject claim from non-owner", async function () {
      const { systemNFT, prosumer1, prosumer2, capacityWatts, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await systemNFT.mintSystem(prosumer1.address, capacityWatts, locationHash, hardwareId);

      await expect(
        (systemNFT.connect(prosumer2) as KuryenTradeSystemNFT).claimGeneration(1, 100n)
      ).to.be.revertedWithCustomError(systemNFT, "NotSystemOwner");
    });

    it("Should reject claim when system not active", async function () {
      const { systemNFT, prosumer1, capacityWatts, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await systemNFT.mintSystem(prosumer1.address, capacityWatts, locationHash, hardwareId);
      await systemNFT.setSystemState(1, 1); // MAINTENANCE

      await expect(
        (systemNFT.connect(prosumer1) as KuryenTradeSystemNFT).claimGeneration(1, 100n)
      ).to.be.revertedWithCustomError(systemNFT, "SystemNotActive");
    });
  });

  describe("State Management", function () {
    it("Should allow admin to change system state", async function () {
      const { systemNFT, prosumer1, capacityWatts, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await systemNFT.mintSystem(prosumer1.address, capacityWatts, locationHash, hardwareId);

      await expect(systemNFT.setSystemState(1, 1)) // MAINTENANCE
        .to.emit(systemNFT, "SystemStateChanged")
        .withArgs(1, 0, 1);

      expect(await systemNFT.isSystemActive(1)).to.equal(false);
    });

    it("Should allow state transitions ACTIVE -> MAINTENANCE -> ACTIVE", async function () {
      const { systemNFT, prosumer1, capacityWatts, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await systemNFT.mintSystem(prosumer1.address, capacityWatts, locationHash, hardwareId);

      await systemNFT.setSystemState(1, 1); // MAINTENANCE
      expect(await systemNFT.isSystemActive(1)).to.equal(false);

      await systemNFT.setSystemState(1, 0); // ACTIVE
      expect(await systemNFT.isSystemActive(1)).to.equal(true);
    });

    it("Should reject state change from non-admin", async function () {
      const { systemNFT, prosumer1, nonAdmin, capacityWatts, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await systemNFT.mintSystem(prosumer1.address, capacityWatts, locationHash, hardwareId);

      await expect(
        (systemNFT.connect(nonAdmin) as KuryenTradeSystemNFT).setSystemState(1, 1)
      ).to.be.revertedWithCustomError(systemNFT, "AccessControlUnauthorizedAccount");
    });
  });

  describe("View Functions", function () {
    it("Should return systems owned by address", async function () {
      const { systemNFT, prosumer1, capacityWatts, locationHash, hardwareId } =
        await loadFixture(deployFixture);

      await systemNFT.mintSystem(prosumer1.address, capacityWatts, locationHash, hardwareId);
      await systemNFT.mintSystem(prosumer1.address, capacityWatts, locationHash, hardwareId);

      const systems = await systemNFT.getSystemsByOwner(prosumer1.address);

      expect(systems.length).to.equal(2);
      expect(systems[0]).to.equal(1n);
      expect(systems[1]).to.equal(2n);
    });

    it("Should return empty array for address with no systems", async function () {
      const { systemNFT, prosumer1 } = await loadFixture(deployFixture);

      const systems = await systemNFT.getSystemsByOwner(prosumer1.address);
      expect(systems.length).to.equal(0);
    });
  });
});
