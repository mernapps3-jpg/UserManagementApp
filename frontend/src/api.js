import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5001',
    headers: { 'Content-Type': 'application/json' }
});

// Request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

        // Only treat as network error if there's truly no response
        // If there's a response (even error status), it's not a network error
        if (!error.response) {
            // Check for CORS errors
            if (error.message && (error.message.includes('CORS') || error.message.includes('cors'))) {
                error.response = {
                    data: {
                        message: `CORS Error: The backend is blocking requests from this origin. 
                        Please check backend/.env CLIENT_ORIGIN matches: ${window.location.origin}
                        Current frontend URL: ${window.location.origin}`
                    },
                    status: 0
                };
            }
            // True network/connection errors
            else if (error.code === 'ECONNREFUSED' || error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
                error.response = {
                    data: {
                        message: `Cannot connect to server at ${baseURL}. 

Troubleshooting:
1. Verify backend is running: Check terminal for "🚀 Server running on port..."
2. Test connection: Open ${baseURL}/api/health in your browser
3. Check port: Backend should be on port 5000 (or check backend/.env PORT)
4. Check CORS: backend/.env CLIENT_ORIGIN should be: ${window.location.origin}
5. Restart both servers if needed`
                    },
                    status: 0
                };
            }
        }
        // If error.response exists, it's a server error (not network error)
        // Let it pass through with original error data
        return Promise.reject(error);
    }
);

export default api;
