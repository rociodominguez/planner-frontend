import { API_URL } from '../services/ApiService';

export const registerUser = async (username, email, password) => {
    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: username, email, password })
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Error en el registro');
        }
    } catch (error) {
        console.error('Error en la solicitud de registro:', error);
    }
};

export const loginUser = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: username, password })
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Error en el inicio de sesión');
        }
    } catch (error) {
        console.error('Error en la solicitud de inicio de sesión:', error);
    }
};

