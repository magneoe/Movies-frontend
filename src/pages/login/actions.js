import {from, of} from 'rxjs';
import {mergeMap, map, mapTo, concat, catchError} from 'rxjs/operators';
import {ofType} from 'redux-observable';
import {push} from 'react-router-redux';

import {performLogin} from '../../api/login-lib';
import {SESSION_ID} from '../../api/httpConfig';


export const LOGIN = "LOGIN_HANDLER/LOGIN";
export const LOGIN_SUCCESS = "LOGIN_HANDLER/LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_HANDLER/LOGIN_FAILURE";

export const LOGOUT = "LOGIN_HANDLER/LOGOUT";
export const LOGOUT_SUCCESS = "LOGIN_HANDLER/LOGOUT_SUCCESS";

export function login(formData) {
    return {
        type: LOGIN,
        formData,
    }
}
export function loginSuccess(result) {
    return {
        type: LOGIN_SUCCESS,
        result,
    }
}
export function loginFailure(errorMessage) {
    return {
        type: LOGIN_FAILURE,
        errorMessage,
    }
}
export function logout(){
    return {
        type: LOGOUT,
    }
}

export const loginEpic = actions$ =>
    actions$.pipe(
        ofType(LOGIN),
        mergeMap(action => from(performLogin(action.formData)).pipe(
            map(result => loginSuccess(result)),
            concat(of(push('./')))
        )),
        catchError(error => of(loginFailure(error)))
    );


export const loginReducer = (state = {}, action) => {
    switch(action.type){
        case LOGIN:
            return {...state};
        case LOGIN_SUCCESS:
            let result = action.result;
            if(result.status === 200)
                sessionStorage.setItem(SESSION_ID, result.headers.authorization);
            return {
                ...state,
                user: {
                    sessionId: SESSION_ID,
                    date: new Date(),
                }
            };
        case LOGIN_FAILURE:
            return {...state};
        case LOGOUT:
            let user = state.user;
            if(user && user.sessionId)
                sessionStorage.removeItem(user.sessionId);
            return {
                ...state,
                user: null,
            }
        default:
            return state;
    }
}