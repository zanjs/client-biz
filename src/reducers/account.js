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
      const data = {user: null, token: null, account: state.account};
      localStorage.setItem('bizUser', JSON.stringify(data));
      return {
        currentUser: null,
        token: null,
        account: state.account,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        currentUser: {...current, ...action.user}
      };
    default: return state;
  }
};