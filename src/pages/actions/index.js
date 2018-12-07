import {loadMoviesEpic, voteEpic, loadRatingEpic, loadCommentsEpic, postCommentEpic} from '../home/actions';
import {loginEpic, logoutEpic} from '../login/actions';
import { combineEpics } from 'redux-observable';

export default combineEpics(
    loadMoviesEpic,
    voteEpic,
    loginEpic,
    logoutEpic,
    loadRatingEpic,
    loadCommentsEpic,
    postCommentEpic
);