import { confirmAttendance, cancelAttendance, deleteEvent } from '../services/EventService.js';
import { API_URL } from '../services/ApiService.js';

export const renderEvents = async () => {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        return;
    }

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    try {
        const response = await fetch(`${API_URL}/events`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const events = await response.json();

        contentDiv.innerHTML = '';

        const header = document.createElement('h2');
        header.textContent = 'Eventos Disponibles';
        contentDiv.appendChild(header);

        events.forEach(event => {
            const eventDiv = document.createElement('div');

            const title = document.createElement('h3');
            title.textContent = event.title;
            eventDiv.appendChild(title);

            const description = document.createElement('p');
            description.textContent = event.description;
            eventDiv.appendChild(description);

            const date = document.createElement('p');
            const eventDate = new Date(event.date);
            date.textContent = `Fecha: ${eventDate.toLocaleDateString()} ${eventDate.toLocaleTimeString()}`;
            eventDiv.appendChild(date);

            const attendantsCount = document.createElement('p');
            attendantsCount.textContent = `Asistentes: ${event.attendantsCount}`;
            eventDiv.appendChild(attendantsCount);

            if (event.imageUrl) {
                const img = document.createElement('img');
                img.src = event.imageUrl;
                img.alt = 'Imagen del evento';
                img.style.maxWidth = '300px';
                img.style.height = 'auto';
                img.onerror = () => {
                    img.src = 'path/to/default-image.jpg';
                };
                eventDiv.appendChild(img);
            }

            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = 'Confirmar Asistencia';
            confirmBtn.addEventListener('click', () => confirmAttendance(event._id));
            eventDiv.appendChild(confirmBtn);

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancelar Asistencia';
            cancelBtn.style.display = 'none';
            cancelBtn.addEventListener('click', () => cancelAttendance(event._id));
            eventDiv.appendChild(cancelBtn);

            if (role === 'admin') {
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Eliminar Evento';
                deleteBtn.addEventListener('click', () => deleteEvent(event._id));
                eventDiv.appendChild(deleteBtn);
            }

            if (event.attendants && event.attendants.some(attendant => attendant._id === userId)) {
                confirmBtn.style.display = 'none';
                cancelBtn.style.display = 'inline';
            }

            contentDiv.appendChild(eventDiv);
        });
    } catch (error) {
        console.log('Error al cargar eventos:', error);
    }
};
