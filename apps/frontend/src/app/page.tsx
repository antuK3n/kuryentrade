"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/Web3Context";
import { ethers } from "ethers";
import { SYSTEM_STATE } from "@/lib/contracts";
import Link from "next/link";

interface SystemData {
  tokenId: number;
  capacityWatts: bigint;
  state: number;
  totalGenerated: bigint;
  lastClaimTime: bigint;
}

// Mock data for recent transactions (in production, fetch from events)
const mockTransactions = [
  { type: "received", amount: 50, from: "USER C" },
  { type: "sent", amount: 100, to: "USER B" },
  { type: "ticket", message: "TICKET REVIEWED" },
];

export default function Dashboard() {
  const { account, ectBalance, kuryenTradeSystemNFT, energyToken, refreshBalances } = useWeb3();
  const [systems, setSystems] = useState<SystemData[]>([]);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState<number | null>(null);
  const [claimAmount, setClaimAmount] = useState("");
  const [stats, setStats] = useState({
    totalGenerated: "0",
    totalConsumed: "0",
    totalSystems: 0,
  });

  // Load user's systems
  useEffect(() => {
    if (!kuryenTradeSystemNFT || !account) return;

    const loadSystems = async () => {
      setLoading(true);
      try {
        const tokenIds = await kuryenTradeSystemNFT.getSystemsByOwner(account);
        const systemsData: SystemData[] = [];

        for (const tokenId of tokenIds) {
          const data = await kuryenTradeSystemNFT.getSystemData(tokenId);
          systemsData.push({
            tokenId: Number(tokenId),
            capacityWatts: data.capacityWatts,
            state: data.state,
            totalGenerated: data.totalGenerated,
            lastClaimTime: data.lastClaimTime,
          });
        }

        setSystems(systemsData);
      } catch (error) {
        console.error("Error loading systems:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSystems();
  }, [kuryenTradeSystemNFT, account]);

  // Load global stats
  useEffect(() => {
    if (!energyToken || !kuryenTradeSystemNFT) return;

    const loadStats = async () => {
      try {
        const [generated, consumed, totalSys] = await Promise.all([
          energyToken.totalEnergyGenerated(),
          energyToken.totalEnergyConsumed(),
          kuryenTradeSystemNFT.totalSystems(),
        ]);

        setStats({
          totalGenerated: ethers.formatEther(generated),
          totalConsumed: ethers.formatEther(consumed),
          totalSystems: Number(totalSys),
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    };

    loadStats();
  }, [energyToken, kuryenTradeSystemNFT]);

  const handleClaim = async (tokenId: number) => {
    if (!kuryenTradeSystemNFT || !claimAmount) return;

    setClaiming(tokenId);
    try {
      const tx = await kuryenTradeSystemNFT.claimGeneration(tokenId, BigInt(claimAmount));
      await tx.wait();
      setClaimAmount("");
      await refreshBalances();

      // Reload systems
      const tokenIds = await kuryenTradeSystemNFT.getSystemsByOwner(account);
      const systemsData: SystemData[] = [];
      for (const id of tokenIds) {
        const data = await kuryenTradeSystemNFT.getSystemData(id);
        systemsData.push({
          tokenId: Number(id),
          capacityWatts: data.capacityWatts,
          state: data.state,
          totalGenerated: data.totalGenerated,
          lastClaimTime: data.lastClaimTime,
        });
      }
      setSystems(systemsData);
    } catch (error) {
      console.error("Error claiming generation:", error);
      alert("Failed to claim generation");
    } finally {
      setClaiming(null);
    }
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
          <p className="text-[#6B7C75] mb-6">Connect your wallet to view your dashboard and manage your solar systems.</p>
        </div>
      </div>
    );
  }

  const currentSystem = systems[0];
  const capacityKW = currentSystem ? Number(currentSystem.capacityWatts) / 1000 : 5;
  const currentOutput = capacityKW * 0.8; // Mock 80% output

  return (
    <div className="p-8">
      <div className="grid grid-cols-12 gap-6">
        {/* My Balance Card */}
        <div className="col-span-12 lg:col-span-5 bg-[#349552] rounded-2xl p-6 text-white">
          <h2 className="text-lg font-medium mb-4">My Balance</h2>
          <div className="font-jersey text-7xl tracking-wider">
            {parseFloat(ectBalance).toFixed(0)} ETC
          </div>
        </div>

        {/* Empty space for layout balance */}
        <div className="col-span-12 lg:col-span-7" />

        {/* Recent Transactions */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-[#D4E0D9]">
          <h3 className="text-lg font-semibold text-[#349552] mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {mockTransactions.map((tx, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#F06838]" />
                <span className="text-sm text-[#349552] font-medium">
                  {tx.type === "received" && `RECEIVED ${tx.amount} ETC FROM ${tx.from}`}
                  {tx.type === "sent" && `SENT ${tx.amount} ETC TO ${tx.to}`}
                  {tx.type === "ticket" && tx.message}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Generation */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-[#D4E0D9]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#1A3A2E]">Live Generation</h3>
            <span className="flex items-center gap-2 text-sm text-[#349552]">
              <span className="w-2 h-2 rounded-full bg-[#349552]" />
              Active
            </span>
          </div>

          <div className="text-center mb-6">
            <div className="font-jersey text-5xl text-[#349552]">{currentOutput.toFixed(1)}</div>
            <div className="text-sm text-[#6B7C75]">kW</div>
            <div className="text-sm text-[#6B7C75] mt-2">Current Output</div>
            <div className="text-sm text-[#1A3A2E] font-medium">80% of {capacityKW} kW capacity</div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#D4E0D9]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#6B7C75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4" />
              </svg>
              <div>
                <div className="text-xs text-[#6B7C75]">Today&apos;s Total</div>
                <div className="font-semibold text-[#1A3A2E]">16 kWh</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#6B7C75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="text-xs text-[#6B7C75]">Peak Hour</div>
                <div className="font-semibold text-[#1A3A2E]">12:45 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-[#D4E0D9]">
          <h3 className="text-lg font-semibold text-[#349552] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/request"
              className="block w-full py-3 px-4 text-center border-2 border-[#349552] text-[#349552] rounded-xl font-medium hover:bg-[#E6F2EA] transition-colors"
            >
              Request ETC
            </Link>
            <Link
              href="/send-request"
              className="block w-full py-3 px-4 text-center border-2 border-[#349552] text-[#349552] rounded-xl font-medium hover:bg-[#E6F2EA] transition-colors"
            >
              Send ETC
            </Link>
          </div>
        </div>

        {/* System NFT Card */}
        {currentSystem && (
          <div className="col-span-12 lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-[#D4E0D9]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#E6F2EA] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#349552]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-[#6B7C75]">KuryenTrade System NFT</div>
                  <div className="font-semibold text-[#349552]">
                    #A47B-{currentSystem.tokenId.toString(16).toUpperCase().padStart(4, '0')}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                currentSystem.state === 0
                  ? "bg-[#E6F2EA] text-[#349552]"
                  : currentSystem.state === 1
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                {SYSTEM_STATE[currentSystem.state as keyof typeof SYSTEM_STATE]}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-[#6B7C75]">Hardware ID</div>
                <div className="font-mono text-[#1A3A2E]">0x7F2A...8B4C</div>
              </div>
              <div className="text-right">
                <div className="text-[#6B7C75]">Capacity</div>
                <div className="text-[#1A3A2E] font-medium">{capacityKW.toFixed(1)} kW</div>
              </div>
              <div className="text-right">
                <div className="text-[#6B7C75]">Location</div>
                <div className="text-[#1A3A2E] font-medium">Grid Node 47</div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-[#349552]">
              <span className="w-2 h-2 rounded-full bg-[#349552]" />
              Verified by 3/3 Oracles
            </div>

            {currentSystem.state === 0 && (
              <div className="mt-4 pt-4 border-t border-[#D4E0D9] flex items-center gap-3">
                <input
                  type="number"
                  placeholder="kWh"
                  value={claiming === currentSystem.tokenId ? claimAmount : ""}
                  onChange={(e) => {
                    setClaiming(currentSystem.tokenId);
                    setClaimAmount(e.target.value);
                  }}
                  className="w-24 px-3 py-2 border border-[#D4E0D9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#349552] focus:border-transparent"
                />
                <button
                  onClick={() => handleClaim(currentSystem.tokenId)}
                  disabled={claiming === currentSystem.tokenId && !claimAmount}
                  className="px-4 py-2 bg-[#349552] text-white rounded-lg font-medium hover:bg-[#266433] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {claiming === currentSystem.tokenId ? "Claiming..." : "Claim ECT"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Show message if no systems */}
        {!loading && systems.length === 0 && (
          <div className="col-span-12 lg:col-span-7 bg-white rounded-2xl p-8 shadow-sm border border-[#D4E0D9] text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#E6F2EA] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#349552]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-[#6B7C75]">You don&apos;t have any systems yet.</p>
            <p className="text-sm text-[#6B7C75] mt-1">Contact an admin to register your installation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
