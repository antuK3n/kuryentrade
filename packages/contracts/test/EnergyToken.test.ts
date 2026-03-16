import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { EnergyToken } from "../typechain-types";

describe("EnergyToken", function () {
  async function deployEnergyTokenFixture() {
    const [owner, minter, user1, user2] = await ethers.getSigners();

    const EnergyToken = await ethers.getContractFactory("EnergyToken");
    const energyToken = await EnergyToken.deploy();

    return { energyToken, owner, minter, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      const { energyToken } = await loadFixture(deployEnergyTokenFixture);

      expect(await energyToken.name()).to.equal("Energy Credit Token");
      expect(await energyToken.symbol()).to.equal("ECT");
    });

    it("Should set the right owner", async function () {
      const { energyToken, owner } = await loadFixture(deployEnergyTokenFixture);

      expect(await energyToken.owner()).to.equal(owner.address);
    });

    it("Should have zero initial supply", async function () {
      const { energyToken } = await loadFixture(deployEnergyTokenFixture);

      expect(await energyToken.totalSupply()).to.equal(0);
    });

    it("Should have zero initial minter", async function () {
      const { energyToken } = await loadFixture(deployEnergyTokenFixture);

      expect(await energyToken.minter()).to.equal(ethers.ZeroAddress);
    });
  });

  describe("Minter Management", function () {
    it("Should allow owner to set minter", async function () {
      const { energyToken, minter } = await loadFixture(deployEnergyTokenFixture);

      await expect(energyToken.setMinter(minter.address))
        .to.emit(energyToken, "MinterUpdated")
        .withArgs(ethers.ZeroAddress, minter.address);

      expect(await energyToken.minter()).to.equal(minter.address);
    });

    it("Should reject setting zero address as minter", async function () {
      const { energyToken } = await loadFixture(deployEnergyTokenFixture);

      await expect(energyToken.setMinter(ethers.ZeroAddress))
        .to.be.revertedWithCustomError(energyToken, "ZeroAddress");
    });

    it("Should reject non-owner setting minter", async function () {
      const { energyToken, minter, user1 } = await loadFixture(deployEnergyTokenFixture);

      await expect(
        (energyToken.connect(user1) as EnergyToken).setMinter(minter.address)
      ).to.be.revertedWithCustomError(energyToken, "OwnableUnauthorizedAccount");
    });
  });

  describe("Minting", function () {
    it("Should allow minter to mint tokens", async function () {
      const { energyToken, minter, user1 } = await loadFixture(deployEnergyTokenFixture);

      await energyToken.setMinter(minter.address);

      const amount = ethers.parseEther("100");
      await expect((energyToken.connect(minter) as EnergyToken).mint(user1.address, amount))
        .to.emit(energyToken, "EnergyGenerated")
        .withArgs(user1.address, amount);

      expect(await energyToken.balanceOf(user1.address)).to.equal(amount);
      expect(await energyToken.totalEnergyGenerated()).to.equal(amount);
    });

    it("Should reject minting from non-minter", async function () {
      const { energyToken, minter, user1 } = await loadFixture(deployEnergyTokenFixture);

      await energyToken.setMinter(minter.address);

      const amount = ethers.parseEther("100");
      await expect(
        (energyToken.connect(user1) as EnergyToken).mint(user1.address, amount)
      ).to.be.revertedWithCustomError(energyToken, "OnlyMinter");
    });

    it("Should track total energy generated across multiple mints", async function () {
      const { energyToken, minter, user1, user2 } = await loadFixture(deployEnergyTokenFixture);

      await energyToken.setMinter(minter.address);

      const amount1 = ethers.parseEther("100");
      const amount2 = ethers.parseEther("200");

      await (energyToken.connect(minter) as EnergyToken).mint(user1.address, amount1);
      await (energyToken.connect(minter) as EnergyToken).mint(user2.address, amount2);

      expect(await energyToken.totalEnergyGenerated()).to.equal(amount1 + amount2);
    });
  });

  describe("Burning", function () {
    it("Should allow users to burn their tokens", async function () {
      const { energyToken, minter, user1 } = await loadFixture(deployEnergyTokenFixture);

      await energyToken.setMinter(minter.address);

      const mintAmount = ethers.parseEther("100");
      const burnAmount = ethers.parseEther("30");

      await (energyToken.connect(minter) as EnergyToken).mint(user1.address, mintAmount);

      await expect((energyToken.connect(user1) as EnergyToken).burn(burnAmount))
        .to.emit(energyToken, "EnergyConsumed")
        .withArgs(user1.address, burnAmount);

      expect(await energyToken.balanceOf(user1.address)).to.equal(mintAmount - burnAmount);
      expect(await energyToken.totalEnergyConsumed()).to.equal(burnAmount);
    });

    it("Should track total energy consumed across multiple burns", async function () {
      const { energyToken, minter, user1, user2 } = await loadFixture(deployEnergyTokenFixture);

      await energyToken.setMinter(minter.address);

      const mintAmount = ethers.parseEther("100");
      await (energyToken.connect(minter) as EnergyToken).mint(user1.address, mintAmount);
      await (energyToken.connect(minter) as EnergyToken).mint(user2.address, mintAmount);

      const burn1 = ethers.parseEther("20");
      const burn2 = ethers.parseEther("30");

      await (energyToken.connect(user1) as EnergyToken).burn(burn1);
      await (energyToken.connect(user2) as EnergyToken).burn(burn2);

      expect(await energyToken.totalEnergyConsumed()).to.equal(burn1 + burn2);
    });

    it("Should allow burnFrom with approval", async function () {
      const { energyToken, minter, user1, user2 } = await loadFixture(deployEnergyTokenFixture);

      await energyToken.setMinter(minter.address);

      const mintAmount = ethers.parseEther("100");
      const burnAmount = ethers.parseEther("30");

      await (energyToken.connect(minter) as EnergyToken).mint(user1.address, mintAmount);
      await (energyToken.connect(user1) as EnergyToken).approve(user2.address, burnAmount);

      await expect((energyToken.connect(user2) as EnergyToken).burnFrom(user1.address, burnAmount))
        .to.emit(energyToken, "EnergyConsumed")
        .withArgs(user1.address, burnAmount);

      expect(await energyToken.totalEnergyConsumed()).to.equal(burnAmount);
    });
  });

  describe("Transfers", function () {
    it("Should allow standard ERC20 transfers", async function () {
      const { energyToken, minter, user1, user2 } = await loadFixture(deployEnergyTokenFixture);

      await energyToken.setMinter(minter.address);

      const amount = ethers.parseEther("100");
      const transferAmount = ethers.parseEther("40");

      await (energyToken.connect(minter) as EnergyToken).mint(user1.address, amount);
      await (energyToken.connect(user1) as EnergyToken).transfer(user2.address, transferAmount);

      expect(await energyToken.balanceOf(user1.address)).to.equal(amount - transferAmount);
      expect(await energyToken.balanceOf(user2.address)).to.equal(transferAmount);
    });
  });
});
