import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Matches.css';

function Matches() {
    const { currentUser, calculateMatchPercentage } = useUser();
    const navigate = useNavigate();

    const [matchedUsers, setMatchedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch matches from database
    useEffect(() => {
        const fetchMatches = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const matches = await api.getMatches(currentUser.id);

                // Parse interests and add photo URL
                const parsedMatches = matches.map(user => ({
                    ...user,
                    interests: typeof user.interests === 'string'
                        ? JSON.parse(user.interests)
                        : user.interests,
                    url: user.photo || 'https://via.placeholder.com/600',
                    matchPercentage: calculateMatchPercentage(user)
                }));

                setMatchedUsers(parsedMatches);
            } catch (err) {
                console.error('Error fetching matches:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [currentUser, calculateMatchPercentage]);

    const handleChatClick = (userId) => {
        navigate(`/chat/${userId}`);
    };

    if (!currentUser) {
        return (
            <div className="matches">
                <div className="matches__empty">
                    <h2>Please create your profile first</h2>
                    <button onClick={() => navigate('/register')} className="btn btn__primary">
                        Create Profile
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="matches">
                <div className="matches__empty">
                    <h2>Loading matches...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="matches">
                <div className="matches__empty">
                    <h2>Error loading matches</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="matches">
            <div className="matches__container">
                <h1>Your Matches</h1>
                <p className="matches__subtitle">
                    You have {matchedUsers.length} mutual {matchedUsers.length === 1 ? 'match' : 'matches'}
                </p>

                {matchedUsers.length === 0 ? (
                    <div className="matches__empty">
                        <h2>No matches yet</h2>
                        <p>Keep swiping to find your perfect match!</p>
                        <button onClick={() => navigate('/')} className="btn btn__primary">
                            Start Swiping
                        </button>
                    </div>
                ) : (
                    <div className="matches__grid">
                        {matchedUsers.map(user => (
                            <div key={user.id} className="match__card">
                                <div
                                    className="match__image"
                                    style={{ backgroundImage: `url(${user.url})` }}
                                >
                                    <div className="match__percentage">
                                        {user.matchPercentage}% Match
                                    </div>
                                </div>
                                <div className="match__details">
                                    <h3>{user.name}</h3>
                                    <p>{user.age} years • {user.religion}</p>
                                    <p>{user.occupation}</p>
                                    <p className="match__location">{user.city}</p>
                                </div>
                                <button
                                    className="match__chat-btn"
                                    onClick={() => handleChatClick(user.id)}
                                >
                                    Start Chat
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Matches;
