import {combineReducers, createStore} from 'redux';
import {account} from "./account";

const AppStore = combineReducers({
  account,
});
const store = createStore(AppStore);
export default store;