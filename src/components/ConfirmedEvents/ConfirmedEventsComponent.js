import { API_URL, customFetch } from '../../services/ApiService';
import './ConfirmedEventsComponent.css';

export const renderConfirmedEvents = async () => {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        return;
    }

    const token = localStorage.getItem('token');
    const endpoint = 'https://planner-backend-puce.vercel.app/api/v1/users/profile';

    try {
        const events = await customFetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        contentDiv.innerHTML = '';

        const header = document.createElement('h2');
        header.textContent = 'Eventos Confirmados';
        contentDiv.appendChild(header);

        if (events.length === 0) {
            const noEventsMessage = document.createElement('p');
            noEventsMessage.textContent = 'No tienes eventos confirmados.';
            contentDiv.appendChild(noEventsMessage);
        } else {
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'events-container';

            events.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'event-card';

                const title = document.createElement('h3');
                title.textContent = event.title;
                eventDiv.appendChild(title);

                const date = document.createElement('p');
                const eventDate = new Date(event.date);
                date.textContent = `Fecha: ${eventDate.toLocaleDateString()} ${eventDate.toLocaleTimeString()}`;
                eventDiv.appendChild(date);

                if (event.imageUrl) {
                    const img = document.createElement('img');
                    img.src = event.imageUrl;
                    img.alt = 'Imagen del evento';
                    img.className = 'event-image';
                    eventDiv.appendChild(img);
                }

                eventsContainer.appendChild(eventDiv);
            });

            contentDiv.appendChild(eventsContainer);
        }
    } catch (error) {
        console.error('Error en la solicitud de eventos confirmados:', error);
        const errorContainer = document.createElement('p');
        errorContainer.textContent = 'No se pudieron cargar los eventos confirmados.';
        contentDiv.appendChild(errorContainer);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderConfirmedEvents();
});