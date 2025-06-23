import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxAuthState, ReduxUserState } from '@/interfaces';

const initialState: ReduxAuthState = {
  user: null,
  token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setReduxAuthToken: (state, action: PayloadAction<ReduxUserState>) => {
      state.user = {
        userId: action.payload.userId,
        username: action.payload.username ?? undefined,
        // email: action.payload.email ?? undefined,
        // role: action.payload.role ?? 1,
      };
      state.token = action.payload.accessToken ?? '';
    },
    removeReduxAuthToken: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setReduxAuthToken, removeReduxAuthToken } = authSlice.actions;
export default authSlice.reducer;
