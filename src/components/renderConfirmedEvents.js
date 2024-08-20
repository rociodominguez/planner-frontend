import { API_URL } from "../../main";

export const renderConfirmedEvents = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('No estás autenticado.');
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP ${response.status}: ${errorText}`);
      }
  
      const events = await response.json();
  
      if (!Array.isArray(events)) {
        throw new Error('La respuesta de la API no es un array.');
      }
  
      const contentDiv = document.getElementById('content');
      if (!contentDiv) {
        console.error('El contenedor de contenido no se encontró.');
        return;
      }
  
      contentDiv.innerHTML = '';
  
      const header = document.createElement('h2');
      header.textContent = 'Eventos Confirmados';
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
  
        contentDiv.appendChild(eventDiv);
      });
    } catch (error) {
      console.error('Error al renderizar eventos confirmados:', error);
    }
  };