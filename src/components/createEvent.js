import { API_URL, appDiv } from "../../main";
import { renderDashboard } from "./renderDashboard";

export const renderCreateEvent = () => {
    appDiv.innerHTML = '';
  
    const header = document.createElement('h2');
    header.textContent = 'Crear Evento';
    appDiv.appendChild(header);
  
    const form = document.createElement('form');
    form.id = 'createEventForm';
  
    form.innerHTML = `
      <label>Título: <input type="text" id="title" /></label>
      <label>Descripción: <textarea id="description"></textarea></label>
      <label>Fecha: <input type="date" id="date" /></label> <!-- Cambiado a solo fecha -->
      <button type="submit">Crear Evento</button>
    `;
  
    appDiv.appendChild(form);
  
    form.addEventListener('submit', handleCreateEvent);
  };
  
export const handleCreateEvent = async (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const date = document.getElementById('date').value;
    
      const token = localStorage.getItem('token');
      console.log('Token de autenticación:', token);
    
      try {
        const response = await fetch(`${API_URL}/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ title, description, date })
        });
    
        console.log('Respuesta del servidor:', response);
        if (response.ok) {
          renderDashboard();
        } else {
          const errorData = await response.json();
          console.error('Error al crear el evento:', errorData);
        }
      } catch (error) {
        console.error('Error al crear el evento:', error);
      }
  };