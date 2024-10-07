import { Connection } from "@solana/web3.js";
// import {clusterApiUrl} from "@solana/web3.js"
// const url = clusterApiUrl("mainnet-beta");
// const url = clusterApiUrl("devnet");
// const url =
//   "https://mainnet.helius-rpc.com/?api-key=20475b23-b7f2-46be-badc-ad4f62baf079";
const url =
  "https://young-convincing-patron.solana-mainnet.quiknode.pro/111587d089e640efa1df6f92fa50d3796756a665";
export const connection = new Connection(url, {
  commitment: "confirmed",
});
