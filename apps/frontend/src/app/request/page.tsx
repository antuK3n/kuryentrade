"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/lib/Web3Context";
import { ethers } from "ethers";

interface Request {
  id: bigint;
  requester: string;
  amountECT: bigint;
  pricePerECT: bigint;
  createdAt: bigint;
  fulfilledAt: bigint;
  fulfilledBy: string;
  status: number;
}

// Generate mock user names based on address
const getUserName = (address: string, index: number): string => {
  const names = ["USER A", "USER B", "USER C", "USER D", "USER E", "USER F", "USER G"];
  return names[index % names.length];
};

export default function ViewRequests() {
  const { account, requestBoard, energyToken, refreshBalances } = useWeb3();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [fulfilling, setFulfilling] = useState<bigint | null>(null);

  const loadRequests = async () => {
    if (!requestBoard) return;

    setLoading(true);
    try {
      const openRequests = await requestBoard.getOpenRequests(0, 50);
      setRequests(openRequests);
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [requestBoard]);

  const handleFulfill = async (request: Request) => {
    if (!requestBoard || !energyToken || !account) return;

    setFulfilling(request.id);
    try {
      // Check allowance
      const allowance = await energyToken.allowance(account, await requestBoard.getAddress());
      if (allowance < request.amountECT) {
        // Approve tokens
        const approveTx = await energyToken.approve(
          await requestBoard.getAddress(),
          request.amountECT
        );
        await approveTx.wait();
      }

      // Fulfill request
      const tx = await requestBoard.fulfillRequest(request.id);
      await tx.wait();

      await refreshBalances();
      await loadRequests();
    } catch (error: unknown) {
      console.error("Error fulfilling request:", error);
      const err = error as { reason?: string; message?: string };
      alert(`Failed to fulfill request: ${err.reason || err.message || "Unknown error"}`);
    } finally {
      setFulfilling(null);
    }
  };

  if (!account) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#E6F2EA] rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-[#349552]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1A3A2E] mb-2">Connect Your Wallet</h2>
          <p className="text-[#6B7C75]">Connect your wallet to view and fulfill ETC requests.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Community Request Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#D4E0D9] overflow-hidden">
        {/* Header */}
        <div className="bg-[#349552] px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Community Request</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="py-12 text-center text-[#6B7C75]">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F7F6] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#6B7C75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-[#6B7C75]">No open requests found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request, index) => {
                const amountECT = ethers.formatEther(request.amountECT);
                const isOwnRequest = account?.toLowerCase() === request.requester.toLowerCase();
                const userName = isOwnRequest ? "YOU" : getUserName(request.requester, index);

                return (
                  <div
                    key={request.id.toString()}
                    className="flex items-center justify-between gap-4"
                  >
                    {/* Request Info */}
                    <div className="flex-1 px-6 py-4 bg-[#F5F7F6] rounded-xl">
                      <span className="text-[#349552] font-medium">
                        {userName} - {parseFloat(amountECT).toFixed(0)} ETC
                      </span>
                    </div>

                    {/* Fulfill Button - show for other users' open requests */}
                    {!isOwnRequest ? (
                      <button
                        onClick={() => handleFulfill(request)}
                        disabled={fulfilling === request.id}
                        className="px-6 py-4 bg-[#349552] text-white rounded-xl font-semibold hover:bg-[#266433] transition-colors disabled:opacity-50 min-w-[160px]"
                      >
                        {fulfilling === request.id ? "Fulfilling..." : "Fulfill Request"}
                      </button>
                    ) : (
                      <div className="px-6 py-4 bg-[#E6F2EA] text-[#349552] rounded-xl font-medium min-w-[160px] text-center">
                        Your Request
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
