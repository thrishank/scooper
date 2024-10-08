export const formatAmount = (amount: string, decimals: number) => {
  const num = parseInt(amount) / Math.pow(10, decimals);
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
};
