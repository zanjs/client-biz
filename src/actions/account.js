export const loginAction = (user, token) => {
  return {
    type: 'LOGIN',
    user,
    token,
  }
};