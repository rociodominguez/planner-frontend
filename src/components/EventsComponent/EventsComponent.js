import { confirmAttendance, cancelAttendance, deleteEvent } from '../../services/EventService.js';
import { API_URL, customFetch } from '../../services/ApiService.js';
import './EventsComponent.css';

export const renderEvents = async () => {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        return;
    }

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    try {
        const events = await customFetch(`${API_URL}/events`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });

        contentDiv.innerHTML = '';

        const header = document.createElement('h2');
        header.textContent = 'Eventos Disponibles';
        contentDiv.appendChild(header);

        const eventCardsContainer = document.createElement('div');
        eventCardsContainer.className = 'event-cards-container';

        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';

            const img = document.createElement('img');
            img.src = event.imageUrl || '/error.png';
            img.alt = 'Imagen del evento';
            img.onerror = () => {
                img.src = 'path/to/default-image.jpg';
            };

            const cardContent = document.createElement('div');
            cardContent.className = 'event-card-content';

            const title = document.createElement('h3');
            title.textContent = event.title;
            cardContent.appendChild(title);

            const description = document.createElement('p');
            description.textContent = event.description;
            cardContent.appendChild(description);

            const date = document.createElement('p');
            const eventDate = new Date(event.date);
            date.textContent = `Fecha: ${eventDate.toLocaleDateString()} ${eventDate.toLocaleTimeString()}`;
            cardContent.appendChild(date);

            const attendantsCount = document.createElement('p');
            attendantsCount.textContent = `Asistentes: ${event.attendantsCount}`;
            cardContent.appendChild(attendantsCount);

            eventCard.appendChild(img);
            eventCard.appendChild(cardContent);

            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = 'Confirmar Asistencia';
            confirmBtn.className = 'event-confirm-btn';
            confirmBtn.addEventListener('click', () => confirmAttendance(event._id));
            eventCard.appendChild(confirmBtn);

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancelar Asistencia';
            cancelBtn.className = 'event-cancel-btn';
            cancelBtn.style.display = 'none';
            cancelBtn.addEventListener('click', () => cancelAttendance(event._id));
            eventCard.appendChild(cancelBtn);

            if (role === 'admin') {
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Eliminar Evento';
                deleteBtn.className = 'event-delete-btn';
                deleteBtn.addEventListener('click', () => deleteEvent(event._id));
                eventCard.appendChild(deleteBtn);
            }

            if (event.attendants && event.attendants.some(attendant => attendant._id === userId)) {
                confirmBtn.style.display = 'none';
                cancelBtn.style.display = 'inline';
            }

            eventCardsContainer.appendChild(eventCard);
        });

        contentDiv.appendChild(eventCardsContainer);
    } catch (error) {
        console.log('Error al cargar eventos:', error);
    }
};