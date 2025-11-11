import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './SwipeButtons.css';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';

function SwipeButtons({ tinderCardsRef }) {
    const navigate = useNavigate();
    const { currentUser } = useUser();

    const handleSwipeLeft = () => {
        if (tinderCardsRef.current) {
            tinderCardsRef.current.swipe('left');
        }
    };

    const handleSwipeRight = () => {
        if (tinderCardsRef.current) {
            tinderCardsRef.current.swipe('right');
        }
    };

    const handleChat = () => {
        // Get current person from TinderCards
        if (tinderCardsRef.current) {
            const currentPerson = tinderCardsRef.current.getCurrentPerson();

            if (currentPerson) {
                // If not logged in, redirect to registration first
                if (!currentUser) {
                    navigate('/register');
                } else {
                    // Navigate to chat with this person
                    navigate(`/chat/${currentPerson.id}`);
                }
            }
        }
    };

    return (
        <div className="swipeButtons">
            <IconButton className="swipeButtons__left" onClick={handleSwipeLeft}>
                <CloseIcon fontSize="large" />
            </IconButton>
            <IconButton className="swipeButtons__chat" onClick={handleChat}>
                <ChatIcon fontSize="large" />
            </IconButton>
            <IconButton className="swipeButtons__right" onClick={handleSwipeRight}>
                <FavoriteIcon fontSize="large" />
            </IconButton>
        </div>
    )
}

export default SwipeButtons
