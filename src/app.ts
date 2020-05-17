import { getUserInfo } from 'services/auth';

export async function getInitialState() {
  const state: { [key: string]: any } = {};
  const user = await getUserInfo();
  state.user = user;
  return state;
}
