const userData = JSON.parse(localStorage.getItem('bizUser')) || {};

const defaultState = {
  account: userData.account || {},
  currentUser: null,
  token: userData.token,
};

export const account = (state = defaultState, action) => {
  switch (action.type) {
    case 'LOGIN':
      const current = state.currentUser || {};
      return {
        currentUser: {...current, ...action.user},
        token: action.token,
      };
    case 'LOGOUT':
      return {
        currentUser: null,
        token: null,
      };
    default: return state;
  }
};