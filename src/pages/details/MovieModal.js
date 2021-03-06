import React, { Component } from 'react';
import Modal from 'react-modal';
import StarRatingComponent from 'react-star-rating-component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { PageInfo, MovieTileEntry, CommentForm, CommentList } from '../../components';
import { vote, loadComments, postComment, loadRating } from '../home/actions';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';


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
        this.state = {
            currentPage: 0
        };
    }
    componentDidMount(){
        Modal.setAppElement('#root');
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
        //Clear fields
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
            if(!this.props.comments.data.find(e => e.number === currentPage + 1))
                this.props.actions.loadComments(movieId, currentPage + 1);
            this.setState({currentPage: currentPage + 1});
        }
    }
    onPrev = (currentPage) => {
        const {movieId} = this.props;
        if (currentPage - 1 >= 0 && movieId) {
            if(!this.props.comments.data.find(e => e.number === currentPage - 1))
                this.props.actions.loadComments(movieId, currentPage - 1);
            this.setState({currentPage: currentPage - 1});
        }
    }
    getPageInfo = () => {
        const commentArray = this.props.comments.data || [];
        const commentsByPage = commentArray.find(e => e.number === this.state.currentPage);
        return commentsByPage || { currentPage: 0, totalPages: 0, numberOfElements: 0, number: 0 };
    }

    close = () => {
        this.setState({currentPage: 0});
        this.props.closeModal();
    }

    render() {
        const { modalIsOpen, movieId } = this.props;

        const movie = this.getMovieById(movieId);
        const { genres, actors, year, posterUrl, duration, averageRating, createdDate, releaseDate, plot } = movie || {};
        const comments = this.props.comments || {};
        const commentData = comments.data || [];
        const commentsByPage = commentData.find(e => e.number === this.state.currentPage);
        const commentList = (commentsByPage || {}).content || [];

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
                        <button className="closeButton" onClick={this.close}>X</button>
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
                        <PageInfo onPrev={this.onPrev} onNext={this.onNext} currentPage={this.state.currentPage} totalPages={totalPages} numberOfElements={numberOfElements} />
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
export const mapStateToProps = (state) => {
    const {movieReducer, loginReducer} = state || {};
    const {requestConfig, movieData, loading, userRatings, comments} = movieReducer || {};
    const {user} = loginReducer;
    return {
        requestConfig: requestConfig,
        movieData: movieData || {},
        loading: loading,
        userRatings: userRatings || [],
        comments: comments || {},
        user,
    }
}

export default connect(
    mapStateToProps,
    (dispatch) => ({
        actions: bindActionCreators(Object.assign({},
            { vote, loadComments, postComment, loadRating }), dispatch)

    })
)(MovieModal)