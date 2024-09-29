"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  WalletIcon,
  ArrowRightIcon,
  Loader2Icon,
  ShieldCheckIcon,
  ZapIcon,
  RefreshCwIcon,
} from "lucide-react";

// Mock data for demonstration
const mockAssets = [
  { symbol: "BTC", name: "Bitcoin", balance: 0.5 },
  { symbol: "ETH", name: "Ethereum", balance: 2.3 },
  { symbol: "USDT", name: "Tether", balance: 1000 },
  { symbol: "XRP", name: "Ripple", balance: 500 },
];

const mockConversionRates = {
  BTC: 30000,
  ETH: 2000,
  USDT: 1,
  XRP: 0.5,
};

export function CryptoConverterComponent() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [conversionCurrency, setConversionCurrency] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const handleWalletConnect = () => {
    // Simulating wallet connection
    setWalletConnected(true);
    setWalletAddress("0x1234...5678");
  };

  const handleAssetToggle = (symbol: string) => {
    setSelectedAssets((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  const calculateTotalValue = () => {
    return selectedAssets.reduce((total, symbol) => {
      const asset = mockAssets.find((a) => a.symbol === symbol);
      return total + (asset ? asset.balance * mockConversionRates[symbol] : 0);
    }, 0);
  };

  const handleConvert = () => {
    setIsConverting(true);
    // Simulating conversion process
    setTimeout(() => {
      setIsConverting(false);
      // Reset selections after conversion
      setSelectedAssets([]);
      setConversionCurrency("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Crypto Converter</h1>
          {walletConnected && (
            <div className="text-sm text-gray-600">Wallet: {walletAddress}</div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {!walletConnected ? (
            <motion.div
              key="homepage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <section className="text-center space-y-6 mb-12">
                <h2 className="text-4xl font-bold text-gray-900">
                  Easily convert your unwanted crypto assets into the currency
                  of your choice.
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Select your assets, choose a target coin, and let us handle
                  the conversion with real-time rates.
                </p>
                <Button
                  onClick={handleWalletConnect}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-lg py-6 px-8"
                >
                  <WalletIcon className="mr-2 h-5 w-5" /> Connect Wallet
                </Button>
              </section>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="flex flex-col items-center text-center">
                  <ShieldCheckIcon className="h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Secure Transactions
                  </h3>
                  <p className="text-gray-600">
                    Your assets are protected with industry-leading security
                    measures.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <ZapIcon className="h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Fast Conversions
                  </h3>
                  <p className="text-gray-600">
                    Experience lightning-fast crypto conversions with our
                    optimized platform.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RefreshCwIcon className="h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Real-time Rates
                  </h3>
                  <p className="text-gray-600">
                    Get the most up-to-date conversion rates for accurate
                    transactions.
                  </p>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="converter"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {mockAssets.map((asset) => (
                  <Card key={asset.symbol} className="overflow-hidden">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{asset.symbol}</h3>
                        <p className="text-sm text-gray-500">{asset.name}</p>
                        <p className="text-sm">
                          {asset.balance} {asset.symbol}
                        </p>
                      </div>
                      <Checkbox
                        checked={selectedAssets.includes(asset.symbol)}
                        onCheckedChange={() => handleAssetToggle(asset.symbol)}
                      />
                    </CardContent>
                  </Card>
                ))}
              </section>

              <section className="flex flex-col items-center space-y-4 mb-8">
                <Select
                  onValueChange={setConversionCurrency}
                  value={conversionCurrency}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Convert to..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAssets.map((asset) => (
                      <SelectItem key={asset.symbol} value={asset.symbol}>
                        {asset.name} ({asset.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedAssets.length > 0 && conversionCurrency && (
                  <div className="text-center">
                    <p className="text-lg font-semibold">
                      Estimated Value: {calculateTotalValue().toFixed(2)} USD
                    </p>
                    <p className="text-sm text-gray-500">
                      (Based on current market rates)
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleConvert}
                  disabled={
                    selectedAssets.length === 0 ||
                    !conversionCurrency ||
                    isConverting
                  }
                  className="w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isConverting ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Converting...
                    </>
                  ) : (
                    <>
                      Convert <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <a href="#" className="text-sm text-blue-500 hover:underline">
                  View Transaction History
                </a>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <nav className="space-x-4">
            <a href="#" className="hover:underline">
              About Us
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </nav>
          <p className="mt-2">
            &copy; 2023 Crypto Converter. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
