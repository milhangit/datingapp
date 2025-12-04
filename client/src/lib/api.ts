export const api = {
    auth: {
        login: (phoneNumber: string) => fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber })
        }).then(r => r.json()),

        verify: (phoneNumber: string, otp: string) => fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber, otp })
        }).then(r => r.json()),

        me: () => fetch('/api/auth/me').then(r => r.json()),
    },

    profiles: {
        feed: () => fetch('/api/profiles/feed').then(r => r.json()),
    },

    actions: {
        swipe: (targetId: number, direction: 'left' | 'right') => fetch('/api/actions/swipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetId, direction })
        }).then(r => r.json()),
    },

    admin: {
        stats: () => fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(r => r.json()),
        users: (page = 1) => fetch(`/api/admin/users?page=${page}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(r => r.json()),
        action: (userId: number, action: string, value?: any) => fetch(`/api/admin/user/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ action, value })
        }).then(r => r.json()),
    }
};
