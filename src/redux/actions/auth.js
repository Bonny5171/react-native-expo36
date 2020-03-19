import { LOGIN, LOGOUT } from './types';

export const login = user => {
  console.log('ACTION >>>>>', user);
  return ({
    type: LOGIN,
    user
  });
};

export const logout = () => ({
  type: LOGOUT
});
