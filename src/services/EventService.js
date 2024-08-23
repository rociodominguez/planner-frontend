import { renderEvents } from '../components/EventsComponent';
import { API_URL } from '../services/ApiService';

export const confirmAttendance = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/events/${eventId}/attendants`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (response.ok) {
            renderEvents();
        } else {
            console.log('Error al confirmar la asistencia:', await response.text());
        }
    } catch (error) {
        console.log('Error en la solicitud de confirmación de asistencia:', error);
    }
};

export const cancelAttendance = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/events/${eventId}/attendants`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: localStorage.getItem('userId') })
        });

        if (response.ok) {
            renderEvents();
        } else {
            console.log('Error al cancelar la asistencia:', await response.text());
        }
    } catch (error) {
        console.log('Error en la solicitud de cancelación de asistencia:', error);
    }
};

export const deleteEvent = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/events/${eventId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            renderEvents();
        } else {
            console.log('Error al eliminar el evento:', await response.text());
        }
    } catch (error) {
        console.log('Error en la solicitud de eliminación de evento:', error);
    }
};
