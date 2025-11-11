import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import './TinderCards.css';

const TinderCards = forwardRef((props, ref) => {
    const { currentUser, calculateMatchPercentage, handleSwipeRight } = useUser();
    const navigate = useNavigate();

    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [swipedCards, setSwipedCards] = useState([]);
    const [hasSwipedOnce, setHasSwipedOnce] = useState(false);

    // Fetch users from database
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                const userId = currentUser?.id || null;
                const users = await api.getUsers(userId);

                // Parse interests if stored as JSON string
                const parsedUsers = users.map(user => ({
                    ...user,
                    interests: typeof user.interests === 'string'
                        ? JSON.parse(user.interests)
                        : user.interests,
                    url: user.photo || 'https://via.placeholder.com/600'
                }));

                setPeople(parsedUsers);
                setCurrentIndex(parsedUsers.length - 1);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentUser]);

    const swipe = async (direction) => {
        console.log('Swiping ' + direction + ' on index: ' + currentIndex);

        // Check if this is the first swipe without registration
        if (!currentUser && !hasSwipedOnce) {
            setHasSwipedOnce(true);
            // Redirect to registration after first swipe
            setTimeout(() => {
                navigate('/register');
            }, 700);
        }

        if (currentIndex >= 0 && currentIndex < people.length) {
            const currentPerson = people[currentIndex];

            // Save swipe to database (only if logged in)
            if (currentUser) {
                try {
                    const result = await api.swipe(currentUser.id, currentPerson.id, direction);

                    // Check if it's a match
                    if (result.match) {
                        console.log('It\'s a match!', result);
                        // You can add a match notification here
                    }
                } catch (err) {
                    console.error('Error recording swipe:', err);
                }
            }

            // Track right swipes for potential matches
            if (direction === 'right' && currentUser) {
                handleSwipeRight(currentPerson.id);
            }

            setSwipedCards([...swipedCards, { index: currentIndex, direction }]);

            setTimeout(() => {
                setCurrentIndex(prev => prev - 1);
            }, 600);
        }
    };

    const getCurrentPerson = () => {
        if (currentIndex >= 0 && currentIndex < people.length) {
            return people[currentIndex];
        }
        return null;
    };

    useImperativeHandle(ref, () => ({
        swipe,
        getCurrentPerson
    }));

    const handleCardClick = (e, index) => {
        if (index !== currentIndex) return;

        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const cardWidth = rect.width;

        if (clickX < cardWidth / 2) {
            swipe('left');
        } else {
            swipe('right');
        }
    };

    const getSwipeClass = (index) => {
        const swipedCard = swipedCards.find(s => s.index === index);
        if (swipedCard) {
            return `swipe-${swipedCard.direction}`;
        }
        return '';
    };

    if (loading) {
        return (
            <div className="tinderCards">
                <div className="tinderCards__cardContainer">
                    <div className="no-more-cards">
                        <h3>Loading profiles...</h3>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tinderCards">
                <div className="tinderCards__cardContainer">
                    <div className="no-more-cards">
                        <h3>Error loading profiles</h3>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="tinderCards">
            <div className="tinderCards__cardContainer">
                {people.map((person, index) => (
                    index <= currentIndex && (
                        <div
                            key={person.id}
                            className={`swipe ${index === currentIndex ? 'active' : ''} ${getSwipeClass(index)}`}
                            onClick={(e) => handleCardClick(e, index)}
                            style={{ zIndex: index }}
                        >
                            <div
                                style={{ backgroundImage: `url(${person.url})` }}
                                className="card"
                            >
                                {currentUser && (
                                    <div className="card__match">
                                        <span className="match__percentage">
                                            {calculateMatchPercentage(person)}% Match
                                        </span>
                                    </div>
                                )}
                                <div className="card__info">
                                    <h2>{person.name}</h2>
                                    <p>{person.age} years old • {person.religion}</p>
                                    <p>{person.occupation} • {person.city}</p>
                                    {person.education && <p>{person.education}</p>}
                                </div>
                            </div>
                        </div>
                    )
                ))}
                {currentIndex < 0 && people.length === 0 && (
                    <div className="no-more-cards">
                        <h3>No profiles available</h3>
                        <p>Check back later for new matches</p>
                    </div>
                )}
                {currentIndex < 0 && people.length > 0 && (
                    <div className="no-more-cards">
                        <h3>No more profiles!</h3>
                        <p>Check back later for new matches</p>
                    </div>
                )}
            </div>
        </div>
    )
});

export default TinderCards;
