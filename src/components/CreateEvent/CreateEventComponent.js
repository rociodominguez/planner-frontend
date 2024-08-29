import { API_URL, customFetch } from '../../services/ApiService'; 
import { renderEvents } from '../EventsComponent/EventsComponent';
import './CreateEventComponent.css';

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
    const errorDiv = document.getElementById('error');
    const submitButton = document.getElementById('submitButton');

    if (loadingDiv) loadingDiv.style.display = 'block';
    if (errorDiv) errorDiv.style.display = 'none';
    if (submitButton) submitButton.disabled = true;

    try {
        if (!title || !description || !date || !imageFile) {
            throw new Error('Todos los campos son obligatorios. Asegúrate de completar todos los campos.');
        }

        await customFetch(`${API_URL}/events`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        });

        await renderEvents();
    } catch (error) {
        if (errorDiv) {
            if (error.message.includes('obligatorios')) {
                errorDiv.textContent = 'Todos los campos son obligatorios. Por favor, completa todos los campos y vuelve a intentarlo.';
            } else if (error.message.includes('Imagen')) {
                errorDiv.textContent = 'La imagen debe estar en un formato aceptable. Verifica el archivo y vuelve a intentarlo.';
            } else {
                errorDiv.textContent = `Error al crear el evento: ${error.message || 'Por favor, intenta de nuevo más tarde.'}`;
            }
            errorDiv.style.display = 'block';
        }
    } finally {
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (submitButton) submitButton.disabled = false;
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
        <label>Imagen: <input type="file" id="imageUrl" /></label>
        <button type="submit" id="submitButton">Crear Evento</button>
    `;

    contentDiv.appendChild(form);

    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.style.display = 'none'; 
    loadingDiv.innerHTML = '<img src="/loader.gif" alt="Cargando...">'; 
    contentDiv.appendChild(loadingDiv);

    const errorDiv = document.createElement('div');
    errorDiv.id = 'error';
    errorDiv.className = 'error-message';
    errorDiv.style.display = 'none'; 
    contentDiv.appendChild(errorDiv);

    form.addEventListener('submit', handleCreateEvent);
};
