import React, { Component } from 'react';
import StarRatingComponent from 'react-star-rating-component';

import './style.css';

 
export class MovieTile extends Component {

    render() {
        let { title, year, posterUrl, duration, averageRating, onClick } = this.props;

        const genres = this.props.genres || [];
        const actors = this.props.actors || [];

        const genreView = genres.map(genre => genre.name).join(', ');
        const actorsView = actors.map(actor => actor.name).join(', ');

        return (
            <div className="tileContainer">
                <div className="tilePropertyContainer">
                    <table>
                        <tbody>
                            <tr onClick={onClick}>
                                <td colSpan="2">
                                    <span className="tileHeader tileTitle">{title}</span>
                                </td>
                            </tr>
                            <tr>
                                <td><span className="tileHeader">Year:</span></td>
                                <td>{year}</td>
                            </tr>
                            <tr>
                                <td><span className="tileHeader">Duration:</span></td>
                                <td>{duration} mins</td>
                            </tr>
                            <tr>
                                <td><span className="tileHeader">Genres:</span></td>
                                <td>{genreView}</td>
                            </tr>
                            <tr>
                                <td><span className="tileHeader">Actors:</span></td>
                                <td>{actorsView}</td>
                            </tr>
                            <tr>
                                <td colSpan="2"><span className="tileHeader">Avg. rating:</span></td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <div className="ratingContainer">
                                   <StarRatingComponent
                                    name="avgRating"
                                    value={averageRating} /* number of selected icon (`0` - none, `1` - first) */
                                    starCount={10} /* number of icons in rating, default `5` */
                                    emptyStarColor="#e6e6e6" /* color of non-selected icons, default `#333` */
                                    editing={false} /* is component available for editing, default `true` */
                                   />
                                   <span>({averageRating}/10)</span>
                                   </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div onClick={onClick} className="posterContainer">
                    <img alt="Movie poster" src={posterUrl} className="posterImg" />
                </div>
            </div>
        );
    }
}