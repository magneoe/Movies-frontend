import axios from 'axios';
import moxios from 'moxios';

import {
    getMoviesApi,
    voteMovieApi,
    getAllActorsApi,
    getRatingApi,
    getCommentsApi,
    postCommentApi
} from '../movieDB-lib';
import { http } from '../httpConfig';


const movieMockData = {
    "content": [
        {
            "id": 7,
            "title": "Coming to America",
            "year": "1947",
            "plot": "Very funny",
            "duration": "90",
            "posterUrl": "https://m.media-amazon.com/images/M/MV5BNGZlNjdlZmMtYTg0MC00MmZkLWIyNDktYmNlOWYzMTkzYWQ1XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SY1000_CR0,0,655,1000_AL_.jpg",
            "createdDate": "24/09/2018",
            "releaseDate": "21/10/1988",
            "averageRating": 10,
            "genres": [
                {
                    "id": 9,
                    "name": "Comedy"
                }
            ],
            "actors": [
                {
                    "id": 8,
                    "name": "Eddie Muprpy",
                    "displayName": "Eddie Muprpy"
                }
            ]
        }]
};
const commentsMockData = {
    "content": [
        {
            "title": "Test",
            "comment": "test",
            "author": {
                "name": "Harry",
                "lastname": "Hole"
            },
            "created": "03/12/2018 11:27",
            "movieId": 7
        },
        {
            "title": "asdasd",
            "comment": "asdas",
            "author": {
                "name": "Harry",
                "lastname": "Hole"
            },
            "created": "03/12/2018 10:39",
            "movieId": 7
        }
    ]
}

const userRating = {
    "rating": 6
};

const actorsList = {
    "content": [
        {
            "id": 8,
            "name": "Eddie Muprpy",
            "displayName": "Eddie Muprpy"
        },
        {
            "id": 3,
            "name": "Samuel Jackson",
            "displayName": "Samuel Jackson"
        },
        {
            "id": 12,
            "name": "Uma Thurman",
            "displayName": "Uma Thurman"
        }
    ]
};


beforeEach(function () {
    // import and pass your custom axios instance to this method
    //const httpTest = http;
    moxios.install(http);
});

describe("MovieDB-lib", () => {

    it("GetMoviesApi function should return 1 movie", done => {
        const page = 0, size = 10, sort = "title", direction = 0;

        getMoviesApi(page, size, sort, direction).then(data => {
            expect(data.content).toEqual(movieMockData.content);
            done();
        });

        moxios.wait(
            () => {
                let request = moxios.requests.mostRecent()
                request.respondWith({
                    status: 200,
                    response: { ...movieMockData }
                });
            });
    });


    it("GetCommentsApi funtion should return 1 comment", done => {
        const movieId = 7, page = 0, size = 10;

        getCommentsApi(movieId, page, size).then(response => {
            expect(response.data.content).toEqual(commentsMockData.content);
            expect(response.movieId).toBe(7);
            done();
        });

        moxios.wait(() => {
            let request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: { ...commentsMockData }
            });
        });
    });

    it("GetRatingApi function should ", done => {
        const movieId = 7;

        getRatingApi(movieId).then(data => {
            expect(data.movieId).toBe(movieId);
            expect(data.rating).toEqual(userRating.rating);
            done();
        })

        moxios.wait(() => {
            let request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: { ...userRating }
            })
        });
    });

    it("GetAllActorsApi function should return 3 actors", done => {
        getAllActorsApi().then(data => {
            expect(data.content).toEqual(actorsList.content);
            done();
        });

        moxios.wait(() => {
            let request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: {...actorsList}
            });
        });
    });
});

