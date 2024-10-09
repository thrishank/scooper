"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Loader2, WalletIcon, X } from "lucide-react";
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
import How from "@/components/home/how";
import Terms from "@/components/home/pop-up";
import { Token } from "@/lib/types/token";
import { formatAmount } from "@/lib/types/fn";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const { connected, publicKey, signAllTransactions } = useWallet();
  const [showPopup, setShowPopup] = useState(true);
  const [selectedTokens, setSelectedTokens] = useState<
    { address: string; amount: string }[]
  >([]);
  const [tokens, setTokens] = useState<Token[]>();
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
        toast.error("Error fetching tokens");
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

  const toggleToken = (token: { address: string; amount: string }) => {
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
        const transaction =
          VersionedTransaction.deserialize(swapTransactionBuf);
        setTransactions((prev) => [...(prev || []), transaction]);
      })
    );
    setShowConfirmDialog(true);
  };

  const confirmConvert = async () => {
    if (signAllTransactions) {
      try {
        const signedTransactions = await signAllTransactions(transactions!);
        signedTransactions.map(async (tx) => {
          try {
            const signature = await connection.sendRawTransaction(
              tx.serialize()
            );
            toast.success(`Transaction sent: ${signature}`);
          } catch (error) {
            toast.error("Transaction failed");
            console.error("Transaction failed:", error);
          }
        });
      } catch (error) {
        console.error("Signing transactions failed:", error);
        toast.error("Failed to get the swap transaction via Jupiter");
      }
    }
    setShowConfirmDialog(false);
  };

  return (
    <div
      className="min-h-screen text-white flex items-center justify-center p-4"
      style={{ backgroundImage: "url(/rock-1-desktop.webp)" }}
    >
      <Card className="w-full max-w-md bg-gray-800 border-2 border-gray-700 rounded-3xl overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Sweep ORE
            </h1>
            <img
              src="/image.png"
              alt="Ore Coin Converter Logo"
              className="w-8 h-8 ml-2"
            />
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

              <Button
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 font-bold py-3 rounded-full transition-transform hover:scale-105 disabled:opacity-50"
                onClick={handleConvert}
                disabled={selectedTokens.length === 0}
              >
                Convert to Ore
              </Button>
            </div>
          )}
          <How />
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
              className="text-black p-4"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <div className="p-2"></div>
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
          <Terms />
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

      <ToastContainer position="bottom-right" />
    </div>
  );
}
