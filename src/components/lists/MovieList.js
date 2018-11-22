import React from 'react';

import './style.css';
import {MovieTile} from '../tiles/MovieTile';

export const MovieList = ({ movies, onClick }) => (
    <div className="listContainer">
        {movies.map(movie => {
            return (
            <MovieTile key={movie.id}
            {...movie}
            onClick={() => onClick(movie.id)} />
            );
        }
        )}
    </div>
);

