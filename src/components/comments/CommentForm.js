import React from 'react';

export const CommentForm = ({onPostComment, user}) => {
    if (user && user.sessionId) { 
        return (
            <div className="commentFormContainer">
                <form method="POST" name="newCommentForm" id="newCommentForm">
                    <div className="commentFormRow"><input type="text" name="title" id="title" placeholder="Title" /></div>
                    <div className="commentFormRow"><textarea style={{width: '100%'}} name="comment" id="comment" rows="5" maxLength="150" placeholder="Comment" /></div>
                    <div className="commentFormRow"><input type="submit"
                                    name="submitComment" value="Post comment" onClick={onPostComment} />
                    </div>
                </form>
            </div>);
    }
    return (<div><p>Log in to post a comment</p></div>);
}