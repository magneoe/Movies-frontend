import {movieReducer, loadMovies, loadMoviesSuccess, loadMoviesFailure, loadCommentsSuccess} from '../actions';
let initialState = {};

beforeEach(() => {
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
                content: []
            }
        },
        loginReducer: {
            user: null,
        }
    };
});

describe("Movie reducer", () => {
    describe("Load movies action", () => {
        it("Should return correct state", () => {
            const action = loadMovies(0, 10, 'year', 0);
            const newState = movieReducer(initialState, action);

            expect(newState.loading).toBe(true);
            expect(newState.requestConfig.sort).toBe("year");
            expect(newState.requestConfig.direction).toBe(0);
        });
    });
    describe("Load movies success", () => {
        it("Should return correct state", () => {
            const movieData = {
                content: [
                    {
                        id: 7,
                        title: 'Coming to America',
                    },
                    {
                        id: 9,
                        title: 'Pulp fiction',
                    },
                    {
                        id: 11,
                        title: 'Transformers',
                    }
                ]
            };
            const action = loadMoviesSuccess(movieData);
            const newState = movieReducer(initialState, action);

            expect(newState.loading).toBe(false);
            expect(newState.movieData).toEqual(movieData);
        });
    });

    describe("Load movies failure", () => {
        it("Should return correct state", () => {
        
            const action = loadMoviesFailure({status: 401, error: "Failed"});
            const newState = movieReducer(initialState, action);

            expect(newState.loading).toBe(false);
            expect(newState.error).toBeTruthy();
            expect(newState.movieData).toBeNull();
        });
    });

    describe("Load comment success", () => {
        it("Should return correct state", () => {
            initialState.comments = 
                {
                  movieId: 11,
                  data: {
                    content: [
                      {
                        title: 'Test2',
                        comment: 'test2',
                        author: {
                          name: 'Harry',
                          lastname: 'Hole'
                        },
                        created: '11/12/2018 12:25',
                        movieId: 11
                      },
                      {
                        title: 'Test her å',
                        comment: 'dasd',
                        author: {
                          name: 'Harry',
                          lastname: 'Hole'
                        },
                        created: '11/10/2018 14:36',
                        movieId: 11
                      }
                    ]
                }
            };

            const result = {
                movieId: 20,

            };
            const action = loadCommentsSuccess(result);
            const newState = movieReducer(initialState, action);

            expect(newState.loading).toBe(false);
            expect(newState.comments).toEqual(movieData);
        });
    });
});