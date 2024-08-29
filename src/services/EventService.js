import { renderEvents } from '../components/EventsComponent/EventsComponent';
import { API_URL, customFetch } from '../services/ApiService';

export const confirmAttendance = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
        await customFetch(`${API_URL}/events/${eventId}/attendants`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        renderEvents(); 
    } catch (error) {
        console.log('Error al confirmar la asistencia:', error);
    }
};

export const cancelAttendance = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
        await customFetch(`${API_URL}/events/${eventId}/attendants`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: localStorage.getItem('userId') })
        });

        renderEvents();  
    } catch (error) {
        console.log('Error al cancelar la asistencia:', error);
    }
};

export const deleteEvent = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
        await customFetch(`${API_URL}/events/${eventId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        renderEvents(); 
    } catch (error) {
        console.log('Error al eliminar el evento:', error);
    }
};
