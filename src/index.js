import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';

import { Provider } from 'react-redux';
import { routerMiddleware } from 'react-router-redux'
import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';

import RootReducer from './store';
import App from './App';
import LoginHandler from './pages/login/LoginHandler';
import combinedEpics from './pages/actions';
import {DIRECTION_ASC, SORT_OPTIONS} from './pages/home/actions';

import * as serviceWorker from './serviceWorker';


const INITIAL_STATE = {
    loginReducer: {
        user: null
    },
    movieReducer: {
        loading: false,
        comments: [],
        requestConfig: {
            size: 5, //Page size
            direction: DIRECTION_ASC, //Sort direction
            sort: SORT_OPTIONS[0],
    }
    }
};
const history = createBrowserHistory();
const epicMiddleware = createEpicMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [
    epicMiddleware,
    routerMiddleware(history),
    thunk
];

const store = createStore(
    RootReducer,
    INITIAL_STATE,
    composeEnhancers(
        applyMiddleware(...middleware)
        ));
epicMiddleware.run(combinedEpics)


ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <div>
                <Route exact path='/' component={App}>
                </Route>
                <Route path="/loginpage" component={LoginHandler} />
            </div>
        </Router>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();