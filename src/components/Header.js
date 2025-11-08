import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import "./Header.css";
import PersonIcon from '@mui/icons-material/Person';
import ForumIcon from '@mui/icons-material/Forum';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';

function Header() {
    const navigate = useNavigate();
    const { currentUser } = useUser();

    return (
        <div className="header">
            <IconButton onClick={() => navigate(currentUser ? '/profile' : '/register')}>
                <PersonIcon fontSize="large" className="header__icon" />
            </IconButton>
            <Link to="/">
                <img
                    className="header__logo"
                    src="/logo192.png"
                    alt="lanka love logo"
                />
            </Link>
            <div className="header__actions">
                <IconButton onClick={() => navigate('/matches')}>
                    <FavoriteIcon fontSize="large" className="header__icon" />
                </IconButton>
                <IconButton onClick={() => navigate('/matches')}>
                    <ForumIcon fontSize="large" className="header__icon" />
                </IconButton>
            </div>
        </div>
    )
}

export default Header
