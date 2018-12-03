import React, { Component } from 'react';
import StarRatingComponent from 'react-star-rating-component';
import {MovieTileEntry} from './MovieTileEntry';
import './style.css';

    export const MovieTile = ({onClick, year, duration, 
        genres, actors, title, posterUrl, averageRating}) => {
        let index = 0;
        const genresString = (genres || []).map(genre => genre.name).join(', ');
        const actorsString = (actors || []).map(actor => actor.name).join(', ');
        const entries = 
        [
            {titleString: "Year", data: year || ''},
            {titleString:"Duration", data: duration || ''},
            {titleString:"Genres", data:genresString || ''},
            {titleString:"Actors", data:actorsString || ''}
        ];
        const tableRows = entries.map(d => <MovieTileEntry key={index++} titleString={d.titleString} data={d.data}/>);
        
        return (
            <div className="tileContainerGrid">
                <div className="headerArea"><span className="tileHeader tileTitle">{title}</span></div>
                <div className="infoArea">
                    <div className="infoAreaContainerGrid">
                        {tableRows}
                        <div className="ratingContainer">
                                   <StarRatingComponent
                                    name="avgRating"
                                    value={averageRating || 0} 
                                    starCount={10} 
                                    emptyStarColor="#e6e6e6" 
                                    editing={false} 
                                   />
                                   <span>({averageRating || 0}/10)</span>
                        </div>
                    </div>
                </div>
                <div onClick={onClick} className="posterArea"><img alt="Movie poster" src={posterUrl} className="posterImg" /></div>
            </div>
        );
    }
