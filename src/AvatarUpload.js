// src/AvatarUpload.js
import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AvatarUpload = ({ user }) => {
    const [avatar, setAvatar] = useState(user.photoURL || '');
    const [file, setFile] = useState(null); // New state for the selected file

    const handleAvatarChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const storage = getStorage();
            const avatarRef = ref(storage, `avatars/${user.uid}/${selectedFile.name}`);

            // Upload the selected file to Firebase Storage
            await uploadBytes(avatarRef, selectedFile);
            const newAvatarUrl = await getDownloadURL(avatarRef); // Get the download URL

            // Update user's avatar URL in Firestore
            await updateDoc(doc(db, 'users', user.uid), { avatar: newAvatarUrl });
            setAvatar(newAvatarUrl); // Update local state to reflect the new avatar
        }
    };

    // Fetch the user's avatar when the component mounts
    useEffect(() => {
        const fetchAvatar = async () => {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const data = userDoc.data();
                setAvatar(data.avatar);
            }
        };

        if (user) {
            fetchAvatar();
        }
    }, [user.uid]);

    return (
        <div>
            <h2>Change Avatar</h2>
            <img src={avatar} alt="User Avatar" style={{ width: '100px', height: '100px' }} />
            <input type="file" onChange={handleAvatarChange} accept="image/*" />
        </div>
    );
};

export default AvatarUpload;
