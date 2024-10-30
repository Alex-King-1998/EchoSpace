import React, { useState } from 'react';
import './post.css'; // Import the CSS for styling

const Post = ({ post, onLike, onDelete, onAddComment, onDeleteComment, onEditComment, currentUser }) => {
    const { id, content, likes, likedBy, user, avatar, comments = [] } = post;
    const userLiked = likedBy.includes(currentUser);
    const [commentText, setCommentText] = useState('');

    const handleLikeClick = () => {
        onLike(id, likes, likedBy);
    };

    const handleAddCommentClick = () => {
        if (commentText.trim()) {
            onAddComment(id, commentText);
            setCommentText('');
        }
    };

    return (
        <div className="post">
            <div className="post-header">
                <h3>{user}</h3>
            </div>
            <p>{content}</p>
            <div>
                <button onClick={handleLikeClick}>
                    {userLiked ? 'Unlike' : 'Like'} ({likes})
                </button>
                {user === currentUser && (
                    <button onClick={() => onDelete(id, user)}>Delete</button>
                )}
            </div>
            
            <div className="comments-section">
                <h4>Comments</h4>
                {comments.map((comment, index) => (
                    <div key={index} className="comment">
                        <p><strong>{comment.user}</strong>: {comment.text}</p>
                        <span>{new Date(comment.timestamp).toLocaleString()}</span>
                        {comment.user === currentUser && (
                            <>
                                <button onClick={() => onEditComment(id, comment, prompt("Edit your comment:", comment.text))}>Edit</button>
                                <button onClick={() => onDeleteComment(id, comment)}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
                <div className="add-comment">
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment"
                    />
                    <button onClick={handleAddCommentClick}>Comment</button>
                </div>
            </div>
        </div>
    );
};

export default Post;
