import React from 'react';
import ConnectedMovieDB, { mapStateToProps, MovieDB } from '../MovieDB';
import ConnectedMovieModal from '../../details/MovieModal';
import TestRenderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';

import Adapter from 'enzyme-adapter-react-16';
import {expect as expectChai} from 'chai';
import Enzyme, { shallow} from 'enzyme';
import sinon from 'sinon';

// create any initial state needed
let initialState; 
// here it is possible to pass in any middleware if needed into //configureStore
let mockStore = configureStore();
let store;

beforeAll(() =>{
    Enzyme.configure({ adapter: new Adapter(), disableLifecycleMethods: true })
});

beforeEach(() => {
    initialState = {};
});

describe("MovieDB component", () => {
    describe("MapStateToProps", () => {
        it("Should map state to props correctly", () => {
            const appState = {
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
            const expectedProps = {
                requestConfig: appState.movieReducer.requestConfig,
                movieData: appState.movieReducer.movieData,
                loading: appState.movieReducer.loading,
                userRatings: [],
                comments: []
            };
            const mappedProps = mapStateToProps(appState);

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
        it("Should render successfully", () => {
            store = mockStore(initialState);

            const wrapper = shallow(<MovieDB />);
            
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