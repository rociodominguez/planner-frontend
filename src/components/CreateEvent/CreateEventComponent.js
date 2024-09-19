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
        // Validaciones
        if (!title || !description || !date || !imageFile) {
            throw new Error('Campos vacíos');
        }

        // Validación de formato de imagen
        const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedFormats.includes(imageFile.type)) {
            throw new Error('Imagen no válida');
        }

        const eventDate = new Date(date);
        const currentDate = new Date();
        if (eventDate < currentDate) {
            throw new Error('Fecha no válida');
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
            switch (error.message) {
                case 'Campos vacíos':
                    errorDiv.textContent = 'Todos los campos son obligatorios. Por favor, completa todos los campos y vuelve a intentarlo.';
                    break;
                case 'Imagen no válida':
                    errorDiv.textContent = 'La imagen debe ser en formato JPEG, PNG o GIF. Por favor, selecciona un archivo válido.';
                    break;
                case 'Fecha no válida':
                    errorDiv.textContent = 'La fecha del evento debe ser una fecha futura. Por favor, selecciona una fecha válida.';
                    break;
                default:
                    errorDiv.textContent = `Error al crear el evento.`
                    break;
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

    const today = new Date().toISOString().split('T')[0];

    form.innerHTML = `
        <label>Título: <input type="text" id="title" required /></label>
        <label>Descripción: <textarea id="description" required></textarea></label>
        <label>Fecha y hora: <input type="datetime-local" id="date" min="${today}T00:00" required /></label>
        <label>Imagen: <input type="file" id="imageUrl" accept="image/jpeg, image/png, image/gif" required /></label>
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
