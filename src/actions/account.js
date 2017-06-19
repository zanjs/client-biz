export const loginAction = (user, token, account) => {
  return {
    type: 'LOGIN',
    user,
    token,
    account,
  }
};

export const logout = () => ({ type: 'LOGOUT' });

export const updateUser = user => {
  return {
    type: 'UPDATE_USER',
    user,
  }
};