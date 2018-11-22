import { from, of} from 'rxjs';
import { switchMap, mergeMap, map, delay, catchError, concat } from 'rxjs/operators';
import { ofType } from 'redux-observable';

import { getMoviesApi, voteMovieApi, getRatingApi, getCommentsApi, postCommentApi } from '../../api/movieDB-lib';

export const LOAD_MOVIES = "MOVIES/LOAD_MOVIES";
export const LOAD_MOVIES_SUCCESS = "MOVIES/LOAD_MOVIES_SUCCESS";
export const LOAD_MOVIES_FAILURE = "MOVIES/LOAD_MOVIES_FAILURE";

export const LOAD_COMMENTS = "MOVIES/LOAD_COMMENTS";
export const LOAD_COMMENT_SUCCESS = "MOVIES/LOAD_COMMENTS_SUCCSESS";
export const LOAD_COMMENT_FAILURE = "MOVIES/LOAD_COMMENTS_FAILURE";

export const POST_COMMENT = "MOVIES/POST_COMMENT";
export const POST_COMMENT_SUCCESS = "MOVIES/POST_COMMENT_SUCCESS";
export const POST_COMMENT_FAILURE = "MOVIES/POST_COMMENT_FAILURE";

export const VOTE = "MOVIES/VOTE";
export const VOTE_SUCCSESS = "MOVIES/VOTE_SUCCESS";
export const VOTE_FAILURE = "MOVIES/VOTE_FAILURE";

export const LOAD_RATING = "MOVIES/LOAD_RATING";
export const LOAD_RATING_SUCCESS = "MOVIES/LOAD_RATING_SUCCESS";
export const LOAD_RATING_FAILURE = "MOVIES/LOAD_RATING_FAILURE";

export const DIRECTION_ASC = 0;
export const DIRECTION_DESC = 1;
export const SORT_OPTIONS = ["title", "year", "duration"];
const DEFAULT_COMMENT_PAGE_SIZE = 5;


export function loadMovies(page, size, sort, direction) {
    return {
        type: LOAD_MOVIES,
        size,
        page,
        sort,
        direction
    }
}
export function loadMoviesSuccess(movieData) {
    return {
        type: LOAD_MOVIES_SUCCESS,
        movieData,
    }
}
export function loadMoviesFailure(error) {
    return {
        type: LOAD_MOVIES_FAILURE,
        error
    }
}
export function loadComments(movieId, page, size = DEFAULT_COMMENT_PAGE_SIZE) {
    return {
        type: LOAD_COMMENTS,
        movieId,
        size,
        page
    }
}

export function loadCommentsSuccess(result){
    return {
        type: LOAD_COMMENT_SUCCESS,
        result,
    }
}
export function loadCommentsFailure(error) {
    return {
        type: LOAD_COMMENT_FAILURE,
        error,
    }
}

export function postComment(formData, movieId, currentPage) {
    return {
        type: POST_COMMENT,
        formData,
        movieId,
        currentPage
    }
}
export function postCommentSuccess(result) {
    return {
        type: POST_COMMENT_SUCCESS,
        result,
    }
}
export function postCommentFailure(error) {
    return {
        type: POST_COMMENT_FAILURE,
        error,
    }
}

export function vote(rating, movieId) {
    return {
        type: VOTE,
        rating,
        movieId,
    }
}
export function voteSuccess(movieData) {
    return {
        type: VOTE_SUCCSESS,
        movieData,
    }
}
export function voteFailure(error) {
    return {
        type: VOTE_FAILURE,
        error,
    }
}
export function loadRating(movieId) {
    return {
        type: LOAD_RATING,
        movieId,
    }
}
export function loadRatingSuccess(rating) {
    return {
        type: LOAD_RATING_SUCCESS,
        currentRating: rating,
    }
}
export function loadRatingFailure(error) {
    return {
        type: LOAD_RATING_FAILURE,
        error,
    }
}

function handleError(error) {
    console.log(error);
    if (error && error.response) {
        if (error.response.status >= 400 && error.response.status < 500) {
            //Handle client errors
            alert("Client error: " + error.response.statusText);
            return "Client error";
        }
        else if (error.response.status >= 500 && error.response.status < 600) {
            //Handle server errors
            alert("Server error: " + error.response.statusText);
            return "Server error";
        }
    }
    return error;
}
export const loadMoviesEpic = actions$ =>
    actions$.pipe(
        ofType(LOAD_MOVIES),
        delay(1000),
        mergeMap(action => from(getMoviesApi(action.page, action.size, action.sort, action.direction))),
        map(result => loadMoviesSuccess(result)),
        catchError(error => of(loadMoviesFailure(handleError(error))))
    );

export const voteEpic = actions$ =>
    actions$.pipe(
        ofType(VOTE),
        mergeMap(action =>
            from(voteMovieApi(action.rating, action.movieId)).pipe(
                map(result => voteSuccess(result)),
                concat(of(loadRatingSuccess({ rating: action.rating, movieId: action.movieId })))
            )
        ),
        catchError(error => of(voteFailure(handleError(error))))
    );
export const loadRatingEpic = actions$ =>
    actions$.pipe(
        ofType(LOAD_RATING),
        delay(1000),
        mergeMap(action => from(getRatingApi(action.movieId))),
        map(result => loadRatingSuccess(result)),
        catchError(error => of(loadRatingFailure(handleError(error))))
    );
export const loadCommentsEpic = actions$ =>
        actions$.pipe(
            ofType(LOAD_COMMENTS),
            mergeMap(action => from(getCommentsApi(action.movieId, action.page,
                action.size))),
            map(result => loadCommentsSuccess(result)),
            catchError(error => of(loadCommentsFailure(handleError(error))))
        );

export const postCommentEpic = actions$ =>
                actions$.pipe(
                    ofType(POST_COMMENT),
                    mergeMap(action =>
                            from(postCommentApi(action.formData, action.movieId)).pipe(
                                map(result => postCommentSuccess(result)),
                                concat(of(loadComments(action.movieId, action.currentPage)))
                            )
                        ),
                    // switchMap(action => from(postCommentApi(action.formData, action.movieId))),
                    // map(result => postCommentSuccess(result)),
                    catchError(error => of(postCommentFailure(handleError(error))))
                );



export const movieReducer = (state = {}, action) => {
    console.log(action);
    switch (action.type) {
        case LOAD_MOVIES:
            return {
                ...state,
                loading: true,
                requestConfig: {
                    ...state.requestConfig,
                    sort: action.sort,
                    direction: action.direction
                }
            };
        case LOAD_MOVIES_SUCCESS:
            return {
                ...state,
                loading: false,
                movieData: action.movieData,
            }
        case LOAD_MOVIES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.error,
                movieData: null
            }

        case LOAD_COMMENT_SUCCESS:
            const result = action.result || {};
            const currentComments = state.comments || [];
            let updatedCommentsTest = [];

            const indexOfCurrentComments = currentComments.findIndex(entry => entry.movieId === result.movieId);
            if (indexOfCurrentComments === -1) {
                updatedCommentsTest = [...currentComments, action.result];
            }
            else {
                updatedCommentsTest = updateObjectInArray(currentComments,
                    {index: indexOfCurrentComments, item: action.result});
            }

            return {
                ...state,
                loading: false,
                comments: updatedCommentsTest,
            }
        case VOTE_SUCCSESS:
            const currentMovieData = state.movieData || {};
            const currentMovieContent = currentMovieData.content || [];

            const indexOfMovieContentToUpdate = currentMovieContent.findIndex(entry => entry.id === action.movieData.id);
            const updatedMovieContent = updateObjectInArray(currentMovieContent, {index: indexOfMovieContentToUpdate, item: action.movieData});
            return {
                ...state,
                loading: false,
                movieData: {
                    ...state.movieData,
                    content: updatedMovieContent
                }
            }
        case LOAD_RATING_FAILURE:
        case POST_COMMENT_FAILURE:
        case VOTE_FAILURE:
        case LOAD_COMMENT_FAILURE:
            return {
                ...state,
                loading: false,
            }

        case LOAD_RATING:
        case POST_COMMENT:
        case VOTE:
        case LOAD_COMMENTS:
            return {
                ...state,
                loading: true
            }
        case LOAD_RATING_SUCCESS:
            let updatedUserRatings = [];
            const currentUserRatings = state.userRatings || [];

            const indexOfRating = currentUserRatings.findIndex(rating => rating.movieId === action.currentRating.movieId);
            if (indexOfRating === -1) {
                updatedUserRatings = [...currentUserRatings, action.currentRating];
            }
            else {
                updatedUserRatings = updateObjectInArray(currentUserRatings, {index: indexOfRating, item: action.currentRating});
            }
            return {
                ...state,
                loading: false,
                userRatings: updatedUserRatings
            }

        case POST_COMMENT_SUCCESS:
            return {
                ...state,
                loading: false,
            }
        default:
            return state;
    }
}
/*
* Helper function to update arrays without mutating the state
*/
const updateObjectInArray = (array, action) => {
    return array.map((item, index) => {
        if(index !== action.index){
            return item;
        }
        return {
            ...item,
            ...action.item,
        }
    });
}
const removeItem = (array, action) => {
    return array.filter((item, index) => index !== action.index);
}
const insertItem = (array, action) => {
    let newArray = array.slice();
    newArray.splice(action.index, 0, action.item);
    return newArray;
}
