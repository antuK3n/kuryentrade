# KuryenTrade

P2P Energy Trading Platform on Polkadot

## Project Structure

```
kuryentrade/
├── apps/
│   ├── frontend/        # Next.js web application
│   │   ├── src/app/     # Pages (Dashboard, Controller, Admin, etc.)
│   │   ├── src/components/
│   │   └── src/lib/     # Web3 context & contracts
│   │
│   └── backend/         # IoT Oracle simulation
│       └── src/         # Express server & IoT simulator
│
├── packages/
│   └── contracts/       # Solidity smart contracts (Hardhat)
│       ├── contracts/   # KuryenTradeSystemNFT, EnergyToken, ECTRequestBoard
│       ├── scripts/     # Deployment scripts
│       └── test/        # Contract tests
│
├── DOCUMENTATION.md     # Full technical documentation
└── package.json         # Monorepo root with workspaces
```

## Quick Start

### Prerequisites
- Node.js 18+
- MetaMask browser extension

### Installation

```bash
# Install all dependencies
npm install
npm run install:all
```

### Development

**Terminal 1: Start Hardhat Node**
```bash
npm run contracts:node
```

**Terminal 2: Deploy Contracts**
```bash
npm run contracts:deploy
```

**Terminal 3: Start Frontend**
```bash
npm run frontend:dev
```

**Terminal 4 (Optional): Start Backend IoT Simulator**
```bash
npm run backend:dev
```

### Or run everything at once:
```bash
npm run dev
```

## Demo Wallets

| Role | Address | Private Key |
|------|---------|-------------|
| Admin | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974...` |
| User 1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c699...` |
| User 2 | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | `0x5de411...` |

## MetaMask Network Setup

| Setting | Value |
|---------|-------|
| Network Name | Hardhat Local |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency | ETH |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run contracts:node` | Start local Hardhat blockchain |
| `npm run contracts:deploy` | Deploy contracts to local network |
| `npm run contracts:compile` | Compile Solidity contracts |
| `npm run contracts:test` | Run contract tests |
| `npm run frontend:dev` | Start Next.js dev server |
| `npm run frontend:build` | Build frontend for production |
| `npm run backend:dev` | Start IoT oracle backend |
| `npm run backend:simulate` | Run IoT generation simulation |

## Tech Stack

- **Blockchain**: Polkadot (Moonbeam/Astar EVM)
- **Smart Contracts**: Solidity 0.8.24, Hardhat, OpenZeppelin
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS v4, ethers.js v6
- **Backend**: Node.js, Express, ethers.js

## License

MIT
