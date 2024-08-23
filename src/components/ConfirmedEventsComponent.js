import { API_URL } from '../services/ApiService';

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
                const ul = document.createElement('ul');
                events.forEach(event => {
                    const li = document.createElement('li');
                    li.textContent = event.title;
                    ul.appendChild(li);
                });
                contentDiv.appendChild(ul);
            }
        } else {
            console.log('Error al cargar eventos confirmados:', await response.text());
        }
    } catch (error) {
        console.log('Error en la solicitud de eventos confirmados:', error);
    }
};
