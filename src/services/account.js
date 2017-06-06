const login = async (username, password) => {
  return {success: true, user: {id: 'mockId'}, token: 'mockToken'};
};

export const loginService = {
  login,
};