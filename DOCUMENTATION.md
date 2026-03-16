# KuryenTrade - P2P Energy Trading Platform (this is ai in its entirety, caution!!!)

## Executive Summary

KuryenTrade is a decentralized peer-to-peer energy trading platform that enables prosumers (producer-consumers) to trade renewable energy credits within their local grid using blockchain technology. By tokenizing solar energy generation as ERC-20 tokens and representing solar installations as NFTs, KuryenTrade creates a transparent, trustless marketplace for neighborhood energy trading.

---

## Problem Statement

The traditional energy grid operates on a one-way model where centralized power plants generate electricity and consumers simply pay utility bills. This model faces several challenges:

1. **Wasted Renewable Energy** - Homeowners with solar panels often generate excess energy that goes unused or is sold back to utilities at unfavorable rates.

2. **No Local Trading** - Neighbors cannot directly trade energy with each other, even when one has excess and another has demand.

3. **Lack of Transparency** - Consumers have no visibility into where their energy comes from or how it's priced.

4. **Inefficient Settlement** - Traditional energy billing involves intermediaries, delayed payments, and administrative overhead.

5. **No Incentive Alignment** - Prosumers aren't properly rewarded for contributing clean energy to the local grid.

---

## Our Solution

KuryenTrade solves these problems through blockchain-based energy tokenization:

### Core Concept
- **1 ECT (Energy Credit Token) = 1 kWh of solar energy generated**
- Solar systems are registered as **NFTs** that serve as the identity and controller for energy claims
- Prosumers can **trade ECT tokens** directly with neighbors through a decentralized marketplace
- All transactions are **transparent and immutable** on the blockchain

### Key Features
- **Mint ECT** when solar panels generate energy
- **Burn ECT** when consuming energy
- **Trade ECT** with other users through P2P marketplace
- **Track** generation and consumption in real-time
- **Verify** energy sources through NFT-linked hardware IDs

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │Dashboard │  │Controller│  │ Request  │  │  Admin   │        │
│  │          │  │          │  │  Board   │  │  Panel   │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
└───────┼─────────────┼─────────────┼─────────────┼───────────────┘
        │             │             │             │
        └─────────────┴──────┬──────┴─────────────┘
                             │ ethers.js
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SMART CONTRACTS (Solidity)                    │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ KuryenTradeSystemNFT  │  │  EnergyToken    │  │ ECTRequestBoard │ │
│  │    (ERC-721)    │──│    (ERC-20)     │──│   (Marketplace) │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BLOCKCHAIN (EVM)                            │
│              Polkadot Parachain (Moonbeam/Astar)                │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology |
|-------|------------|
| Blockchain | Polkadot Parachain (EVM-compatible) |
| Smart Contracts | Solidity 0.8.24 |
| Contract Framework | Hardhat + OpenZeppelin |
| Frontend | Next.js 16 + TypeScript |
| Styling | Tailwind CSS v4 |
| Web3 Integration | ethers.js v6 |
| Wallet | MetaMask |

---

## Smart Contracts

### 1. KuryenTradeSystemNFT (ERC-721)

The KuryenTradeSystemNFT contract is the identity layer for solar installations. Each physical solar system is represented by a unique, non-transferable NFT.

**Key Data Structure:**
```solidity
struct SystemData {
    uint256 capacityWatts;      // System capacity (e.g., 5000 = 5kW)
    bytes32 locationHash;       // Hashed location for privacy
    uint256 installationDate;   // When system was registered
    bytes32 hardwareId;         // Unique hardware identifier
    SystemState state;          // Active, Maintenance, Disconnected
    uint256 totalGenerated;     // Lifetime kWh generated
    uint256 lastClaimTime;      // Last ECT claim timestamp
}
```

**Key Functions:**
| Function | Access | Description |
|----------|--------|-------------|
| `mintSystem()` | Admin | Register new solar installation |
| `claimGeneration()` | Owner | Claim ECT for generated energy |
| `setSystemState()` | Admin | Update system status |
| `getSystemsByOwner()` | Public | Get all systems owned by address |

**Why NFT as Identity:**
- Creates tamper-proof link between physical hardware and blockchain
- Only NFT owner can claim generation credits
- System metadata is permanently recorded
- Enables future features like system trading or collateralization

### 2. EnergyToken (ERC-20)

The EnergyToken (ECT) represents energy credits where 1 ECT = 1 kWh of solar energy.

**Key Features:**
- **Controlled Minting** - Only KuryenTradeSystemNFT contract can mint tokens
- **Public Burning** - Any holder can burn tokens to record consumption
- **Generation Tracking** - Tracks total energy generated across all systems
- **Consumption Tracking** - Tracks total energy consumed (burned)

**Key Functions:**
| Function | Access | Description |
|----------|--------|-------------|
| `mint()` | Minter Only | Create new ECT (called by NFT contract) |
| `burn()` | Token Holder | Destroy ECT to record consumption |
| `totalEnergyGenerated()` | Public | Get total kWh ever generated |
| `totalEnergyConsumed()` | Public | Get total kWh ever consumed |

### 3. ECTRequestBoard (Marketplace)

The ECTRequestBoard enables peer-to-peer trading of energy credits with escrow protection.

**Request Lifecycle:**
```
CREATE REQUEST          FULFILL REQUEST         COMPLETE
     │                        │                    │
     ▼                        ▼                    ▼
┌─────────┐             ┌─────────┐          ┌─────────┐
│ Buyer   │             │ Seller  │          │ Both    │
│ deposits│────────────▶│ sends   │─────────▶│ receive │
│ ETH     │             │ ECT     │          │ assets  │
└─────────┘             └─────────┘          └─────────┘
   escrow                transfer             settlement
```

**Key Functions:**
| Function | Description |
|----------|-------------|
| `createRequest()` | Post buy order with ETH escrow |
| `fulfillRequest()` | Seller provides ECT, receives ETH |
| `cancelRequest()` | Buyer cancels, gets ETH refund |
| `getOpenRequests()` | List all available requests |

---

## Frontend Architecture

### User Roles & Views

**1. Regular Users (Prosumers)**
- Dashboard - View balance, solar system status
- Controller - Claim generation, consume energy
- Request Board - View and fulfill energy requests
- Send Request - Create buy orders for ECT

**2. Administrators**
- Admin Panel - Mint new system NFTs, manage states
- All user features

### Key Pages

| Route | Purpose |
|-------|---------|
| `/` | Dashboard with balance and system overview |
| `/controller` | Claim ECT, burn ECT, view my systems |
| `/request` | View community energy requests |
| `/send-request` | Create new ECT buy request |
| `/admin` | Admin panel for system management |

---

## User Flows

### Flow 1: Energy Generation → Token Minting

```
Solar Panels Generate    User Claims         ECT Minted
     Energy              Generation          to Wallet
        │                    │                   │
        ▼                    ▼                   ▼
   ┌─────────┐         ┌─────────┐         ┌─────────┐
   │ 50 kWh  │────────▶│Controller│────────▶│ +50 ECT │
   │generated│         │  Page   │         │ balance │
   └─────────┘         └─────────┘         └─────────┘
```

### Flow 2: P2P Energy Trading

```
Buyer Creates      Seller Fulfills     Assets Exchange
   Request              Order
      │                   │                  │
      ▼                   ▼                  ▼
┌──────────┐        ┌──────────┐       ┌──────────┐
│ 100 ECT  │        │ Send ECT │       │Buyer: ECT│
│ @ 0.001  │───────▶│ Receive  │──────▶│Seller:ETH│
│ ETH each │        │   ETH    │       │          │
└──────────┘        └──────────┘       └──────────┘
  0.1 ETH              escrow           settlement
  escrowed            released
```

### Flow 3: Energy Consumption

```
User Consumes        Burn ECT          Consumption
   Energy            Tokens             Recorded
      │                 │                   │
      ▼                 ▼                   ▼
┌──────────┐       ┌──────────┐       ┌──────────┐
│ Use 30   │──────▶│Controller│──────▶│ -30 ECT  │
│   kWh    │       │  Burn    │       │ balance  │
└──────────┘       └──────────┘       └──────────┘
```

---

## Why Polkadot?

### 1. Low Transaction Costs
Energy microtransactions require minimal fees. Polkadot parachains offer predictable, low-cost transactions compared to Ethereum mainnet's variable gas prices.

### 2. Scalability
High-frequency IoT data from solar sensors needs a blockchain that can handle throughput. Polkadot's parallel processing across parachains prevents congestion.

### 3. Interoperability
Energy credits could be bridged to other chains. A user could mint ECT on Polkadot and trade it on Ethereum DEXs through cross-chain bridges.

### 4. Customizable Parachains
Future development could include a dedicated energy parachain with custom consensus rules, oracle integrations, and grid-specific governance using Substrate.

### 5. Shared Security
Inherits security from the Polkadot relay chain without needing to bootstrap a separate validator set.

### 6. Environmental Alignment
Polkadot's Nominated Proof-of-Stake is energy-efficient—important optics for a green energy platform.

### Deployment Target
For EVM compatibility, we target **Moonbeam** or **Astar** parachains, allowing Solidity contracts while benefiting from Polkadot's ecosystem.

---

## IoT Integration Architecture

### Overview

In production, energy generation data would be automatically reported by IoT devices installed on solar systems, eliminating manual claiming and ensuring data integrity.

### Hardware Components

```
┌─────────────────────────────────────────────────────────────────┐
│                     SOLAR INSTALLATION                          │
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │Solar Panels │───▶│  Inverter   │───▶│ Smart Meter │         │
│  │             │    │             │    │   (IoT)     │         │
│  └─────────────┘    └─────────────┘    └──────┬──────┘         │
│                                               │                 │
└───────────────────────────────────────────────┼─────────────────┘
                                                │
                                    ┌───────────▼───────────┐
                                    │   IoT Gateway         │
                                    │  - ESP32/Raspberry Pi │
                                    │  - Secure Element     │
                                    │  - Hardware ID        │
                                    └───────────┬───────────┘
                                                │ MQTT/HTTPS
                                                ▼
                                    ┌───────────────────────┐
                                    │    Oracle Network     │
                                    │  (Chainlink/Acurast)  │
                                    └───────────┬───────────┘
                                                │
                                                ▼
                                    ┌───────────────────────┐
                                    │   Smart Contract      │
                                    │  KuryenTradeSystemNFT       │
                                    └───────────────────────┘
```

### IoT Device Specifications

| Component | Purpose |
|-----------|---------|
| **Smart Meter** | Measures real-time energy production (kWh) |
| **IoT Gateway** | Processes and signs data for transmission |
| **Secure Element** | Stores private keys for signing (e.g., ATECC608A) |
| **Hardware ID** | Unique identifier burned into chip, matches NFT metadata |

### Power Data Gathering

**Metering Options**

| Method | Description | Accuracy | Cost |
|--------|-------------|----------|------|
| **CT Clamp** | Non-invasive current transformer on AC line | ±1-2% | $10-30 |
| **Smart Inverter API** | Read directly from inverter (SolarEdge, Enphase, etc.) | ±0.5% | Free (software) |
| **Pulse Counter** | Count LED pulses on existing meter | ±1% | $5-15 |
| **RS485/Modbus** | Industrial protocol from energy meter | ±0.5% | $50-100 |

**Recommended Setup: CT Clamp + ESP32**

```
┌─────────────────────────────────────────────────────┐
│                METERING HARDWARE                     │
│                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │ CT Clamp │───▶│  ADC     │───▶│  ESP32   │      │
│  │ SCT-013  │    │ ADS1115  │    │          │      │
│  └──────────┘    └──────────┘    └────┬─────┘      │
│       │                               │             │
│       │ Clamps around                 │ WiFi        │
│       │ solar output wire             │             │
│       ▼                               ▼             │
│  ┌──────────┐                   ┌──────────┐       │
│  │ AC Line  │                   │  Cloud   │       │
│  │ from     │                   │  Server  │       │
│  │ Inverter │                   │          │       │
│  └──────────┘                   └──────────┘       │
└─────────────────────────────────────────────────────┘
```

**Hardware Bill of Materials**

| Component | Model | Purpose | Price |
|-----------|-------|---------|-------|
| Microcontroller | ESP32-WROOM | WiFi + processing | $5 |
| Current Sensor | SCT-013-030 | 30A CT clamp | $8 |
| ADC | ADS1115 | 16-bit precision | $3 |
| Voltage Sensor | ZMPT101B | AC voltage reference | $4 |
| Power Supply | HLK-PM01 | AC-DC 5V module | $3 |
| Enclosure | IP65 box | Weatherproof housing | $5 |
| **Total** | | | **~$28** |

**Reading Power Data (ESP32 Code)**

```cpp
#include <ADS1115_WE.h>
#include <WiFi.h>
#include <HTTPClient.h>

ADS1115_WE adc(0x48);

// Calibration constants
const float CT_RATIO = 1800;        // SCT-013-030: 1800 turns
const float BURDEN_RESISTOR = 33;   // Ohms
const float VOLTAGE_RMS = 220;      // Local grid voltage

float readPowerWatts() {
    float sumSquares = 0;
    int samples = 1000;

    for (int i = 0; i < samples; i++) {
        float voltage = adc.getResult_V();
        float current = (voltage / BURDEN_RESISTOR) * CT_RATIO;
        sumSquares += current * current;
        delayMicroseconds(200);
    }

    float currentRMS = sqrt(sumSquares / samples);
    float powerWatts = currentRMS * VOLTAGE_RMS;

    return powerWatts;
}

void reportToOracle(float kwhGenerated) {
    HTTPClient http;
    http.begin("https://oracle.kuryentrade.io/report");

    String payload = "{";
    payload += "\"hardwareId\":\"" + getHardwareId() + "\",";
    payload += "\"kwh\":" + String(kwhGenerated, 3) + ",";
    payload += "\"timestamp\":" + String(getTimestamp()) + ",";
    payload += "\"signature\":\"" + signData(kwhGenerated) + "\"";
    payload += "}";

    http.POST(payload);
    http.end();
}
```

**Alternative: Smart Inverter Integration**

Most modern inverters have APIs or local network access:

| Inverter Brand | Protocol | Data Access |
|----------------|----------|-------------|
| **SolarEdge** | REST API | Cloud API with key |
| **Enphase** | Local API | http://envoy.local/api |
| **Fronius** | Solar API | Local JSON endpoint |
| **Huawei** | Modbus TCP | Port 502 |
| **SMA** | Speedwire | UDP multicast |

```python
# Example: Reading from Enphase Envoy
import requests

def get_enphase_production():
    response = requests.get(
        "http://envoy.local/production.json",
        auth=("envoy", serial_number[-6:])
    )
    data = response.json()
    return data["production"][0]["wNow"]  # Current watts
```

**Data Aggregation**

```
Every 5 seconds:  Read instantaneous power (watts)
Every 1 minute:   Calculate average power
Every 1 hour:     Sum to kWh, report to oracle
                        │
                        ▼
            ┌───────────────────────┐
            │  Hourly Report        │
            │  ─────────────────    │
            │  kWh: 4.52            │
            │  Peak: 5.1 kW         │
            │  Timestamp: 1703001600│
            │  Signature: 0x3d4e... │
            └───────────────────────┘
```

### Data Flow

**Step 1: Energy Measurement**
```
Smart Meter reads: 5.2 kWh generated in last hour
```

**Step 2: Data Packaging**
```json
{
  "hardwareId": "0x7a9f3b...",
  "timestamp": 1703001600,
  "kwhGenerated": 5.2,
  "signature": "0x3d4e5f..."
}
```

**Step 3: Signature Generation**
- IoT device signs data with its private key stored in secure element
- Hardware ID in signature must match Hardware ID in NFT metadata
- Prevents spoofing - only the registered device can sign valid data

**Step 4: Oracle Verification**
```
Oracle Network receives data
    │
    ├── Verify signature matches registered hardware
    ├── Check timestamp is recent (within 1 hour)
    ├── Validate kWh is within system capacity
    │
    └── Submit verified data to blockchain
```

**Step 5: Automatic Minting**
```solidity
function oracleCallback(
    uint256 tokenId,
    uint256 kwhGenerated,
    bytes32 hardwareId,
    bytes calldata signature
) external onlyOracle {
    // Verify hardware ID matches NFT
    require(systems[tokenId].hardwareId == hardwareId);

    // Verify signature
    require(verifySignature(hardwareId, kwhGenerated, signature));

    // Mint ECT to system owner
    energyToken.mint(ownerOf(tokenId), kwhGenerated * 1e18);
}
```

### Oracle Options for Polkadot

| Oracle | Description |
|--------|-------------|
| **Chainlink** | Industry standard, available on Moonbeam |
| **Acurast** | Polkadot-native, TEE-based execution |
| **DIA** | Multi-chain oracle with Polkadot support |
| **Custom** | Substrate-based oracle parachain |

### Security Measures

**1. Hardware Attestation**
- Secure element generates unforgeable signatures
- Private key never leaves the device
- Hardware ID burned at manufacturing

**2. Tamper Detection**
- Physical tamper switches on meter enclosure
- Anomaly detection for unusual generation patterns
- Geolocation verification against registered location

**3. Multi-Oracle Consensus**
- Multiple oracles verify same data
- 2-of-3 or 3-of-5 threshold for acceptance
- Prevents single oracle manipulation

**4. Rate Limiting**
- Maximum claims per hour based on system capacity
- 5kW system cannot claim 100kWh in one hour
- Prevents oracle compromise from draining tokens

### Prototype vs Production

| Feature | Prototype (Current) | Production |
|---------|---------------------|------------|
| Data Source | Manual input | IoT smart meter |
| Verification | None (trusted user) | Oracle + signature |
| Claiming | User-initiated | Automatic hourly |
| Hardware Link | Simulated | Secure element |

### Implementation Roadmap

**Phase 1: Simulated IoT**
- Backend service simulates meter readings
- Tests oracle integration without hardware

**Phase 2: Development Kit**
- ESP32 + energy meter module
- Software signing (not secure element)
- Local testnet integration

**Phase 3: Production Hardware**
- Custom PCB with secure element
- Certified energy meter integration
- Tamper-proof enclosure

**Phase 4: Mass Deployment**
- Partnership with solar installers
- Pre-configured devices shipped with systems
- Automatic NFT minting on installation

---

## Security Considerations

### Smart Contract Security
- **ReentrancyGuard** on all external calls with value transfer
- **Access Control** using OpenZeppelin's role-based system
- **Immutable Token Address** prevents contract swap attacks
- **Custom Errors** for gas-efficient reverts

### Economic Security
- **Escrow System** - Buyer funds locked until fulfillment
- **Controlled Minting** - Only verified systems can create ECT
- **State Management** - Disabled systems cannot claim tokens

### Future Enhancements
- Oracle integration for automated generation verification
- Multi-signature admin controls
- Time-locked administrative functions

---

## Roadmap

### Phase 1: Prototype (Current)
- ✅ Core smart contracts
- ✅ Web frontend with wallet integration
- ✅ Manual generation claiming
- ✅ P2P marketplace

### Phase 2: Oracle Integration
- IoT sensor integration
- Chainlink oracle for generation verification
- Automated ECT minting based on real data

### Phase 3: Enhanced Features
- Mobile application
- Multi-grid support
- Dynamic pricing based on supply/demand
- Grid governance token

### Phase 4: Production Deployment
- Moonbeam/Astar mainnet deployment
- Partnership with solar installers
- Regulatory compliance framework
- Utility company integration

---

## Demo Wallets (Testnet)

| Role | Address | Assets |
|------|---------|--------|
| Admin | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | Admin role |
| User 1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | NFT #1 (5kW), 150 ECT |
| User 2 | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | NFT #2 (3kW), 100 ECT |

---

## Quick Start

```bash
# Clone repository
git clone https://github.com/your-repo/kuryentrade

# Install dependencies
npm install
cd frontend && npm install

# Start local blockchain
npx hardhat node

# Deploy contracts (new terminal)
npx hardhat run scripts/deploy.ts --network localhost

# Start frontend (new terminal)
cd frontend && npm run dev

# Open http://localhost:3000
```

---

## Contract Addresses (Local Testnet)

| Contract | Address |
|----------|---------|
| EnergyToken | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| KuryenTradeSystemNFT | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| ECTRequestBoard | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` |

---

## License

MIT License
