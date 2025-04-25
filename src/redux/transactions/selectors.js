export const selectBalance = state => state.transactions.balance;
// -----------------------------------------------------------------
export const selectMonoBank = state => state.monoBank.items;
export const selectIsLoading = state => state.monoBank.isLoading;
export const selectError = state => state.monoBank.error;
// -----------------------------------------------------------------

export const selectisLoading = state =>
  state.transactions.isLoading || state.monoBank.isLoading;
