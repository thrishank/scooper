import { Connection } from "@solana/web3.js";

const url =
  "https://young-convincing-patron.solana-mainnet.quiknode.pro/111587d089e640efa1df6f92fa50d3796756a665";
export const connection = new Connection(url, {
  commitment: "confirmed",
});
