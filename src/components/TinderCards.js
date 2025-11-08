import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useUser } from '../context/UserContext';
import './TinderCards.css';

const TinderCards = forwardRef((props, ref) => {
    const { currentUser, calculateMatchPercentage, handleSwipeRight } = useUser();

    const [people] = useState([
        {
            id: 1,
            name: 'Sanjana Fernando',
            age: 26,
            religion: 'Buddhist',
            education: "Bachelor's",
            occupation: 'Teacher',
            city: 'Colombo',
            state: 'Western',
            diet: 'Vegetarian',
            interests: ['Reading', 'Yoga', 'Travel', 'Music'],
            url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600'
        },
        {
            id: 2,
            name: 'Nimal Perera',
            age: 29,
            religion: 'Buddhist',
            education: "Master's",
            occupation: 'Software Engineer',
            city: 'Kandy',
            state: 'Central',
            diet: 'Non-Vegetarian',
            interests: ['Sports', 'Gaming', 'Travel', 'Photography'],
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'
        },
        {
            id: 3,
            name: 'Kavitha Silva',
            age: 25,
            religion: 'Hindu',
            education: "Bachelor's",
            occupation: 'Doctor',
            city: 'Colombo',
            state: 'Western',
            diet: 'Vegetarian',
            interests: ['Dancing', 'Music', 'Cooking', 'Reading'],
            url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600'
        },
        {
            id: 4,
            name: 'Roshan De Silva',
            age: 31,
            religion: 'Christian',
            education: "Master's",
            occupation: 'Engineer',
            city: 'Galle',
            state: 'Southern',
            diet: 'Non-Vegetarian',
            interests: ['Sports', 'Movies', 'Fitness', 'Travel'],
            url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600'
        },
        {
            id: 5,
            name: 'Amaya Jayawardena',
            age: 27,
            religion: 'Buddhist',
            education: "Bachelor's",
            occupation: 'Accountant',
            city: 'Colombo',
            state: 'Western',
            diet: 'Vegetarian',
            interests: ['Photography', 'Art', 'Travel', 'Yoga'],
            url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600'
        },
        {
            id: 6,
            name: 'Kasun Rajapaksa',
            age: 30,
            religion: 'Buddhist',
            education: "Master's",
            occupation: 'Business',
            city: 'Colombo',
            state: 'Western',
            diet: 'Non-Vegetarian',
            interests: ['Fitness', 'Business', 'Travel', 'Movies'],
            url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600'
        },
        {
            id: 7,
            name: 'Dilini Wijesinghe',
            age: 24,
            religion: 'Christian',
            education: "Bachelor's",
            occupation: 'Nurse',
            city: 'Negombo',
            state: 'Western',
            diet: 'Non-Vegetarian',
            interests: ['Music', 'Cooking', 'Dancing', 'Reading'],
            url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600'
        },
        {
            id: 8,
            name: 'Ashan Fernando',
            age: 28,
            religion: 'Muslim',
            education: "Master's",
            occupation: 'Lawyer',
            city: 'Colombo',
            state: 'Western',
            diet: 'Non-Vegetarian',
            interests: ['Reading', 'Sports', 'Travel', 'Photography'],
            url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600'
        }
    ]);

    const [currentIndex, setCurrentIndex] = useState(people.length - 1);
    const [swipedCards, setSwipedCards] = useState([]);

    const swipe = (direction) => {
        console.log('Swiping ' + direction + ' on index: ' + currentIndex);

        if (currentIndex >= 0 && currentIndex < people.length) {
            const currentPerson = people[currentIndex];

            // Track right swipes for potential matches
            if (direction === 'right') {
                handleSwipeRight(currentPerson.id);
            }

            setSwipedCards([...swipedCards, { index: currentIndex, direction }]);

            setTimeout(() => {
                setCurrentIndex(prev => prev - 1);
            }, 600);
        }
    };

    useImperativeHandle(ref, () => ({
        swipe
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
                {currentIndex < 0 && (
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
