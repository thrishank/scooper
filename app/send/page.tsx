"use client";
import { connection } from "@/lib/connect";
import { getQuote, getSwapObj } from "@/lib/jup";
import { useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";

export default function Page() {
  const { publicKey, signAllTransactions, sendTransaction } = useWallet();

  const updatedOnClick = async () => {
    try {
      const quote1 = await getQuote(
        "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
        1000000
      );
      const swap1 = await getSwapObj(publicKey?.toString()!, quote1);
      const swapTransactionBuf = Buffer.from(swap1.swapTransaction, "base64");
      const transaction1 = VersionedTransaction.deserialize(swapTransactionBuf);

      const quote2 = await getQuote(
        "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
        100000000
      );
      const swap2 = await getSwapObj(publicKey?.toString()!, quote2);
      const swapTransactionBuf2 = Buffer.from(swap2.swapTransaction, "base64");
      const transaction2 =
        VersionedTransaction.deserialize(swapTransactionBuf2);

      if (signAllTransactions) {
        const allTx = [transaction1, transaction2];
        const signedTransactions = await signAllTransactions(allTx);

        signedTransactions.map(async (tx) => {
          const signature = await connection.sendRawTransaction(tx.serialize());
          console.log("https://explorer.solana.com/tx/" + signature);
        });
      }
    } catch (error) {
      console.error("Error in updatedOnClick", error);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <button onClick={updatedOnClick} className="border blue p-4">
        SWAP SOL
      </button>
    </div>
  );
}
