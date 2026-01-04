import axios from 'axios';

// Utilise l'URL de production si disponible
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Ajouter le token à chaque requête
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
