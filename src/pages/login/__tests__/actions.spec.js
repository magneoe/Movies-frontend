import React from 'react';

import configureStore from 'redux-mock-store';

import {loginReducer, LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT} from '../actions';
import {SESSION_ID} from '../../../api/httpConfig';

let mockStore = configureStore()
let store;
let initialState;

beforeAll(() => {
    //store = mockStore(initialState);
});
beforeEach(() => {
    //store.clearActions();
    store = mockStore(initialState);

    initialState = {
        movieReducer: {
            loading: false,
            comments: [],
            requestConfig: {
                size: 5,
                direction: 0,
                sort: 'title'
            },
            movieData: {
                content: [
                    {
                        id: 7,
                        title: 'Coming to America',
                    }]
            }
        },
        loginReducer: {
            user: null,
        }
    };
});

describe("LoginReducer", () => {
    describe("Login action", () => {
        it("Should not change the state", () => {
            let newState = loginReducer(initialState, {type: LOGIN});
            expect(newState).toEqual(initialState);
        });
    });
    describe("Login success action", () => {
        it("Should set user in state and update sessionStorage", () => { 
            let newState = loginReducer(initialState, {
                type: LOGIN_SUCCESS,
                result: {
                    status: 200,
                    headers: {
                        authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QGdtYWlsLmNvbSIsImV4cCI6MTU0NDE3MjY5MH0.q5r5Jk789VkFRKg2ZNZ0taB0cVfMbe_eC4cb8ThQPLGeVCQlIpsDGEZVZq4giEVU7w19DiQ-cPU07iDTFsFL7Q' 
                    }
                }
            });
            expect(newState.user.sessionId).toEqual(SESSION_ID);
            expect(newState.user.date).toBeDefined();
            expect(newState.user.date).not.toBeNull();
            expect(sessionStorage.getItem(SESSION_ID)).toBe('Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QGdtYWlsLmNvbSIsImV4cCI6MTU0NDE3MjY5MH0.q5r5Jk789VkFRKg2ZNZ0taB0cVfMbe_eC4cb8ThQPLGeVCQlIpsDGEZVZq4giEVU7w19DiQ-cPU07iDTFsFL7Q');
        });
    });

    describe("Login failed action", () => {
        it("Should not change the state", () => {
            let newState = loginReducer(initialState, {type: LOGIN_FAILURE});
            expect(newState).toEqual(initialState);
        });
    });

    describe("Logout action", () => {
        it("Should clear session storage and set user to null", () => {
            initialState = {...initialState, 
                user: {
                    sessionId: SESSION_ID,
                    date: new Date()
                }
            };
            sessionStorage.setItem(SESSION_ID, 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QGdtYWlsLmNvbSIsImV4cCI6MTU0NDE3MjY5MH0.q5r5Jk789VkFRKg2ZNZ0taB0cVfMbe_eC4cb8ThQPLGeVCQlIpsDGEZVZq4giEVU7w19DiQ-cPU07iDTFsFL7Q');
            let newState = loginReducer(initialState, {type: LOGOUT});

            expect(newState.loginReducer).toEqual({
                user: null
            });
            expect(sessionStorage.getItem(SESSION_ID)).toBeNull();
        });
    });
});

describe("LoginEpics", () => {

});