import { API_URL } from "../../main";
import { renderEvents } from "./renderEvents";

export const deleteEvent = async (eventId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  
    if (response.ok) {
      renderEvents();
    } else {
      console.error('Error al eliminar evento.');
    }
  };