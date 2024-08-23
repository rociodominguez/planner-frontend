import { API_URL } from '../services/ApiService.js';
import { renderEvents } from './EventsComponent.js';

export const renderProfile = async () => {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        return;
    }

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const profile = await response.json();

            contentDiv.innerHTML = '';

            const form = document.createElement('form');
            form.id = 'updateProfileForm';
            form.innerHTML = `
                <label>
                    Nuevo Nombre de usuario:
                    <input type="text" id="newUsername" value="${profile.username || ''}" />
                </label>
                <button type="submit">Actualizar Nombre de Usuario</button>
            `;

            contentDiv.appendChild(form);

            form.addEventListener('submit', handleUpdateProfile);
        } else {
            console.log('Error al cargar perfil:', await response.text());
        }
    } catch (error) {
        console.log('Error en la solicitud de perfil:', error);
    }
};

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