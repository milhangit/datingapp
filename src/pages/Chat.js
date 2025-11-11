import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import './Chat.css';

function Chat() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useUser();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    // Fetch chat user details and messages from database
    useEffect(() => {
        const fetchChatData = async () => {
            if (!currentUser || !userId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Fetch all users to get the chat partner's details
                const users = await api.getUsers();
                const partner = users.find(u => u.id === parseInt(userId));

                if (partner) {
                    setChatUser({
                        id: partner.id,
                        name: partner.name,
                        url: partner.photo || 'https://via.placeholder.com/600'
                    });
                }

                // Fetch messages
                const conversation = await api.getMessages(currentUser.id, parseInt(userId));

                // Transform messages to match expected format
                const transformedMessages = conversation.map(msg => ({
                    id: msg.id,
                    senderId: msg.senderId,
                    text: msg.message,
                    timestamp: new Date(msg.createdAt).getTime()
                }));

                setMessages(transformedMessages);
            } catch (err) {
                console.error('Error fetching chat data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChatData();
    }, [currentUser, userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (message.trim() && currentUser) {
            const messageText = message.trim();
            setMessage('');

            try {
                // Send message to database
                const result = await api.sendMessage(currentUser.id, parseInt(userId), messageText);

                // Add message to local state
                const newMessage = {
                    id: result.id,
                    senderId: currentUser.id,
                    text: messageText,
                    timestamp: new Date(result.createdAt).getTime()
                };
                setMessages(prevMessages => [...prevMessages, newMessage]);
            } catch (err) {
                console.error('Error sending message:', err);
                setMessage(messageText); // Restore message on error
                alert('Failed to send message. Please try again.');
            }
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    if (!currentUser) {
        return (
            <div className="chat">
                <div className="chat__empty">
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
            <div className="chat">
                <div className="chat__empty">
                    <h2>Loading chat...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="chat">
                <div className="chat__empty">
                    <h2>Error loading chat</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/matches')} className="btn btn__primary">
                        Back to Matches
                    </button>
                </div>
            </div>
        );
    }

    if (!chatUser) {
        return (
            <div className="chat">
                <div className="chat__empty">
                    <h2>User not found</h2>
                    <button onClick={() => navigate('/matches')} className="btn btn__primary">
                        Back to Matches
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="chat">
            <div className="chat__container">
                <div className="chat__header">
                    <IconButton onClick={() => navigate('/matches')} className="chat__back">
                        <ArrowBackIcon />
                    </IconButton>
                    <img src={chatUser.url} alt={chatUser.name} className="chat__avatar" />
                    <h2>{chatUser.name}</h2>
                </div>

                <div className="chat__messages">
                    {messages.length === 0 ? (
                        <div className="chat__welcome">
                            <p>Start your conversation with {chatUser.name}</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`chat__message ${
                                    msg.senderId === currentUser.id ? 'sent' : 'received'
                                }`}
                            >
                                <div className="message__bubble">
                                    <p>{msg.text}</p>
                                    <span className="message__time">{formatTime(msg.timestamp)}</span>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat__input" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="chat__textbox"
                    />
                    <IconButton type="submit" className="chat__send" disabled={!message.trim()}>
                        <SendIcon />
                    </IconButton>
                </form>
            </div>
        </div>
    );
}

export default Chat;
