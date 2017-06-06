export const login = (user, token) => {
  return {
    type: 'LOGIN',
    user,
    token,
  }
};