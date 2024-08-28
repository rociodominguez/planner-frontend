import { API_URL, customFetch } from '../../services/ApiService.js';
import { renderEvents } from '../EventsComponent/EventsComponent.js';
import './ProfileComponent.css'

export const renderProfile = async () => {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        return;
    }

    const token = localStorage.getItem('token');
    try {
        const profile = await customFetch(`${API_URL}/users/profile`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        contentDiv.innerHTML = '';

        const form = document.createElement('form');
        form.id = 'updateProfileForm';
        form.innerHTML = `
            <label>
                Nuevo nombre de usuario:
                <input type="text" id="newUsername" value="${profile.username || ''}" />
            </label>
            <button type="submit">Actualizar</button>
        `;

        contentDiv.appendChild(form);

        form.addEventListener('submit', handleUpdateProfile);
    } catch (error) {
        console.log('Error al cargar perfil:', error);
    }
};

export const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const newUsername = document.getElementById('newUsername').value;

    const token = localStorage.getItem('token');
    try {
        const response = await customFetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName: newUsername })
        });

        localStorage.setItem('username', newUsername);
        await renderEvents(); 
    } catch (error) {
        console.log('Error al actualizar el nombre de usuario:', error);
    }
};