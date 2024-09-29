"use client";
import { Hero } from "@/components/Hero";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AnimatePresence } from "framer-motion";
import { WalletIcon } from "lucide-react";

export default function Home() {
  const { connected } = useWallet();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <header className="flex justify-between items-center mb-8 pb-8">
          <h1 className="text-2xl font-bold text-gray-800">SOLANA SCOOPER</h1>

          <WalletMultiButton className="bg-blue-500 hover:bg-blue-600 text-white text-lg py-6 px-8">
            {connected ? null : (
              <>
                <WalletIcon className="mr-2 h-5 w-5" /> Connect Wallet
              </>
            )}
          </WalletMultiButton>
        </header>

        <AnimatePresence mode="wait">
          {!connected ? <Hero /> : <div></div>}
        </AnimatePresence>
      </div>
    </div>
  );
}
