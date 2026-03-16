"use client";

import { useState } from "react";
import { useWeb3 } from "@/lib/Web3Context";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";

export default function SendRequest() {
  const { account, balance, requestBoard, refreshBalances } = useWeb3();
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fixed price for simplicity in this design
  const pricePerECT = "0.001"; // 0.001 ETH per ETC

  const totalPrice = amount
    ? (parseFloat(amount) * parseFloat(pricePerECT)).toFixed(6)
    : "0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestBoard || !amount) return;

    setSubmitting(true);
    try {
      const amountWei = ethers.parseEther(amount);
      const priceWei = ethers.parseEther(pricePerECT);
      const totalPriceWei = (amountWei * priceWei) / BigInt(1e18);

      const tx = await requestBoard.createRequest(amountWei, priceWei, {
        value: totalPriceWei,
      });
      await tx.wait();

      await refreshBalances();
      router.push("/request");
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Failed to create request");
    } finally {
      setSubmitting(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#E6F2EA] rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-[#349552]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1A3A2E] mb-2">Connect Your Wallet</h2>
          <p className="text-[#6B7C75]">Connect your wallet to create an ETC request.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Request ETC Card */}
      <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-[#D4E0D9] overflow-hidden">
        {/* Header */}
        <div className="bg-[#349552] px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Request ETC</h2>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-bold text-[#349552] mb-3 uppercase tracking-wide">
                Amount (ETC)
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="type here"
                className="w-full max-w-md px-4 py-3 border border-[#D4E0D9] rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-[#349552] focus:border-transparent placeholder:text-[#A0AEA7]"
                required
              />
            </div>

            {/* Reason Text Box */}
            <div>
              <label className="block text-sm font-bold text-[#349552] mb-3 uppercase tracking-wide">
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="type here"
                rows={3}
                className="w-full max-w-md px-4 py-3 border border-[#D4E0D9] rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-[#349552] focus:border-transparent placeholder:text-[#A0AEA7] resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting || !amount || parseFloat(totalPrice) > parseFloat(balance)}
                className="px-8 py-3 bg-[#349552] text-white rounded-full font-semibold text-lg hover:bg-[#266433] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>

            {/* Balance Info (subtle) */}
            {parseFloat(totalPrice) > parseFloat(balance) && (
              <p className="text-sm text-red-500">
                Insufficient ETH balance. Need {totalPrice} ETH.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
