// Network configuration for local Hardhat
export const NETWORK_CONFIG = {
  chainId: 31337,
  chainName: "Hardhat Local",
  rpcUrl: "http://127.0.0.1:8545",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
};

// Demo wallets (Hardhat default accounts)
export const DEMO_WALLETS = {
  // Admin wallet - has admin role, can mint NFTs, change states
  admin: {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    role: "Admin",
  },
  // User 1 - prosumer with solar system NFT
  user1: {
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    role: "User",
  },
  // User 2 - consumer who can request ECT
  user2: {
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
    role: "User",
  },
};

// Controller address (same as admin for demo - in production this would be oracle)
export const CONTROLLER_ADDRESS = DEMO_WALLETS.admin.address;

// Contract addresses (local Hardhat deployment)
export const CONTRACT_ADDRESSES = {
  energyToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  kuryenTradeSystemNFT: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  ectRequestBoard: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
};

// ABIs (minimal interfaces)
export const ENERGY_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function totalEnergyGenerated() view returns (uint256)",
  "function totalEnergyConsumed() view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

export const KURYENTRADE_SYSTEM_NFT_ABI = [
  // View functions
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function getSystemData(uint256 tokenId) view returns (tuple(uint256 capacityWatts, bytes32 locationHash, uint256 installationDate, bytes32 hardwareId, uint8 state, uint256 totalGenerated, uint256 lastClaimTime))",
  "function getSystemsByOwner(address owner) view returns (uint256[])",
  "function totalSystems() view returns (uint256)",
  "function isSystemActive(uint256 tokenId) view returns (bool)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",
  // User functions
  "function claimGeneration(uint256 tokenId, uint256 kwhGenerated)",
  // Admin functions
  "function mintSystem(address to, uint256 capacityWatts, bytes32 locationHash, bytes32 hardwareId) returns (uint256)",
  "function setSystemState(uint256 tokenId, uint8 newState)",
  "function setTokenURI(uint256 tokenId, string uri)",
  "function adminTransfer(address from, address to, uint256 tokenId)",
  "function grantRole(bytes32 role, address account)",
  "function revokeRole(bytes32 role, address account)",
  // Events
  "event GenerationClaimed(uint256 indexed tokenId, address indexed claimant, uint256 kwhGenerated, uint256 ectMinted)",
  "event SystemMinted(uint256 indexed tokenId, address indexed owner, uint256 capacityWatts, bytes32 hardwareId)",
  "event SystemStateChanged(uint256 indexed tokenId, uint8 oldState, uint8 newState)",
];

export const ECT_REQUEST_BOARD_ABI = [
  "function createRequest(uint256 amountECT, uint256 pricePerECT) payable returns (uint256)",
  "function fulfillRequest(uint256 requestId)",
  "function cancelRequest(uint256 requestId)",
  "function getRequest(uint256 requestId) view returns (tuple(uint256 id, address requester, uint256 amountECT, uint256 pricePerECT, uint256 createdAt, uint256 fulfilledAt, address fulfilledBy, uint8 status))",
  "function getOpenRequests(uint256 offset, uint256 limit) view returns (tuple(uint256 id, address requester, uint256 amountECT, uint256 pricePerECT, uint256 createdAt, uint256 fulfilledAt, address fulfilledBy, uint8 status)[])",
  "function getRequestsByUser(address user, uint256 offset, uint256 limit) view returns (tuple(uint256 id, address requester, uint256 amountECT, uint256 pricePerECT, uint256 createdAt, uint256 fulfilledAt, address fulfilledBy, uint8 status)[])",
  "function openRequestCount() view returns (uint256)",
  "function getUserRequestCount(address user) view returns (uint256)",
  "function calculateTotalPrice(uint256 amountECT, uint256 pricePerECT) pure returns (uint256)",
  "event RequestCreated(uint256 indexed requestId, address indexed requester, uint256 amountECT, uint256 pricePerECT)",
  "event RequestFulfilled(uint256 indexed requestId, address indexed requester, address indexed fulfiller, uint256 amountECT, uint256 totalPrice)",
  "event RequestCancelled(uint256 indexed requestId, address indexed requester)",
];

export const REQUEST_STATUS = {
  0: "Open",
  1: "Fulfilled",
  2: "Cancelled",
} as const;

export const SYSTEM_STATE = {
  0: "Active",
  1: "Maintenance",
  2: "Disconnected",
} as const;
