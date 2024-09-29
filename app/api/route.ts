import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const addr = new PublicKey("VTwKNtmXi4TQCLZraksAkasMAJmgLgjVT6txUc4mjxN");

export function GET() {
  (async () => {
    const tokenAccounts = await connection.getTokenAccountsByOwner(addr, {
      programId: TOKEN_PROGRAM_ID,
    });

    const tokens: Array<{
      mintAddress: string;
      amount: string;
    }> = [];
    for (const tokenAccountInfo of tokenAccounts.value) {
      const accountData = AccountLayout.decode(tokenAccountInfo.account.data);

      const mintAddress = new PublicKey(accountData.mint).toString();
      const amount = accountData.amount;

      // Fetch the mint info to get the decimal places for the token
      const mintInfo = await connection.getParsedAccountInfo(
        new PublicKey(accountData.mint)
      );

      if (mintInfo.value && "parsed" in mintInfo.value.data) {
        const decimals = mintInfo.value.data["parsed"].info.decimals;

        // Exclude tokens with decimals == 0 and amount == 1 (indicative of NFTs)
        if (!(decimals === 0 && amount === BigInt(1))) {
          tokens.push({
            mintAddress,
            amount: amount.toString(),
          });
        }
      }
    }

    console.log(tokens);
  })();

  return Response.json({ message: "Hello World!" });
}
