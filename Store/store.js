import thunk from 'redux-thunk';
import loginReducer from '../Reducer/reducer';
import { combineReducers,createStore,applyMiddleware } from 'redux';
const AppReducers = combineReducers ({
 login: loginReducer,
});

const rootReducer = (state, action) => {
  return AppReducers(state, action);
}
const store = createStore(rootReducer, applyMiddleware(thunk));


export default store;