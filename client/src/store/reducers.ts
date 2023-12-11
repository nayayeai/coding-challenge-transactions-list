import { Actions } from "../types";

// Define the state type
export interface RootState {
  transactions: any[];
  isSendingModalOpen?: boolean;
}

// Initial state
const initialState: RootState = {
  transactions: [],
  isSendingModalOpen: false,
};

const reducer = (state = initialState, action: any): RootState => {
  switch (action.type) {
    case Actions.ToggleSendModal:
      return {
        ...state,
        isSendingModalOpen: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
