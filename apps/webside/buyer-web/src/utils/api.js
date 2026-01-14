import axios from 'axios';

// const API_URL = 'http://localhost:5500/api'; 
// Use IP if testing from other devices, but localhost is fine for web on same machine.
// Ideally usage env variable.
const API_URL = 'https://demo.ranx24.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If it's a full URL checking if it matches our "uploads" pattern
    // If it is from our server (even with old IP), force it to current API_URL
    if (imagePath.includes('/uploads/')) {
        // Extract relative path after /uploads/
        const relativePath = imagePath.split('/uploads/')[1];
        if (relativePath) {
            const host = 'https://demo.ranx24.com';
            return `${host}/uploads/${relativePath}`;
        }
    }

    if (imagePath.startsWith('http')) return imagePath;

    const host = 'https://demo.ranx24.com';
    // Ensure path starts with /
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${host}${cleanPath}`;
};

export default api;
