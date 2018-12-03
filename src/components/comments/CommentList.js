import React from 'react';
import './styles.css';

export const CommentList = ({commentList}) =>  
    commentList.map((entry, index) => {
    const author = entry.author || {};
    return (
        <div key={index} className="commentListContainer">
            <div className="commentListAuthorContainer">
                <span className="commentHighlightedText">{author.name || ''} {author.lastname || ''}</span>
                <br/><span className="commentItalicText">{entry.created || ''}</span>
            </div>
            <div className="commentListTitleContainer">
                <span className="commentHighlightedText">{entry.title || ''}</span>
            </div>
            <div className="commentListTextContainer">
                <div>{entry.comment}</div>
            </div>
        </div>
    );
});