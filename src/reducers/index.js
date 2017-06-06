import {combineReducers} from 'redux';
import {account} from "./account";

const AppStore = combineReducers({
  account,
});

export default AppStore;