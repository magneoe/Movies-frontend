import React, { Component } from 'react';
import StarRatingComponent from 'react-star-rating-component';

import './style.css';

 

    export const MovieTile = (props) => {
        let { title, year, posterUrl, duration, averageRating, onClick } = props;

        const genres = props.genres || [];
        const actors = props.actors || [];

        const genreView = genres.map(genre => genre.name).join(', ');
        const actorsView = actors.map(actor => actor.name).join(', ');

        return (
            <div className="tileContainerGrid">
                <div className="headerArea"><span className="tileHeader tileTitle">{title}</span></div>
                <div className="infoArea">
                    <div className="infoAreaContainerGrid">
                        <div className="infoCellEntry"><span className="tileHeader">Year:</span> {year}</div>
                        <div className="infoCellEntry"><span className="tileHeader">Duration:</span> {duration} mins</div>
                        <div className="infoCellEntry"><span className="tileHeader">Genres:</span> {genreView}</div>
                        <div className="infoCellEntry"><span className="tileHeader">Actors:</span> {actorsView}</div>
                        <div className="ratingContainer">
                                   <StarRatingComponent
                                    name="avgRating"
                                    value={averageRating} 
                                    starCount={10} 
                                    emptyStarColor="#e6e6e6" 
                                    editing={false} 
                                   />
                                   <span>({averageRating}/10)</span>
                        </div>
                    </div>
                </div>
                <div onClick={onClick} className="posterArea"><img alt="Movie poster" src={posterUrl} className="posterImg" /></div>
            </div>
        );
    }
