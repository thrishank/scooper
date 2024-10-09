# ORE Scooper

Solana web3 dapp that allows users to clean shit tokens out of their wallet and convert it all to ORE

## Installation

1. Clone the repository:

```
git clone https://github.com/thrishank/ore-scooper
cd ore-scooper
```

2. Install dependencies:

```bash
pnpm install
```

## Key Components

- /page.tsx which is home page contains most of the logic since this is a single page application
- api/tokens to fetch the tokens in the user wallets
- lib/jup.ts api call to the Jupiter api to get the swap transaction

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Solana Web3.js
- Jupiter swap API
