// API service for backend communication
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

class ApiService {
  // User registration
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // User login
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Get all users for browsing/swiping
  async getUsers(currentUserId = null) {
    try {
      const url = currentUserId
        ? `${API_BASE_URL}/users?userId=${currentUserId}`
        : `${API_BASE_URL}/users`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  // Record a swipe
  async swipe(userId, targetUserId, direction) {
    try {
      const response = await fetch(`${API_BASE_URL}/swipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          targetUserId,
          direction,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Swipe failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Swipe error:', error);
      throw error;
    }
  }

  // Get user's matches
  async getMatches(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/matches/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      return await response.json();
    } catch (error) {
      console.error('Get matches error:', error);
      throw error;
    }
  }

  // Send a message
  async sendMessage(senderId, recipientId, message) {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId,
          recipientId,
          message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  // Get conversation between two users
  async getMessages(userId, partnerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${userId}/${partnerId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      return await response.json();
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  }
}

export default new ApiService();
