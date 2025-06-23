import { ReduxUserState } from '@/interfaces/reduxUserState';

export interface ReduxAuthState {
  user: ReduxUserState | null;
  token: string | null;
}
