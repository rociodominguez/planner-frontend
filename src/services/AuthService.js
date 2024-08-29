import { API_URL, customFetch } from '../services/ApiService';

export const registerUser = async (username, email, password) => {
    try {
        const response = await customFetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: username, email, password })
        });

        return response;
    } catch (error) {
        console.error('Error en la solicitud de registro:', error);
        throw error;
    }
};

export const loginUser = async (username, password) => {
    try {
        const response = await customFetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: username, password })
        });

        return response;
    } catch (error) {
        console.error('Error en la solicitud de inicio de sesión:', error);
        throw error;
    }
};
