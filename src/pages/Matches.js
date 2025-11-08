import React from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './Matches.css';

function Matches() {
    const { matches, currentUser } = useUser();
    const navigate = useNavigate();

    // Sample matched users data (in real app, this would come from backend)
    const matchedUsers = [
        {
            id: 1,
            name: 'Sanjana Fernando',
            age: 26,
            religion: 'Buddhist',
            occupation: 'Teacher',
            city: 'Colombo',
            url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
            matchPercentage: 85
        },
        {
            id: 3,
            name: 'Kavitha Silva',
            age: 25,
            religion: 'Hindu',
            occupation: 'Doctor',
            city: 'Colombo',
            url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600',
            matchPercentage: 78
        },
        {
            id: 5,
            name: 'Amaya Jayawardena',
            age: 27,
            religion: 'Buddhist',
            occupation: 'Accountant',
            city: 'Colombo',
            url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
            matchPercentage: 92
        }
    ];

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
