import React, { useState, useEffect } from "react";
import '../styles/components/Profile.css';

function Profile() {
    const [bio, setBio] = useState("");
    const [editingBio, setEditingBio] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        const savedBio = localStorage.getItem('bio');
        const savedProfilePicture = localStorage.getItem('profilePicture');

        if (savedBio) {
            setBio(savedBio);
        }
        if (savedProfilePicture) {
            setProfilePicture(savedProfilePicture);
        }
    }, []);

    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    const handleBioSubmit = () => {
        localStorage.setItem('bio', bio);
        setEditingBio(false);
    };

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setProfilePicture(base64String);
                localStorage.setItem('profilePicture', base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-left">
                    <img
                        src={profilePicture || require("../img/default-avatar.jpg")}
                        alt="Profile"
                        className="profile-picture"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePictureChange}
                        className="upload-button"
                    />
                    {editingBio ? (
                        <>
                            <textarea
                                value={bio}
                                onChange={handleBioChange}
                                className="bio-textarea"
                                placeholder="Enter your bio..."
                            />
                            <button onClick={handleBioSubmit} className="save-bio-button">Save</button>
                        </>
                    ) : (
                        <>
                            <p className="bio-text">{bio || "No bio yet."}</p>
                            <button onClick={() => setEditingBio(true)} className="edit-bio-button">Edit Bio</button>
                        </>
                    )}
                </div>

                <div className="profile-right">
                    <h2>Wishlist</h2>
                    <div className="wishlist">
                        <p>No games in wishlist yet.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;