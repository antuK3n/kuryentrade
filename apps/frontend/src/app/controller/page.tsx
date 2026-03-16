"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/Web3Context";
import { SYSTEM_STATE } from "@/lib/contracts";
import { ethers } from "ethers";

interface SystemData {
  tokenId: number;
  owner: string;
  capacityWatts: bigint;
  state: number;
  totalGenerated: bigint;
  lastClaimTime: bigint;
}

export default function ControllerPage() {
  const { account, kuryenTradeSystemNFT, energyToken, ectBalance, refreshBalances } = useWeb3();
  const [loadingData, setLoadingData] = useState(true);
  const [mySystems, setMySystems] = useState<SystemData[]>([]);

  // Record generation form
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);
  const [kwhAmount, setKwhAmount] = useState("");
  const [recording, setRecording] = useState(false);

  // Burn ECT form
  const [burnAmount, setBurnAmount] = useState("");
  const [burning, setBurning] = useState(false);

  // Stats
  const [totalGenerated, setTotalGenerated] = useState("0");
  const [totalConsumed, setTotalConsumed] = useState("0");

  // Load user's systems and stats
  useEffect(() => {
    const loadData = async () => {
      if (!kuryenTradeSystemNFT || !energyToken || !account) return;

      setLoadingData(true);
      try {
        // Load global stats
        const [generated, consumed] = await Promise.all([
          energyToken.totalEnergyGenerated(),
          energyToken.totalEnergyConsumed(),
        ]);
        setTotalGenerated((Number(generated) / 1e18).toFixed(2));
        setTotalConsumed((Number(consumed) / 1e18).toFixed(2));

        // Load only user's systems
        const userSystemIds = await kuryenTradeSystemNFT.getSystemsByOwner(account);
        const systemsData: SystemData[] = [];

        for (const tokenId of userSystemIds) {
          try {
            const data = await kuryenTradeSystemNFT.getSystemData(tokenId);
            systemsData.push({
              tokenId: Number(tokenId),
              owner: account,
              capacityWatts: data.capacityWatts,
              state: Number(data.state),
              totalGenerated: data.totalGenerated,
              lastClaimTime: data.lastClaimTime,
            });
          } catch (err) {
            console.error(`Error loading system ${tokenId}:`, err);
          }
        }

        setMySystems(systemsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [kuryenTradeSystemNFT, energyToken, account]);

  const handleRecordGeneration = async () => {
    if (!kuryenTradeSystemNFT || !energyToken || selectedSystem === null || !kwhAmount) return;

    setRecording(true);
    try {
      // User claims generation for their own system - mints ECT to them
      const tx = await kuryenTradeSystemNFT.claimGeneration(selectedSystem, BigInt(kwhAmount));
      await tx.wait();

      alert(`Claimed ${kwhAmount} kWh from System #${selectedSystem}. ECT minted to your wallet!`);

      // Reload stats
      const [generated, consumed] = await Promise.all([
        energyToken.totalEnergyGenerated(),
        energyToken.totalEnergyConsumed(),
      ]);
      setTotalGenerated((Number(generated) / 1e18).toFixed(2));
      setTotalConsumed((Number(consumed) / 1e18).toFixed(2));

      // Update local system data
      const data = await kuryenTradeSystemNFT.getSystemData(selectedSystem);
      setMySystems(mySystems.map(s =>
        s.tokenId === selectedSystem
          ? { ...s, totalGenerated: data.totalGenerated, lastClaimTime: data.lastClaimTime, state: Number(data.state) }
          : s
      ));

      // Refresh wallet balance
      await refreshBalances();

      setKwhAmount("");
      setSelectedSystem(null);
    } catch (error: unknown) {
      console.error("Error claiming generation:", error);
      const err = error as { reason?: string; message?: string };
      alert(`Failed to claim generation: ${err.reason || err.message || "Unknown error"}`);
    } finally {
      setRecording(false);
    }
  };

  const handleBurnECT = async () => {
    if (!energyToken || !burnAmount) return;

    setBurning(true);
    try {
      // Convert kWh to wei (1 ECT = 1 kWh = 1e18 wei)
      const amountWei = BigInt(burnAmount) * BigInt(1e18);
      const tx = await energyToken.burn(amountWei);
      await tx.wait();

      alert(`Burned ${burnAmount} ECT (consumed ${burnAmount} kWh of energy)`);

      // Reload stats
      const [generated, consumed] = await Promise.all([
        energyToken.totalEnergyGenerated(),
        energyToken.totalEnergyConsumed(),
      ]);
      setTotalGenerated((Number(generated) / 1e18).toFixed(2));
      setTotalConsumed((Number(consumed) / 1e18).toFixed(2));

      // Refresh wallet balance
      await refreshBalances();

      setBurnAmount("");
    } catch (error: unknown) {
      console.error("Error burning ECT:", error);
      const err = error as { reason?: string; message?: string };
      alert(`Failed to burn ECT: ${err.reason || err.message || "Unknown error"}`);
    } finally {
      setBurning(false);
    }
  };

  const formatTime = (timestamp: bigint) => {
    if (Number(timestamp) === 0) return "Never";
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  if (!account) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#E6F2EA] rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-[#349552]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1A3A2E] mb-2">Connect Your Wallet</h2>
          <p className="text-[#6B7C75]">Connect your wallet to manage your energy systems.</p>
        </div>
      </div>
    );
  }

  const myActiveSystems = mySystems.filter(s => s.state === 0);
  const userBalance = ectBalance ? ethers.formatEther(ectBalance) : "0";

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#1A3A2E] mb-8">Energy Controller</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#D4E0D9]">
          <div className="text-sm text-[#6B7C75]">My ECT Balance</div>
          <div className="text-3xl font-bold text-[#349552] font-jersey">{parseFloat(userBalance).toFixed(0)}</div>
          <div className="text-sm text-[#6B7C75]">ECT available</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#D4E0D9]">
          <div className="text-sm text-[#6B7C75]">Grid Generated</div>
          <div className="text-3xl font-bold text-[#349552] font-jersey">{totalGenerated}</div>
          <div className="text-sm text-[#6B7C75]">kWh total</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#D4E0D9]">
          <div className="text-sm text-[#6B7C75]">Grid Consumed</div>
          <div className="text-3xl font-bold text-[#F06838] font-jersey">{totalConsumed}</div>
          <div className="text-sm text-[#6B7C75]">kWh total</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#D4E0D9]">
          <div className="text-sm text-[#6B7C75]">My Systems</div>
          <div className="text-3xl font-bold text-[#1A3A2E] font-jersey">{myActiveSystems.length}</div>
          <div className="text-sm text-[#6B7C75]">of {mySystems.length} active</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Claim Generation */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D4E0D9] overflow-hidden">
          <div className="bg-[#349552] px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Claim Generation</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A3A2E] mb-2">
                  Select My System
                </label>
                <select
                  value={selectedSystem ?? ""}
                  onChange={(e) => setSelectedSystem(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-3 border border-[#D4E0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#349552]"
                  disabled={myActiveSystems.length === 0}
                >
                  <option value="">{myActiveSystems.length === 0 ? "No active systems" : "Select a system..."}</option>
                  {myActiveSystems.map((s) => (
                    <option key={s.tokenId} value={s.tokenId}>
                      #{s.tokenId} - {Number(s.capacityWatts) / 1000} kW
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A3A2E] mb-2">
                  Energy Generated (kWh)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={kwhAmount}
                  onChange={(e) => setKwhAmount(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-3 border border-[#D4E0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#349552]"
                />
                <p className="text-xs text-[#6B7C75] mt-2">
                  Mints {kwhAmount || "0"} ECT to your wallet
                </p>
              </div>
              <button
                onClick={handleRecordGeneration}
                disabled={recording || selectedSystem === null || !kwhAmount}
                className="w-full py-3 bg-[#349552] text-white rounded-xl font-semibold hover:bg-[#266433] transition-colors disabled:opacity-50"
              >
                {recording ? "Claiming..." : "Claim ECT"}
              </button>
            </div>
          </div>
        </div>

        {/* Burn ECT (Consume Energy) */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D4E0D9] overflow-hidden">
          <div className="bg-[#F06838] px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Consume Energy</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A3A2E] mb-2">
                  Amount to Consume (ECT)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={burnAmount}
                  onChange={(e) => setBurnAmount(e.target.value)}
                  placeholder="50"
                  className="w-full px-4 py-3 border border-[#D4E0D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F06838]"
                />
                <p className="text-xs text-[#6B7C75] mt-2">
                  Burns {burnAmount || "0"} ECT from your wallet
                </p>
              </div>
              <div className="pt-[52px]">
                <button
                  onClick={handleBurnECT}
                  disabled={burning || !burnAmount}
                  className="w-full py-3 bg-[#F06838] text-white rounded-xl font-semibold hover:bg-[#d85a30] transition-colors disabled:opacity-50"
                >
                  {burning ? "Consuming..." : "Consume Energy"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* My Systems */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#D4E0D9] overflow-hidden">
          <div className="bg-[#349552] px-6 py-4">
            <h2 className="text-lg font-semibold text-white">My Systems</h2>
          </div>
          <div className="p-6">
            {loadingData ? (
              <p className="text-[#6B7C75] text-center py-8">Loading your systems...</p>
            ) : mySystems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#6B7C75]">You don&apos;t own any systems yet.</p>
                <p className="text-sm text-[#6B7C75] mt-2">Contact an admin to register your installation.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mySystems.map((system) => (
                  <div
                    key={system.tokenId}
                    className={`p-4 rounded-xl border ${
                      system.state === 0 ? "border-[#349552] bg-[#E6F2EA]" : "border-[#D4E0D9] bg-[#F5F7F6]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-[#1A3A2E]">System #{system.tokenId}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          system.state === 0
                            ? "bg-[#349552] text-white"
                            : system.state === 1
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                        }`}>
                          {SYSTEM_STATE[system.state as keyof typeof SYSTEM_STATE]}
                        </span>
                      </div>
                      <span className="text-sm text-[#6B7C75]">{Number(system.capacityWatts) / 1000} kW</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[#6B7C75]">Total Generated: </span>
                        <span className="font-semibold">{Number(system.totalGenerated)} kWh</span>
                      </div>
                      <div>
                        <span className="text-[#6B7C75]">Last Claim: </span>
                        <span>{formatTime(system.lastClaimTime)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
