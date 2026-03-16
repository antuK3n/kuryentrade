import { ThirdwebStorage } from "@thirdweb-dev/storage";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const storage = new ThirdwebStorage({
    secretKey: process.env.THIRDWEB_SECRET_KEY, // Optional for free tier
  });

  // Read the image file
  const imagePath = "/Users/kenmondragon/Downloads/images (2).jpeg";
  const imageBuffer = fs.readFileSync(imagePath);

  console.log("Uploading image to IPFS...");

  // Upload image
  const imageUri = await storage.upload(imageBuffer, {
    uploadWithoutDirectory: true,
  });

  console.log("Image uploaded:", imageUri);

  // Create metadata
  const metadata = {
    name: "Solar System #1",
    description: "A 5kW solar panel installation in the neighborhood grid. This NFT represents ownership and generation rights for this solar system.",
    image: imageUri,
    attributes: [
      { trait_type: "Capacity", value: "5000 Watts" },
      { trait_type: "Location", value: "Neighborhood Grid" },
      { trait_type: "Status", value: "Active" },
      { trait_type: "Installation Date", value: new Date().toISOString().split('T')[0] }
    ]
  };

  console.log("Uploading metadata to IPFS...");

  // Upload metadata
  const metadataUri = await storage.upload(metadata, {
    uploadWithoutDirectory: true,
  });

  console.log("Metadata uploaded:", metadataUri);
  console.log("\nUse this URI for the NFT tokenURI:", metadataUri);

  // Save to file for deploy script
  const output = {
    imageUri,
    metadataUri,
    metadata
  };

  fs.writeFileSync(
    path.join(__dirname, "ipfs-output.json"),
    JSON.stringify(output, null, 2)
  );

  console.log("\nSaved to scripts/ipfs-output.json");
}

main().catch(console.error);
