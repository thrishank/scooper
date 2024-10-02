"use client";
import { connection } from "@/lib/connect";
import { getQuote, getSwapObj } from "@/lib/jup";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  VersionedTransaction,
  SystemProgram,
  PublicKey,
  Transaction,
} from "@solana/web3.js";

export default function Page() {
  const { publicKey, signAllTransactions, sendTransaction } = useWallet();

  const testtransfer = async () => {
    const instruction = SystemProgram.transfer({
      fromPubkey: publicKey!,
      toPubkey: new PublicKey("EXBdeRCdiNChKyD7akt64n9HgSXEpUtpPEhmbnm4L6iH"),
      lamports: 1000000,
    });

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: publicKey!,
      blockhash,
      lastValidBlockHeight,
    });

    transaction.add(instruction);

    const send = await sendTransaction(transaction, connection);
    const sign = await connection.confirmTransaction(send, "confirmed");
    console.log("Transaction confirmed", sign);
  };

  const ignore = [
    "mSOL",
    "JitoSOL",
    "bSOL",
    "mrgnLST",
    "jSOL",
    "stSOL",
    "scnSOL",
    "LST",
    "USDC",
    "USDT",
  ];

  const updatedOnClick = async () => {
    try {
      const quote1 = await getQuote(
        "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        1000000
      );
      const swap1 = await getSwapObj(publicKey?.toString()!, quote1);
      const swapTransactionBuf = Buffer.from(swap1.swapTransaction, "base64");
      var transaction1 = VersionedTransaction.deserialize(swapTransactionBuf);

      const quote2 = await getQuote(
        "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        100000000
      );
      const swap2 = await getSwapObj(publicKey?.toString()!, quote2);
      const swapTransactionBuf2 = Buffer.from(swap2.swapTransaction, "base64");
      const transaction2 =
        VersionedTransaction.deserialize(swapTransactionBuf2);

      if (signAllTransactions) {
        const allTx = [transaction1, transaction2];
        const signedTransactions = await signAllTransactions(allTx);

        signedTransactions.map(async (tx, i) => {
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
