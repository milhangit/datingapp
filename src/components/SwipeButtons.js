import React from 'react';
import './SwipeButtons.css';
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';
import StarRateIcon from '@mui/icons-material/StarRate';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import IconButton from '@mui/material/IconButton';

function SwipeButtons({ tinderCardsRef }) {
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

    return (
        <div className="swipeButtons">
            <IconButton className="swipeButtons__repeat" disabled>
                <ReplayIcon fontSize="large" />
            </IconButton>
            <IconButton className="swipeButtons__left" onClick={handleSwipeLeft}>
                <CloseIcon fontSize="large" />
            </IconButton>
            <IconButton className="swipeButtons__star" disabled>
                <StarRateIcon fontSize="large" />
            </IconButton>
            <IconButton className="swipeButtons__right" onClick={handleSwipeRight}>
                <FavoriteIcon fontSize="large" />
            </IconButton>
            <IconButton className="swipeButtons__lightning" disabled>
                <FlashOnIcon fontSize="large" />
            </IconButton>
        </div>
    )
}

export default SwipeButtons
