"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/Web3Context";
import { ethers } from "ethers";
import { SYSTEM_STATE, DEMO_WALLETS } from "@/lib/contracts";

interface SystemData {
  tokenId: number;
  owner: string;
  capacityWatts: bigint;
  state: number;
  totalGenerated: bigint;
}

export default function AdminPage() {
  const { account, kuryenTradeSystemNFT } = useWeb3();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [systems, setSystems] = useState<SystemData[]>([]);

  // Mint form state
  const [mintTo, setMintTo] = useState("");
  const [mintCapacity, setMintCapacity] = useState("");
  const [mintLocation, setMintLocation] = useState("");
  const [minting, setMinting] = useState(false);

  // State change form
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);
  const [newState, setNewState] = useState<number>(0);
  const [changingState, setChangingState] = useState(false);

  // Check if user is admin (using demo wallet for simplicity)
  useEffect(() => {
    if (!account) {
      setLoading(false);
      return;
    }

    const isAdminWallet = account.toLowerCase() === DEMO_WALLETS.admin.address.toLowerCase();
    setIsAdmin(isAdminWallet);
    setLoading(false);
  }, [account]);

  // Load all systems
  useEffect(() => {
    const loadSystems = async () => {
      if (!kuryenTradeSystemNFT || !isAdmin) return;

      try {
        const total = await kuryenTradeSystemNFT.totalSystems();
        const systemsData: SystemData[] = [];

        for (let i = 1; i <= Number(total); i++) {
          try {
            const owner = await kuryenTradeSystemNFT.ownerOf(i);
            const data = await kuryenTradeSystemNFT.getSystemData(i);
            systemsData.push({
              tokenId: i,
              owner,
              capacityWatts: data.capacityWatts,
              state: data.state,
              totalGenerated: data.totalGenerated,
            });
          } catch {
            // Token might not exist
          }
        }

        setSystems(systemsData);
      } catch (error) {
        console.error("Error loading systems:", error);
      }
    };

    loadSystems();
  }, [kuryenTradeSystemNFT, isAdmin]);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kuryenTradeSystemNFT || !mintTo || !mintCapacity) return;

    setMinting(true);
    try {
      const capacityWatts = BigInt(parseFloat(mintCapacity) * 1000); // Convert kW to W
      const locationHash = ethers.keccak256(ethers.toUtf8Bytes(mintLocation || "default"));
      const hardwareId = ethers.keccak256(ethers.toUtf8Bytes(`hw-${Date.now()}`));

      const tx = await kuryenTradeSystemNFT.mintSystem(mintTo, capacityWatts, locationHash, hardwareId);
      await tx.wait();

      alert("System minted successfully!");
      setMintTo("");
      setMintCapacity("");
      setMintLocation("");

      // Reload systems
      const total = await kuryenTradeSystemNFT.totalSystems();
      const systemsData: SystemData[] = [];
      for (let i = 1; i <= Number(total); i++) {
        try {
          const owner = await kuryenTradeSystemNFT.ownerOf(i);
          const data = await kuryenTradeSystemNFT.getSystemData(i);
          systemsData.push({
            tokenId: i,
            owner,
            capacityWatts: data.capacityWatts,
            state: data.state,
            totalGenerated: data.totalGenerated,
          });
        } catch {
          // Token might not exist
        }
      }
      setSystems(systemsData);
    } catch (error) {
      console.error("Error minting system:", error);
      alert("Failed to mint system");
    } finally {
      setMinting(false);
    }
  };

  const handleStateChange = async () => {
    if (!kuryenTradeSystemNFT || selectedSystem === null) return;

    setChangingState(true);
    try {
      const tx = await kuryenTradeSystemNFT.setSystemState(selectedSystem, newState);
      await tx.wait();

      alert("System state updated!");

      // Update local state
      setSystems(systems.map(s =>
        s.tokenId === selectedSystem ? { ...s, state: newState } : s
      ));
      setSelectedSystem(null);
    } catch (error) {
      console.error("Error changing state:", error);
      alert("Failed to change state");
    } finally {
      setChangingState(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!account) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#E6F2EA] rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-[#349552]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1A3A2E] mb-2">Connect Your Wallet</h2>
          <p className="text-[#6B7C75]">Connect your wallet to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-[#6B7C75]">Checking permissions...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1A3A2E] mb-2">Access Denied</h2>
          <p className="text-[#6B7C75]">You do not have admin permissions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#1A3A2E] mb-8">Admin Panel</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mint New System */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D4E0D9] overflow-hidden">
          <div className="bg-[#266433] px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Mint New System</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleMint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A3A2E] mb-2">
                  Owner Address
                </label>
                <input
                  type="text"
                  value={mintTo}
                  onChange={(e) => setMintTo(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 border border-[#D4E0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#349552]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A3A2E] mb-2">
                  Capacity (kW)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={mintCapacity}
                  onChange={(e) => setMintCapacity(e.target.value)}
                  placeholder="5.0"
                  className="w-full px-4 py-3 border border-[#D4E0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#349552]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A3A2E] mb-2">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={mintLocation}
                  onChange={(e) => setMintLocation(e.target.value)}
                  placeholder="Grid Node 47"
                  className="w-full px-4 py-3 border border-[#D4E0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#349552]"
                />
              </div>
              <button
                type="submit"
                disabled={minting}
                className="w-full py-3 bg-[#349552] text-white rounded-xl font-semibold hover:bg-[#266433] transition-colors disabled:opacity-50"
              >
                {minting ? "Minting..." : "Mint System NFT"}
              </button>
            </form>
          </div>
        </div>

        {/* Change System State */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D4E0D9] overflow-hidden">
          <div className="bg-[#266433] px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Change System State</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A3A2E] mb-2">
                  Select System
                </label>
                <select
                  value={selectedSystem ?? ""}
                  onChange={(e) => setSelectedSystem(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-3 border border-[#D4E0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#349552]"
                >
                  <option value="">Select a system...</option>
                  {systems.map((s) => (
                    <option key={s.tokenId} value={s.tokenId}>
                      #{s.tokenId} - {formatAddress(s.owner)} ({SYSTEM_STATE[s.state as keyof typeof SYSTEM_STATE]})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A3A2E] mb-2">
                  New State
                </label>
                <select
                  value={newState}
                  onChange={(e) => setNewState(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-[#D4E0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#349552]"
                >
                  <option value={0}>Active</option>
                  <option value={1}>Maintenance</option>
                  <option value={2}>Disconnected</option>
                </select>
              </div>
              <button
                onClick={handleStateChange}
                disabled={changingState || selectedSystem === null}
                className="w-full py-3 bg-[#F06838] text-white rounded-xl font-semibold hover:bg-[#d55a2f] transition-colors disabled:opacity-50"
              >
                {changingState ? "Updating..." : "Update State"}
              </button>
            </div>
          </div>
        </div>

        {/* All Systems */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#D4E0D9] overflow-hidden">
          <div className="bg-[#266433] px-6 py-4">
            <h2 className="text-lg font-semibold text-white">All Systems ({systems.length})</h2>
          </div>
          <div className="p-6">
            {systems.length === 0 ? (
              <p className="text-[#6B7C75] text-center py-8">No systems registered yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#D4E0D9]">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A3A2E]">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A3A2E]">Owner</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A3A2E]">Capacity</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A3A2E]">Generated</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A3A2E]">State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systems.map((system) => (
                      <tr key={system.tokenId} className="border-b border-[#D4E0D9] hover:bg-[#F5F7F6]">
                        <td className="px-4 py-3 font-mono">#{system.tokenId}</td>
                        <td className="px-4 py-3 font-mono text-sm">{formatAddress(system.owner)}</td>
                        <td className="px-4 py-3">{Number(system.capacityWatts) / 1000} kW</td>
                        <td className="px-4 py-3">{Number(system.totalGenerated)} kWh</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            system.state === 0
                              ? "bg-[#E6F2EA] text-[#349552]"
                              : system.state === 1
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {SYSTEM_STATE[system.state as keyof typeof SYSTEM_STATE]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
