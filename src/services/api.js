import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // URL du backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Gérer les erreurs globalement
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Déconnexion si le token est invalide
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data?.message || 'Erreur serveur');
    }
);

export default api;