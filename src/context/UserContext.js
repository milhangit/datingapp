import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [matches, setMatches] = useState([]);
    const [rightSwipes, setRightSwipes] = useState([]);
    const [conversations, setConversations] = useState({});

    useEffect(() => {
        // Load from localStorage
        const savedUser = localStorage.getItem('currentUser');
        const savedMatches = localStorage.getItem('matches');
        const savedRightSwipes = localStorage.getItem('rightSwipes');
        const savedConversations = localStorage.getItem('conversations');

        if (savedUser) setCurrentUser(JSON.parse(savedUser));
        if (savedMatches) setMatches(JSON.parse(savedMatches));
        if (savedRightSwipes) setRightSwipes(JSON.parse(savedRightSwipes));
        if (savedConversations) setConversations(JSON.parse(savedConversations));
    }, []);

    const saveCurrentUser = (userData) => {
        setCurrentUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
    };

    const handleSwipeRight = (personId) => {
        const newRightSwipes = [...rightSwipes, personId];
        setRightSwipes(newRightSwipes);
        localStorage.setItem('rightSwipes', JSON.stringify(newRightSwipes));
        return newRightSwipes;
    };

    const checkMutualMatch = (personId, personRightSwipes) => {
        // Check if both users swiped right on each other
        if (rightSwipes.includes(personId) && personRightSwipes.includes(currentUser?.id)) {
            const newMatch = { userId: personId, timestamp: Date.now() };
            const updatedMatches = [...matches, newMatch];
            setMatches(updatedMatches);
            localStorage.setItem('matches', JSON.stringify(updatedMatches));
            return true;
        }
        return false;
    };

    const calculateMatchPercentage = (person) => {
        if (!currentUser) return 0;

        let score = 0;
        let totalWeight = 0;

        // Religion match (25% weight)
        if (currentUser.religion === person.religion) {
            score += 25;
        }
        totalWeight += 25;

        // Age compatibility (20% weight)
        const ageDiff = Math.abs(currentUser.age - person.age);
        if (ageDiff <= 2) {
            score += 20;
        } else if (ageDiff <= 5) {
            score += 15;
        } else if (ageDiff <= 8) {
            score += 10;
        }
        totalWeight += 20;

        // Education level (15% weight)
        if (currentUser.education === person.education) {
            score += 15;
        } else if (Math.abs(
            getEducationLevel(currentUser.education) - getEducationLevel(person.education)
        ) === 1) {
            score += 10;
        }
        totalWeight += 15;

        // Occupation field (10% weight)
        if (currentUser.occupation === person.occupation) {
            score += 10;
        }
        totalWeight += 10;

        // Interests match (15% weight)
        const commonInterests = currentUser.interests?.filter(
            interest => person.interests?.includes(interest)
        ).length || 0;
        const maxInterests = Math.max(
            currentUser.interests?.length || 1,
            person.interests?.length || 1
        );
        score += (commonInterests / maxInterests) * 15;
        totalWeight += 15;

        // Diet preference (5% weight)
        if (currentUser.diet === person.diet) {
            score += 5;
        }
        totalWeight += 5;

        // City/Location (10% weight)
        if (currentUser.city === person.city) {
            score += 10;
        } else if (currentUser.state === person.state) {
            score += 5;
        }
        totalWeight += 10;

        return Math.round((score / totalWeight) * 100);
    };

    const getEducationLevel = (education) => {
        const levels = {
            'High School': 1,
            'Diploma': 2,
            'Bachelor\'s': 3,
            'Master\'s': 4,
            'PhD': 5
        };
        return levels[education] || 3;
    };

    const sendMessage = (recipientId, message) => {
        const conversationKey = [currentUser.id, recipientId].sort().join('-');
        const newMessage = {
            id: Date.now(),
            senderId: currentUser.id,
            text: message,
            timestamp: Date.now()
        };

        const updatedConversations = {
            ...conversations,
            [conversationKey]: [...(conversations[conversationKey] || []), newMessage]
        };

        setConversations(updatedConversations);
        localStorage.setItem('conversations', JSON.stringify(updatedConversations));
    };

    const getConversation = (recipientId) => {
        const conversationKey = [currentUser.id, recipientId].sort().join('-');
        return conversations[conversationKey] || [];
    };

    const isMatched = (personId) => {
        return matches.some(match => match.userId === personId);
    };

    const value = {
        currentUser,
        saveCurrentUser,
        matches,
        rightSwipes,
        handleSwipeRight,
        checkMutualMatch,
        calculateMatchPercentage,
        sendMessage,
        getConversation,
        isMatched
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
