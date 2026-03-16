import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    polygon: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/WcbWnYhrK-1Xmh9MI_FH9Pqzr1CyKDui",
      accounts: ["ad5a3d12ff9c4a112c6aa7aeecc2ab97287bd4adf2538806fdc70f10892095f2"],
      gasPrice: 50000000000
    }
  },
};

export default config;
