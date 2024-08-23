import { renderEvents } from './EventsComponent.js';
import { API_URL } from '../services/ApiService.js';

export const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const newUsername = document.getElementById('newUsername').value;

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName: newUsername })
        });

        if (response.ok) {
            localStorage.setItem('username', newUsername);
            renderEvents();

            renderProfile();
        } else {
            console.log('Error al actualizar el nombre de usuario:', await response.text());
        }
    } catch (error) {
        console.log('Error en la solicitud de actualización de perfil:', error);
    }
};
