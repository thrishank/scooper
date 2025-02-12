import { Connection } from "@solana/web3.js";

const url = process.env.RPC_URL!;
export const connection = new Connection(url, {
  commitment: "confirmed",
});
