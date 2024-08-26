import { API_URL } from '../services/ApiService';
import { renderEvents } from './EventsComponent';
import './CreateEventComponent.css'

const handleCreateEvent = async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const imageFile = document.getElementById('imageUrl').files[0];

    const token = localStorage.getItem('token');

    const formData = new FormData(); 
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('imageUrl', imageFile);


    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.style.display = 'block';
    }

    try {
        const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        });

        if (response.ok) {
            await renderEvents();
        } else {
            console.log('Error al crear evento:', await response.text());
        }
    } catch (error) {
        console.log('Error en la solicitud de creación de evento:', error);
    } finally {
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
    }
};


export const renderCreateEvent = () => {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';

    const header = document.createElement('h2');
    header.textContent = 'Crear Evento';
    contentDiv.appendChild(header);

    const form = document.createElement('form');
    form.id = 'createEventForm';

    form.innerHTML = `
        <label>Título: <input type="text" id="title" /></label>
        <label>Descripción: <textarea id="description"></textarea></label>
        <label>Fecha y hora: <input type="datetime-local" id="date" /></label>
        <label>Imagen: <input type="file" id="imageUrl" /></label> <!-- Cambiado a type="file" -->
        <button type="submit">Crear Evento</button>
    `;

    contentDiv.appendChild(form);

    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.style.display = 'none'; 
    loadingDiv.innerHTML = '<img src="/loader.gif" alt="Cargando...">'; 
    contentDiv.appendChild(loadingDiv);

    form.addEventListener('submit', handleCreateEvent);
};
