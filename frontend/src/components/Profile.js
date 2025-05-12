import React, { useState, useEffect } from "react";
import '../styles/components/Profile.css';
import { Link } from "react-router-dom";


function Profile() {
    const [bio, setBio] = useState("");
    const [editingBio, setEditingBio] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [username, setUsername] = useState("");
    const [wishlistItems, setWishlistItems] = useState([]);
    const [historyItems, setHistoryItems] = useState([]);



    useEffect(() => {
        const savedBio = localStorage.getItem('bio');
        const savedProfilePicture = localStorage.getItem('profilePicture');
        const savedUsername = localStorage.getItem('login');
        const userId = localStorage.getItem('userId');
    

        if (savedBio) {
            setBio(savedBio);
        }
        if (savedProfilePicture) {
            setProfilePicture(savedProfilePicture);
        }
        if (savedUsername) {
            setUsername(savedUsername);
            const fetchUserLists = async () => {
                const userId = localStorage.getItem('userId');
                if (!userId) return;

                try {
                    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${userId}`)) || [];
                    const history = JSON.parse(localStorage.getItem(`history_${userId}`)) || [];

                    setWishlistItems(wishlist);
                    setHistoryItems(history);
                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            };

            fetchUserLists();

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

    const clearWishlist = () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        localStorage.removeItem(`wishlist_${userId}`);
        setWishlistItems([]);
    };

    const clearHistory = () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        localStorage.removeItem(`history_${userId}`);
        setHistoryItems([]);
    };


    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-left">
                    <h1 className="username">{username || "Guest"}</h1>
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

                    <div className="wishlist-box">
                        <h2>Wishlist</h2>
                        {wishlistItems.length > 0 ? (
                            wishlistItems.map((game, i) => <p key={i}>{game.name}</p>)
                        ) : (
                            <p>No games in wishlist yet.</p>
                        )}
                        {wishlistItems.length > 0 && (
                            <button onClick={clearWishlist} className="clear-button">Clear Wishlist</button>
                        )}

                    </div>

                    <div className="history-box">
                        <h2>Game history</h2>
                        {historyItems.length > 0 ? (
                            historyItems.map((game, i) => <p key={i}>{game.name}</p>)
                        ) : (
                            <p>No games played yet.</p>
                        )}
                        {historyItems.length > 0 && (
                            <button onClick={clearHistory} className="clear-button">Clear History</button>
                        )}

                    </div>

                </div>




            </div>
        </div>
    );
}

export default Profile;