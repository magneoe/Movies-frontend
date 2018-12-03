import React, { Component } from 'react';
import Modal from 'react-modal';
import StarRatingComponent from 'react-star-rating-component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { PageInfo, MovieTileEntry, CommentForm, CommentList } from '../../components';
import { vote, loadComments, postComment, loadRating } from '../home/actions';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';

Modal.setAppElement('#root')

//Modal window spesific styles
const customStyles = {
    content: {
        backgroundColor: '#364046',
        color: '#e6e6e6',
        height: '500px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '50%',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 1)'
    }
};
class MovieModal extends Component {

    constructor(props) {
        super(props);
    }
    /*
    * Should trigger rerendering whenever the
    * selected movie has been updated in the store.
    */
    componentDidUpdate(prevProps) {
        const movieIdNew  = this.props.movieId;
        const movieIdOld = prevProps.movieId;
        const {user} = this.props;

        const content = this.props.movieData.content || [];
        const selectedMovie = content.find(movie => {
            return movie.id === movieIdNew;
        });
        if (movieIdNew === movieIdOld)
            return;

        if (selectedMovie) {
            this.props.actions.loadComments(movieIdNew, 0);
            if(user){
                this.props.actions.loadRating(movieIdNew);
            }
        }
    }
    onVote = (nextValue, movieId) => {
        if (nextValue && this.props.user) {
            this.props.actions.vote(nextValue, movieId);
        }
    }
    onPostComment = (event) => {
        event.preventDefault();
        let form = document.getElementById("newCommentForm");
        //Validate ?
        let formData = new FormData(form);
        const movie = this.getMovieById(this.props.movieId);
        this.props.actions.postComment(formData, movie.id, this.getPageInfo(movie.id).number);
        //Clear field
        document.getElementById("title").value = "";
        document.getElementById("comment").value = "";
    }
    getMovieById = (movieId) => {
        if(!movieId)
            return {};
        const movieData = this.props.movieData || {};
        const content = movieData.content || [];
        return content.find(entry => entry.id === movieId) || {};
    }
    onNext = (currentPage, totalPages) => {
        const {movieId} = this.props;
        if (currentPage + 1 < totalPages && movieId) {
            this.props.actions.loadComments(movieId, currentPage + 1);
        }
    }
    onPrev = (currentPage) => {
        const {movieId} = this.props;
        if (currentPage - 1 >= 0 && movieId) {
            this.props.actions.loadComments(movieId, currentPage - 1);
        }
    }
    getPageInfo = (movieId) => {
        const commentsForSelectedMovie = this.props.comments.find(entry => entry.movieId === movieId);
        return (commentsForSelectedMovie || {}).data || { currentPage: 0, totalPages: 0, numberOfElements: 0, number: 0 };
    }

    render() {
        const { modalIsOpen, movieId, closeModal } = this.props;

        const movie = this.getMovieById(movieId);
        const { genres, actors, year, posterUrl, duration, averageRating, createdDate, releaseDate, plot } = movie || {};
        const commentEntry = this.props.comments.find(entry => entry.movieId === movieId) || {};
        const commentData = commentEntry.data || {};
        const commentList = commentData.content || [];

        const userRatings = this.props.userRatings || [];
        const currentRating = userRatings.find(userRating => userRating.movieId === movieId) || { rating: 0 };

        const { number, totalPages, numberOfElements } = this.getPageInfo(movieId);

        const genresString = (genres || []).map(genre => genre.name).join(', ');
        const actorsString = (actors || []).map(actor => actor.name).join(', ');
        const entries = 
        [
            {titleString: "Year", data: year || ''},
            {titleString: "Created date", data: createdDate || ''},
            {titleString: "Release date", data: releaseDate || ''},
            {titleString:"Duration", data: duration || ''},
            {titleString:"Genres", data: genresString || ''},
            {titleString:"Actors", data: actorsString || ''},
            {titleString: "Plot", data: plot || ''},
        ];
        let index = 0;
        const tableRows = entries.map(d => <MovieTileEntry key={index++} titleString={d.titleString} data={d.data}/>);
        return (
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    contentLabel="Movie Details"
                    style={customStyles}
                    overlayClassName=""
                >
                    <div className="headerContainer">
                        <h2 style={{ display: 'inline-flex' }}>{movie.title}</h2>
                        <button className="closeButton" onClick={closeModal}>X</button>
                    </div>
                    <div className="container">
                        <div className="posterContainer">
                            <img alt="Movie poster" src={posterUrl} className="posterImg" />
                        </div>
                        <div className="propertyContainer">
                            {tableRows}
                            <div className="avgRatingContainer">
                                   <StarRatingComponent
                                    name="avgRating"
                                    value={averageRating || 0} 
                                    starCount={10} 
                                    emptyStarColor="#e6e6e6" 
                                    editing={false} 
                                   />
                                   <span>({averageRating || 0}/10)</span>
                            </div>
                            <span className="tileHeader">You rated this movie:</span>
                                   {userRatingView(currentRating, this.onVote, movie, this.props.user)}
                        </div>
                        <span className="tileHeader" style={{ margin: '10px' }}>Comments:</span>
                        {number === 0 && <div style={{ alignSelf: 'flex-start' }}>
                            <span>Post a comment:</span>
                            <CommentForm onPostComment={this.onPostComment} user={this.props.user}/>
                        </div>}
                        <div className="commentList"> 
                            <CommentList commentList={commentList}/>
                        </div>
                        <PageInfo onPrev={this.onPrev} onNext={this.onNext} currentPage={number} totalPages={totalPages} numberOfElements={numberOfElements} />
                    </div>
                </Modal>
            </div>
        );
    }
}

const userRatingView = (currentRating, onVote, movie, user) => {
    if (user && user.sessionId && currentRating) {
        return (
            <div>
                <StarRatingComponent
                    name="avgRating"
                    value={currentRating.rating} /* number of selected icon (`0` - none, `1` - first) */
                    starCount={10} /* number of icons in rating, default `5` */
                    emptyStarColor="#e6e6e6" /* color of non-selected icons, default `#333` */
                    editing={true} /* is component available for editing, default `true` */
                    onStarClick={(nextValue, prevValue, name) => { onVote(nextValue, movie.id); }} /* on icon click handler */
                />
                <span style={{ marginLeft: '5px' }}>({currentRating.rating || 0}/10)</span>
            </div>
        );
    }
    return (<div><p>Log in to vote this movie</p></div>)
}

export default connect(
    (state) => ({
        requestConfig: state.movieReducer.requestConfig,
        movieData: state.movieReducer.movieData || {},
        loading: state.movieReducer.loading,
        userRatings: state.movieReducer.userRatings || [],
        comments: state.movieReducer.comments || [],
        user: state.loginReducer.user,
    }),
    (dispatch) => ({
        actions: bindActionCreators(Object.assign({},
            { vote, loadComments, postComment, loadRating }), dispatch)

    })
)(MovieModal)