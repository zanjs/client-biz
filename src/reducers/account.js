const defaultState = {
  currentUser: {},
  token: null,
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