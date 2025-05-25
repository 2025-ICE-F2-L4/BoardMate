import React, { useState, useEffect } from "react";
import '../styles/components/Profile.css';

function Profile() {
    const [bio, setBio] = useState("");
    const [editingBio, setEditingBio] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [username, setUsername] = useState("");
    const [wishlistItems, setWishlistItems] = useState([]);
    const [historyItems, setHistoryItems] = useState([]);
    const [wishlistError, setWishlistError] = useState(null);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);

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
                    setIsWishlistLoading(true);
                    const wishlistResponse = await fetch(
                        `${process.env.REACT_APP_BACKEND_URL}/userWishlist?userID=${userId}`
                    );
                    
                    if (!wishlistResponse.ok) {
                        throw new Error('Failed to fetch wishlist');
                    }
                    
                    const wishlistData = await wishlistResponse.json();
                    console.log("Wishlist data from API:", wishlistData);
                    
                    const wishlistDetailsPromises = wishlistData.map(item => 
                        fetch(`${process.env.REACT_APP_BACKEND_URL}/gameDetails?id=${item.game_id}`)
                            .then(res => {
                                if (!res.ok) throw new Error(`Failed to fetch game ${item.game_id}`);
                                return res.json();
                            })
                            .then(game => ({ ...game, id: item.game_id }))
                    );
                    
                    const wishlistDetails = await Promise.all(wishlistDetailsPromises);
                    setWishlistItems(wishlistDetails);
                    setWishlistError(null);
                    
                    const history = JSON.parse(localStorage.getItem(`history_${userId}`)) || [];
                    setHistoryItems(history);
                    
                } catch (err) {
                    console.error("Error fetching user data:", err);
                    setWishlistError(err.message);
                } finally {
                    setIsWishlistLoading(false);
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

    const clearWishlist = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId || wishlistItems.length === 0) return;
        
        setIsWishlistLoading(true);
        try {
            const deletePromises = wishlistItems.map(item => 
                fetch(`${process.env.REACT_APP_BACKEND_URL}/userWishlist?userID=${userId}&gameID=${item.id}`, {
                    method: 'DELETE'
                })
            );
            
            await Promise.all(deletePromises);
            setWishlistItems([]);
            
        } catch (err) {
            console.error("Error clearing wishlist:", err);
            setWishlistError(err.message);
        } finally {
            setIsWishlistLoading(false);
        }
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
                        {wishlistError && (
                            <p className="error-message">Error loading wishlist: {wishlistError}</p>
                        )}
                        
                        {isWishlistLoading ? (
                            <p>Loading wishlist...</p>
                        ) : wishlistItems.length > 0 ? (
                            wishlistItems.map((game, i) => <p key={i}>{game.name}</p>)
                        ) : (
                            <p>No games in wishlist yet.</p>
                        )}
                        
                        {wishlistItems.length > 0 && (
                            <button 
                                onClick={clearWishlist} 
                                className="clear-button"
                                disabled={isWishlistLoading}
                            >
                                {isWishlistLoading ? 'Clearing...' : 'Clear Wishlist'}
                            </button>
                        )}
                    </div>

                    <div className="history-box">
                        <h2>Games played</h2>
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