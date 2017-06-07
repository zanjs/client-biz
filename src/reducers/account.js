const userData = JSON.parse(localStorage.getItem('bizUser')) || {};

const defaultState = {
  currentUser: userData.user || {},
  token: userData.token,
};

export const account = (state = defaultState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        currentUser: {...state.currentUser, ...action.user},
        token: action.token,
      };
    default: return state;
  }
};