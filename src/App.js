import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { auth, db } from './firebaseConfig';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import Login from './Login';
import Signup from './Signup';
import Post from './components/Post';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

function App() {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'posts'), async (snapshot) => {
            const postsArray = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
                const postData = { id: docSnapshot.id, ...docSnapshot.data() };

                if (postData.userId) {
                    const userDocRef = doc(db, 'users', postData.userId);
                    const userDoc = await getDoc(userDocRef);
                }

                return postData;
            }));

            postsArray.sort((a, b) => b.timestamp - a.timestamp);
            setPosts(postsArray);
        });

        return () => unsubscribe();
    }, []);

    const handleAddPost = async () => {
        if (newPost.trim() === '') return;

        const post = {
            userId: user.uid,
            user: user.email,
            content: newPost,
            likes: 0,
            likedBy: [],
            comments: [], // Initialize empty comments array
            timestamp: Date.now(),
        };

        await addDoc(collection(db, 'posts'), post);
        setNewPost('');
    };

    const handleDeletePost = async (id, postUser) => {
      if (postUser === user.email) {
          await deleteDoc(doc(db, 'posts', id));
      } else {
          alert("You can only delete your own posts.");
      }
  };

    const handleAddComment = async (postId, commentText) => {
        if (commentText.trim() === '') return;

        const comment = {
            text: commentText,
            user: user.email,
            timestamp: Date.now(),
        };

        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            comments: arrayUnion(comment),
        });
    };

    const handleDeleteComment = async (postId, comment) => {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            comments: arrayRemove(comment),
        });
    };

    const handleEditComment = async (postId, originalComment, newCommentText) => {
        await handleDeleteComment(postId, originalComment);
        await handleAddComment(postId, newCommentText);
    };

    const handleLikePost = async (id, likes, likedBy) => {
        const postRef = doc(db, 'posts', id);
        const userLiked = likedBy.includes(user.email);

        if (!userLiked) {
            await updateDoc(postRef, {
                likes: likes + 1,
                likedBy: [...likedBy, user.email],
            });
        } else {
            await updateDoc(postRef, {
                likes: likes - 1,
                likedBy: likedBy.filter(email => email !== user.email),
            });
        }
    };

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/login');
    };

    return (
        <div className="App">
            <h1>EchoSpace</h1>
            <nav>
                <span className="welcome-message">Welcome, {user && user.email}</span>
                {user && <button onClick={handleLogout}>Logout</button>}
            </nav>
            <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
            />
            <button onClick={handleAddPost}>Post</button>
            <div className="post-feed">
                {posts.map((post) => (
                    <Post 
                        key={post.id} 
                        post={post} 
                        onLike={handleLikePost} 
                        onDelete={handleDeletePost} 
                        onAddComment={handleAddComment} 
                        onDeleteComment={handleDeleteComment} 
                        onEditComment={handleEditComment}
                        currentUser={user.email}
                    />
                ))}
            </div>
        </div>
    );
}

const AppWithRouter = () => (
    <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<ProtectedRoute element={<App />} />} />
        </Routes>
    </Router>
);

export default AppWithRouter;
