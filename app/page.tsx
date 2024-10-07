"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { connection } from "@/lib/connect";
import { VersionedTransaction } from "@solana/web3.js";
import { getQuote, getSwapObj } from "@/lib/jup";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function Home() {
  const { connected, publicKey, signAllTransactions } = useWallet();

  const [showPopup, setShowPopup] = useState(true);

  const [selectedTokens, setSelectedTokens] = useState<
    { address: string; amount: string }[]
  >([]);

  const [tokens, setTokens] = useState<
    {
      data: {
        address: string;
        name: string;
        symbol: string;
        decimals: number;
        logoURI: string;
        tags: string[];
        extensions: {
          coingeckoId: string;
        };
      };
      amount: string;
    }[]
  >();
  const [fetchingTokens, setFetchingTokens] = useState<{
    status: boolean;
    error?: string;
  }>({ status: false });

  const [transactions, setTransactions] = useState<VersionedTransaction[]>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    async function getTokens() {
      if (!publicKey) return;
      try {
        setFetchingTokens({ status: true });
        const res = await fetch(`/api/tokens?address=${publicKey.toString()}`);
        const data = await res.json();
        setTokens(data);
      } catch (e) {
        console.error("Error fetching tokens:", e);
        setFetchingTokens({
          status: false,
          error: "error fetching the wallet tokens",
        });
      } finally {
        setFetchingTokens({ status: false });
      }
    }
    getTokens();
  }, [connected, publicKey]);

  const formatAmount = (amount: string, decimals: number) => {
    const num = parseInt(amount) / Math.pow(10, decimals);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  const toggleToken = (token: { address: string; amount: string }) => {
    console.log(selectedTokens);
    setSelectedTokens((prev) =>
      prev.some((t) => t.address === token.address)
        ? prev.filter((t) => t.address !== token.address)
        : [...prev, token]
    );
  };

  const handleConvert = async () => {
    await Promise.all(
      selectedTokens.map(async (token) => {
        const quote = await getQuote(token.address, parseInt(token.amount));
        const swap = await getSwapObj(publicKey?.toString()!, quote);
        const swapTransactionBuf = Buffer.from(swap.swapTransaction, "base64");
        const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        setTransactions((prev) => [...(prev || []), transaction]);
      })
    );
    setShowConfirmDialog(true);
  };

  const confirmConvert = async () => {
    if (signAllTransactions) {
      try {
        console.log(transactions);
        const signedTransactions = await signAllTransactions(transactions!);
        signedTransactions.map(async (tx) => {
          try {
            const signature = await connection.sendRawTransaction(
              tx.serialize()
            );
            console.log("https://explorer.solana.com/tx/" + signature);
          } catch (error) {
            console.error("Transaction failed:", error);
          }
        });
      } catch (error) {
        console.error("Signing transactions failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-2 border-gray-700 rounded-3xl overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Ore Coin Converter
            </h1>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600" />
              </div>
            </div>
          </div>

          <WalletMultiButton>
            {connected ? null : (
              <>
                <WalletIcon className="mr-2 h-5 w-5" /> Connect Wallet
              </>
            )}
          </WalletMultiButton>

          {connected && (
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-2xl p-4">
                <h2 className="text-lg font-semibold mb-2">
                  Select tokens to convert:
                </h2>
                {fetchingTokens.status ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full bg-gray-600" />
                    <Skeleton className="h-8 w-full bg-gray-600" />
                    <Skeleton className="h-8 w-full bg-gray-600" />
                  </div>
                ) : fetchingTokens.error ? (
                  <p className="text-red-500">{fetchingTokens.error}</p>
                ) : tokens && tokens.length > 0 ? (
                  tokens.map((token, index) => (
                    <div
                      key={token.data?.address || index}
                      className="flex justify-between items-center mb-2 p-2 rounded hover:bg-gray-600"
                    >
                      <span className="flex items-center flex-grow">
                        {token.data.logoURI && (
                          <img
                            src={token.data?.logoURI}
                            alt={token.data?.symbol}
                            className="w-6 h-6 mr-2"
                          />
                        )}
                        <div className="flex flex-col">
                          <div className="font-medium">
                            {token.data?.symbol}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatAmount(token.amount, token.data?.decimals)}{" "}
                            {token.data?.name}
                          </div>
                        </div>
                      </span>
                      <Switch
                        checked={selectedTokens.some(
                          (t) => t.address === token.data.address
                        )}
                        onCheckedChange={() =>
                          toggleToken({
                            address: token.data.address,
                            amount: token.amount,
                          })
                        }
                        disabled={parseFloat(token.amount) === 0}
                      />
                    </div>
                  ))
                ) : (
                  <p>No tokens found in your wallet.</p>
                )}
              </div>

              <div className="bg-gray-700 rounded-2xl p-4 space-y-2">
                <h2 className="text-lg font-semibold">Summary:</h2>
                <div className="flex justify-between items-center">
                  <span>Selected Tokens:</span>
                  <span>{selectedTokens.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Amount:</span>
                  <span>
                    {selectedTokens.reduce(
                      (acc, token) =>
                        acc + parseFloat(token.amount) / Math.pow(10, 6),
                      0
                    )}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 font-bold py-3 rounded-full transition-transform hover:scale-105 disabled:opacity-50"
                onClick={handleConvert}
                disabled={selectedTokens.length === 0}
              >
                Convert to Ore
              </Button>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-400">
            <h2 className="text-lg font-semibold text-white mb-2">
              ORE Scooper
            </h2>
            <p className="mb-4">
              Airdrops and adverts clutter your wallet. This tool allows you to
              quickly Scoop all your unwanted assets into $ORE via Jupiter
              swaps.
            </p>

            <p className="mb-4">
              <strong>How it works:</strong>
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Wait for assets to load</li>
              <li>Select assets for Scooping</li>
              <li>Review summary</li>
              <li>Scooper scoops</li>
            </ul>
          </div>
        </div>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Conversion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h3 className="text-lg font-medium mb-2">
              Selected tokens to convert:
            </h3>
            <ul className="space-y-2">
              {selectedTokens.map((selectedToken) => {
                const token = tokens?.find(
                  (t) => t.data.address === selectedToken.address
                );
                return (
                  <li key={selectedToken.address} className="flex items-center">
                    {token?.data.logoURI && (
                      <img
                        src={token.data.logoURI}
                        alt={token.data.symbol}
                        className="w-6 h-6 mr-2"
                      />
                    )}
                    <span>{token?.data.symbol || "Unknown"}</span>
                    <span className="ml-2">
                      {formatAmount(
                        selectedToken.amount,
                        token?.data.decimals || 0
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowConfirmDialog(false)}
              variant="outline"
              className="text-black"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={confirmConvert}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="bg-gray-800 text-white border-2 border-gray-700">
          <DialogHeader>
            <DialogTitle>Important Notice</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-300">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                The ore scooper tool is used to facilitate the irreversible
                burning of your tokens.
              </li>
              <li>By using this site, you are doing so at your own risk.</li>
              <li>
                By using the platform you explicitly accept full responsibility
                for any and all swaps. The ore-scooper platform additionally
                does not assume liability for any mistakes, accidents,
                miss-intentions or any other actions that led to an undesired
                burn.
              </li>
            </ol>
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => setShowPopup(false)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900"
            >
              Agree and Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
