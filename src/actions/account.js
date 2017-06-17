export const loginAction = (user, token) => {
  return {
    type: 'LOGIN',
    user,
    token,
  }
};

export const logout = () => ({ type: 'LOGOUT' });