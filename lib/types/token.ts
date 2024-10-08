interface TokenData {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  tags: string[];
  extensions: {
    coingeckoId: string;
  };
}

export interface Token {
  data: TokenData;
  amount: string;
}
