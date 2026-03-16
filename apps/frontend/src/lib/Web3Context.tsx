"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";
import {
  CONTRACT_ADDRESSES,
  ENERGY_TOKEN_ABI,
  KURYENTRADE_SYSTEM_NFT_ABI,
  ECT_REQUEST_BOARD_ABI,
  NETWORK_CONFIG,
} from "./contracts";

interface Web3ContextType {
  account: string | null;
  balance: string;
  ectBalance: string;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  provider: BrowserProvider | null;
  energyToken: Contract | null;
  kuryenTradeSystemNFT: Contract | null;
  requestBoard: Contract | null;
  refreshBalances: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState("0");
  const [ectBalance, setEctBalance] = useState("0");
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [energyToken, setEnergyToken] = useState<Contract | null>(null);
  const [kuryenTradeSystemNFT, setKuryenTradeSystemNFT] = useState<Contract | null>(null);
  const [requestBoard, setRequestBoard] = useState<Contract | null>(null);

  const refreshBalances = async () => {
    if (!provider || !account) return;

    try {
      const ethBalance = await provider.getBalance(account);
      setBalance(ethers.formatEther(ethBalance));

      if (energyToken) {
        const ectBal = await energyToken.balanceOf(account);
        setEctBalance(ethers.formatEther(ectBal));
      }
    } catch (error) {
      console.error("Error refreshing balances:", error);
    }
  };

  const connect = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask to use this app");
      return;
    }

    setIsConnecting(true);

    try {
      const browserProvider = new BrowserProvider(window.ethereum);

      // Check if we're on the correct network
      const network = await browserProvider.getNetwork();
      if (Number(network.chainId) !== NETWORK_CONFIG.chainId) {
        try {
          // Try to switch to Hardhat network
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}` }],
          });
        } catch (switchError: unknown) {
          // If the network doesn't exist, add it
          const error = switchError as { code: number };
          if (error.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}`,
                chainName: NETWORK_CONFIG.chainName,
                rpcUrls: [NETWORK_CONFIG.rpcUrl],
                nativeCurrency: NETWORK_CONFIG.nativeCurrency,
              }],
            });
          } else {
            throw switchError;
          }
        }
      }

      const accounts = await browserProvider.send("eth_requestAccounts", []);
      const signer = await browserProvider.getSigner();

      setProvider(browserProvider);
      setAccount(accounts[0]);

      // Initialize contracts
      const ect = new Contract(
        CONTRACT_ADDRESSES.energyToken,
        ENERGY_TOKEN_ABI,
        signer
      );
      const nft = new Contract(
        CONTRACT_ADDRESSES.kuryenTradeSystemNFT,
        KURYENTRADE_SYSTEM_NFT_ABI,
        signer
      );
      const board = new Contract(
        CONTRACT_ADDRESSES.ectRequestBoard,
        ECT_REQUEST_BOARD_ABI,
        signer
      );

      setEnergyToken(ect);
      setKuryenTradeSystemNFT(nft);
      setRequestBoard(board);

      // Get balances
      const ethBalance = await browserProvider.getBalance(accounts[0]);
      setBalance(ethers.formatEther(ethBalance));

      const ectBal = await ect.balanceOf(accounts[0]);
      setEctBalance(ethers.formatEther(ectBal));
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setBalance("0");
    setEctBalance("0");
    setProvider(null);
    setEnergyToken(null);
    setKuryenTradeSystemNFT(null);
    setRequestBoard(null);
  };

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: unknown) => {
        const accs = accounts as string[];
        if (accs.length === 0) {
          disconnect();
        } else {
          setAccount(accs[0]);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum?.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        balance,
        ectBalance,
        isConnecting,
        connect,
        disconnect,
        provider,
        energyToken,
        kuryenTradeSystemNFT,
        requestBoard,
        refreshBalances,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}
