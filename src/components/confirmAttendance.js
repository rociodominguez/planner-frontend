import { API_URL } from "../../main";
import { renderEvents } from "./renderEvents";

export const confirmAttendance = async (eventId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/events/${eventId}/attend`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  
    if (response.ok) {
      renderEvents();
    } else {
      console.error('Error al confirmar asistencia.');
    }
  };