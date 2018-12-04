import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadMovies, vote, loadRating, loadComments, SORT_OPTIONS } from './actions';
import { PageSort, PageInfo, MovieList } from '../../components';
import MovieModal from '../details/MovieModal';
import './style.css';

export class MovieDB extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            selectedMovieId: null
        };
    }
    componentDidMount() {
        const { size, direction, sort } = this.props.requestConfig || {};
        this.props.actions.loadMovies(0, size, sort, direction);
    }
    onMovieClicked = (movieId) => {
        const selectedMovie = this.props.movieData.content.find(movie => {
            return movie.id === movieId;
        });
        this.setState({ modalIsOpen: true, selectedMovieId: selectedMovie.id });
    }

    onNext = (currentPage, totalPages) => {
        if (currentPage + 1 < totalPages) {
            const { size, direction, sort } = this.props.requestConfig;
            this.props.actions.loadMovies(currentPage + 1, size, sort, direction);
        }
    }
    onPrev = (currentPage) => {
        if (currentPage - 1 >= 0) {
            const { size, direction, sort } = this.props.requestConfig;
            this.props.actions.loadMovies(currentPage - 1, size, sort, direction);
        }
    }
    onChangedSortOption = (newSortOption) => {
        const { size, direction, sort } = this.props.requestConfig;
        if (newSortOption && newSortOption !== sort) {
            this.props.actions.loadMovies(0, size, newSortOption, direction);
        }
        else
            console.error("Invalid sort option", newSortOption);
    }

    render() {
        const { requestConfig, loading } = this.props;
        const { size, direction, sort } = requestConfig || {};
        const movieData = this.props.movieData || {
            number: 0,
            totalPages: 0,
            size,
            numberOfElements: 0
        };
        const movies = movieData.content || [];

        return (
            <div style={{ width: '100%' }}>
                <PageInfo onPrev={this.onPrev}
                    onNext={this.onNext}
                    currentPage={movieData.number}
                    totalPages={movieData.totalPages}
                    numberOfElements={movieData.numberOfElements} />
                <PageSort
                    defaultSortOption={sort}
                    defaultDirection={direction}
                    sortOptions={SORT_OPTIONS}
                    onChangedSortOption={this.onChangedSortOption}
                />
                <div className="movieListContainer">
                    {
                        loading ?
                            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                            :
                            <MovieList movies={movies} onClick={this.onMovieClicked} />
                    }
                </div>
                <MovieModal
                    modalIsOpen={this.state.modalIsOpen}
                    movieId={this.state.selectedMovieId}
                    closeModal={() => { this.setState({ modalIsOpen: false, selectedMovieId: null }) }}
                />
            </div>
        );
    }
}
export const mapStateToProps = (state) => {
    const {movieReducer} = state || {};
    const {requestConfig, movieData, loading, userRatings, comments} = movieReducer || {};
    return {
        requestConfig: requestConfig || {},
        movieData: movieData || {},
        loading: loading || false,
        userRatings: userRatings || [],
        comments: comments || []
    }
};

export default connect(
    mapStateToProps,
    (dispatch) => ({
        actions: bindActionCreators(Object.assign({},
            { loadMovies, vote, loadRating, loadComments }), dispatch)
    })
)(MovieDB)
