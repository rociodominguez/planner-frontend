import { API_URL } from '../services/ApiService';
import './ConfirmedEventsComponent.css';

export const renderConfirmedEvents = async () => {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        return;
    }

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const events = await response.json();

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
        } else {
            console.log('Error al cargar eventos confirmados:', await response.text());
        }
    } catch (error) {
        console.log('Error en la solicitud de eventos confirmados:', error);
    }
};
