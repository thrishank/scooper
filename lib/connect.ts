import { Connection } from "@solana/web3.js";

// const url = process.env.RPC_URL!;
const url =
  "https://mainnet.helius-rpc.com/?api-key=20475b23-b7f2-46be-badc-ad4f62baf079";
export const connection = new Connection(url, {
  commitment: "confirmed",
});
