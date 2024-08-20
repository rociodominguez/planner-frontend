export const renderEvents = async () => {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
      console.error('El contenedor de contenido no se encontró.');
      return;
    }
  
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/events`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  
    const events = await response.json();
  
    contentDiv.innerHTML = '';
  
    const header = document.createElement('h2');
    header.textContent = 'Eventos Disponibles';
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
  
      const attendantsCount = document.createElement('p');
      attendantsCount.textContent = `Asistentes: ${event.attendantsCount}`;
      eventDiv.appendChild(attendantsCount);
  
      const confirmBtn = document.createElement('button');
      confirmBtn.textContent = 'Confirmar Asistencia';
      confirmBtn.addEventListener('click', () => confirmAttendance(event._id));
      eventDiv.appendChild(confirmBtn);
  
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Eliminar Evento';
      deleteBtn.addEventListener('click', () => deleteEvent(event._id));
      eventDiv.appendChild(deleteBtn);
  
      contentDiv.appendChild(eventDiv);
    });
  };