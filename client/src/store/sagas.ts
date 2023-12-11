import { takeEvery, put } from 'redux-saga/effects';
import { Transaction, TransactionResponse, TransactionReceipt, BrowserProvider, Signer } from 'ethers';

import apolloClient from '../apollo/client';
import { Actions, ISendTransactionAction } from '../types';
import { SaveTransaction } from '../queries';
import { navigate } from '../components/NaiveRouter';
import { parseUnits } from "ethers";

function* sendTransaction(action: ISendTransactionAction) {
  const { recipient, amount } = action.payload;
  const amountInWei = parseUnits(amount, "ether");

  // this could have been passed along in a more elegant fashion,
  // but for the purpouses of this scenario it's good enough
  // @ts-ignore
  const walletProvider = new BrowserProvider(window.web3.currentProvider);

  const signer: Signer = yield walletProvider.getSigner();

  const transaction = {
    to: recipient,
    value: amountInWei,
  };

  try {
    const txResponse: TransactionResponse = yield signer.sendTransaction(transaction);
    const response: TransactionReceipt = yield txResponse.wait();

    const receipt: Transaction = yield response.getTransaction();

    const variables = {
      transaction: {
        gasLimit: (receipt.gasLimit && receipt.gasLimit.toString()) || '0',
        gasPrice: (receipt.gasPrice && receipt.gasPrice.toString())|| '0',
        to: receipt.to,
        from: receipt.from,
        value: (receipt.value && receipt.value.toString()) || '',
        data: receipt.data || null,
        chainId: (receipt.chainId && receipt.chainId.toString()) || '123456',
        hash: receipt.hash,
      }
    };

    yield apolloClient.mutate({
      mutation: SaveTransaction,
      variables,
    });

    // Close the modal
    yield put({ type: Actions.ToggleSendModal, payload: false });

    // Navigate to the transaction details page
    navigate('/transaction/' + receipt.hash);

  } catch (error) {
    //
  }

}

export function* rootSaga() {
  yield takeEvery(Actions.SendTransaction, sendTransaction);
}
