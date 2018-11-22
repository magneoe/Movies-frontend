import {combineReducers} from 'redux';
import {routerReducer } from 'react-router-redux';

import {movieReducer} from './pages/home/actions';
import {loginReducer} from './pages/login/actions';

/*
 * Configures the store with reducers
 */
const RootReducer = combineReducers({
    routing: routerReducer,
    movieReducer,
    loginReducer
  });

  export default RootReducer;