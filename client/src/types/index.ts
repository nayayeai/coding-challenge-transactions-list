export interface Transaction {
  gasLimit: string;
  gasPrice: string;
  to: string;
  from: string;
  value: string;
  data?: string;
  chainId: string;
  hash: string;
}

export interface TransactionsData {
  getAllTransactions: Transaction[];
}

export interface SingleTransactionData {
  getTransaction: Transaction;
}

export type Action<P> = {
  type: Actions,
  payload: P,
};

export enum Actions {
  SendTransaction = 'SEND_TRANSACTION',
  ToggleSendModal = 'TOGGLE_SEND_MODAL',
};

export interface ISendTransactionAction {
  type: typeof Actions.SendTransaction;
  payload: {
    recipient: string;
    amount: string;
  };
}
