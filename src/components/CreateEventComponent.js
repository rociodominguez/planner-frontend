import { API_URL } from '../services/ApiService';
import { renderEvents } from './EventsComponent';

const handleCreateEvent = async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const imageUrl = document.getElementById('imageUrl').value;

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, date, imageUrl })
        });

        if (response.ok) {
            renderEvents();
        } else {
            console.log('Error al crear evento:', await response.text());
        }
    } catch (error) {
        console.log('Error en la solicitud de creación de evento:', error);
    }
};

export const renderCreateEvent = () => {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = '';

    const header = document.createElement('h2');
    header.textContent = 'Crear Evento';
    appDiv.appendChild(header);

    const form = document.createElement('form');
    form.id = 'createEventForm';

    form.innerHTML = `
        <label>Título: <input type="text" id="title" /></label>
        <label>Descripción: <textarea id="description"></textarea></label>
        <label>Fecha y hora: <input type="datetime-local" id="date" /></label>
        <label>Imagen URL: <input type="text" id="imageUrl" /></label>
        <button type="submit">Crear Evento</button>
    `;

    appDiv.appendChild(form);

    form.addEventListener('submit', handleCreateEvent);
};

