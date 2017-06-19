const userData = JSON.parse(localStorage.getItem('bizUser')) || {};

const defaultState = {
  account: userData.account || {},
  currentUser: userData.user,
  token: userData.token,
};

export const account = (state = defaultState, action) => {
  const current = state.currentUser || {};
  switch (action.type) {
    case 'LOGIN':
      return {
        currentUser: {...current, ...action.user},
        account: userData.account,
        token: action.token,
      };
    case 'LOGOUT':
      return {
        currentUser: null,
        token: null,
      };
    case 'UPDATE_USER':
      return {
        currentUser: {...current, ...action.user}
      };
    default: return state;
  }
};