import { http } from './httpConfig';


const getMoviesApi = (page, size, sort, direction) => {
    return http.get('/movies/getAll', {
        params: { 
            size,
            page,
            sort,
            direction,
        }
    }).then(result => {
        return result.data;
    }).catch(error => Promise.reject(error));
}
const getCommentsApi = (movieId, page, size) => {
    return http.get('/movies/comments', {
        params: {
            movieId,
            size,
            page 
        }
    }).then(result => {
        return { movieId, data: result.data };
    }).catch(error => Promise.reject(error));
} 
const postCommentApi = (formData, movieId) => {
    return http.post('/movies/submitComment', {
        title: formData.get('title'),
        comment: formData.get('comment'),
        movieId,
    }).
        then(result => result.data).
        catch(error => Promise.reject(error));
}

const voteMovieApi = (rating, movieId) => {
    return http({
        url: '/movies/vote ',
        method: 'POST',
        data: {
            rating,
            movieId,
        }
    }).then(result => {
        return result.data;
    }).catch(error => Promise.reject(error));
}
const getRatingApi = (movieId) => {
    return http.get('/movies/rating', {
        params: {
            movieId,
        }
    }).then(result => {
        result.data.movieId = movieId;
        return result.data;
    }).catch(error => Promise.reject(error));
}

const getAllActorsApi = () => {
    return http.get('/actors/getAll', {
    }).then(result => {
        return result.data;
    }).catch(error => Promise.reject(error));
}

export {
    getMoviesApi,
    voteMovieApi,
    getAllActorsApi,
    getRatingApi,
    getCommentsApi,
    postCommentApi
}




