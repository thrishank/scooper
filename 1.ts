import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from "@solana/web3.js";
const connection = new Connection(clusterApiUrl("devnet"));
const addr = new PublicKey("ADmMCv4Xj3iHAsAWfRshRqVXW2DKWqpt4xh2oeeViwu1");

const filters: GetProgramAccountsFilter[] = [
  {
    dataSize: 165, //size of account (bytes)
  },
  {
    memcmp: {
      offset: 32, //location of our query in the account (bytes)
      bytes: addr.toString(), //our search criteria, a base58 encoded string
    },
  },
];

() => {
  const token = connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: filters,
  });
  console.log("token", token);
};
