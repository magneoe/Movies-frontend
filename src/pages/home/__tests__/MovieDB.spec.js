import React from 'react';

import configureStore from 'redux-mock-store';

import Adapter from 'enzyme-adapter-react-16';
import {expect as expectChai} from 'chai';
import Enzyme, { shallow} from 'enzyme';
import sinon from 'sinon';

import ConnectedMovieDB, { mapStateToProps, MovieDB } from '../MovieDB';

let initialState; 
// pass in any middleware if needed into //configureStore
let mockStore = configureStore();
let store;

beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter(), disableLifecycleMethods: true });
    store = mockStore(initialState);
});

beforeEach(() => {
    store.clearActions();

    initialState =  {
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
        }
    };
});

describe("MovieDB component", () => {
    describe("MapStateToProps", () => {
        it("Should map state to props correctly", () => {
            
            const expectedProps = {
                requestConfig: initialState.movieReducer.requestConfig,
                movieData: initialState.movieReducer.movieData,
                loading: initialState.movieReducer.loading,
                userRatings: [],
                comments: []
            };
            const mappedProps = mapStateToProps(initialState);

            expect(mappedProps).toEqual(expectedProps);
        });

        it("Should map state to props correctly on empty state", () => {
            const appState = {
            };
            const expectedProps = {
                requestConfig: {},
                movieData: {},
                loading: false,
                userRatings: [],
                comments: []
            };
            const mappedProps = mapStateToProps(appState);

            expect(mappedProps).toEqual(expectedProps);
        });
    });

    describe("The display unit", () => {
        it("Should render successfully and loadMovie on componentDidMount", () => {
            store = mockStore(initialState);

            let spy = sinon.spy();
            const wrapper = shallow(<MovieDB actions={{loadMovies: spy}}/>, {disableLifecycleMethods: false});
            expectChai(spy.callCount).to.equal(1);
            expect(wrapper).toMatchSnapshot();
        });

        it("Should render loading wheel whenever in loading state", () => {
            initialState = {...initialState,
                movieReducer: { loading: true}
            };
            store = mockStore(initialState);
            const wrapper = shallow(<ConnectedMovieDB store={store}/>);
            expectChai(wrapper.dive().find('div.lds-roller')).to.have.length(1);
        });

        it("Should render MovieList when not in loading state", () => {
            initialState = {...initialState,
                movieReducer: { loading: false}
            };
            store = mockStore(initialState);
            const wrapper = shallow(<ConnectedMovieDB store={store}/>);
            expectChai(wrapper.dive().find('MovieList')).to.have.length(1);
        });
    });
});