// src/Signup.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig'; 
import { doc, setDoc } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null); // Updated state for file
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let avatarURL = 'default-avatar-url.jpg'; // Default avatar URL

            // If an avatar file is selected, upload it to Firebase Storage
            if (avatar) {
                const storage = getStorage();
                const avatarRef = ref(storage, `avatars/${user.uid}/${avatar.name}`);
                await uploadBytes(avatarRef, avatar); // Upload the file
                avatarURL = await getDownloadURL(avatarRef); // Get the download URL
            }

            // Save user data with avatar URL to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                avatar: avatarURL, // Store the uploaded avatar URL
            });

            // Redirect to the login page after successful signup
            navigate('/login'); 
        } catch (error) {
            setError(error.message);
        }
    };

    const handleFileChange = (e) => {
        setAvatar(e.target.files[0]); // Get the selected file
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email" 
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    required 
                />
                <button type="submit">Signup</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Signup; 
