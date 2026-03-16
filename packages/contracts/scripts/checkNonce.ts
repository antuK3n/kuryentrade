import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Address:", signer.address);
  console.log("Confirmed Nonce:", await ethers.provider.getTransactionCount(signer.address, "latest"));
  console.log("Pending Nonce:", await ethers.provider.getTransactionCount(signer.address, "pending"));
}

main().catch(console.error);
