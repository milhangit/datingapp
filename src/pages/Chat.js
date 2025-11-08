import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import './Chat.css';

function Chat() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { currentUser, getConversation, sendMessage } = useUser();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    // Sample user data (in real app, this would come from backend)
    const chatUser = {
        id: parseInt(userId),
        name: 'Sanjana Fernando',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600'
    };

    useEffect(() => {
        if (currentUser) {
            const conversation = getConversation(parseInt(userId));
            setMessages(conversation);
        }
    }, [currentUser, userId, getConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && currentUser) {
            sendMessage(parseInt(userId), message.trim());
            const newMessage = {
                id: Date.now(),
                senderId: currentUser.id,
                text: message.trim(),
                timestamp: Date.now()
            };
            setMessages([...messages, newMessage]);
            setMessage('');
        }
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

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

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
