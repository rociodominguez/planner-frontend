import "./style.css";

const API_URL = 'http://localhost:8080/api/v1';
const appDiv = document.getElementById('app');

const renderHome = () => {
    appDiv.innerHTML = '';

    const title = document.createElement('h1');
    title.textContent = 'Bienvenido';
    appDiv.appendChild(title);

    const registerBtn = document.createElement('button');
    registerBtn.textContent = 'Registro';
    registerBtn.id = 'registerBtn';
    appDiv.appendChild(registerBtn);

    const loginBtn = document.createElement('button');
    loginBtn.textContent = 'Iniciar Sesión';
    loginBtn.id = 'loginBtn';
    appDiv.appendChild(loginBtn);

    registerBtn.addEventListener('click', renderRegister);
    loginBtn.addEventListener('click', renderLogin);
};

const renderRegister = () => {
    appDiv.innerHTML = '';

    const header = document.createElement('h2');
    header.textContent = 'Registro';
    appDiv.appendChild(header);

    const form = document.createElement('form');
    form.id = 'registerForm';

    form.innerHTML = `
        <label>Nombre de usuario: <input type="text" id="username" /></label>
        <label>Email: <input type="email" id="email" /></label>
        <label>Contraseña: <input type="password" id="password" /></label>
        <button type="submit">Registrar</button>
    `;

    appDiv.appendChild(form);

    form.addEventListener('submit', handleRegister);
};

const handleRegister = async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: username, email, password })
        });

        if (response.ok) {
            renderLogin();
        } else {
            console.error('Error en el registro.');
        }
    } catch (error) {
        console.error('Error en el registro:', error);
    }
};

const renderLogin = () => {
    appDiv.innerHTML = '';

    const header = document.createElement('h2');
    header.textContent = 'Iniciar Sesión';
    appDiv.appendChild(header);

    const form = document.createElement('form');
    form.id = 'loginForm';

    form.innerHTML = `
        <label>Nombre de usuario: <input type="text" id="username" /></label>
        <label>Contraseña: <input type="password" id="password" /></label>
        <button type="submit">Iniciar Sesión</button>
    `;

    appDiv.appendChild(form);

    form.addEventListener('submit', handleLogin);
};

const handleLogin = async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
      const response = await fetch(`${API_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userName: username, password })
      });

      if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          localStorage.setItem('username', username);
          localStorage.setItem('userId', data.userId);
          renderDashboard();
      } else {
          const errorData = await response.json();
          console.error(`Error: ${errorData.error}`);
      }
  } catch (error) {
      console.error('Error al iniciar sesión:', error);
  }
};

const renderDashboard = async () => {
    appDiv.innerHTML = '';

    const header = document.createElement('h2');
    header.textContent = 'Dashboard';
    appDiv.appendChild(header);

    const userInfo = document.createElement('p');
    const username = localStorage.getItem('username');
    userInfo.textContent = `🟢 ${username ? username : 'No estás logueado'}`;
    appDiv.appendChild(userInfo);

    const nav = document.createElement('nav');
    const ul = document.createElement('ul');

    const menuItems = [
        { id: 'eventsLink', text: 'Eventos Disponibles' },
        { id: 'confirmedEventsLink', text: 'Eventos Confirmados' },
        { id: 'profileLink', text: 'Perfil' },
        { id: 'createEventLink', text: 'Crear Evento', adminOnly: true }
    ];

    menuItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.id = item.id;
        a.textContent = item.text;

        if (item.adminOnly) {
            console.log('Verificando rol para:', item.id);
            const role = localStorage.getItem('role');
            console.log('Rol actual:', role); 
            if (role !== 'admin') {
                console.log('No es admin. Omite el enlace:', item.id);
                return;
            }
        }

        li.appendChild(a);
        ul.appendChild(li);
    });

    nav.appendChild(ul);
    appDiv.appendChild(nav);

    const contentDiv = document.createElement('div');
    contentDiv.id = 'content';
    appDiv.appendChild(contentDiv);

    document.getElementById('eventsLink').addEventListener('click', renderEvents);
    document.getElementById('confirmedEventsLink').addEventListener('click', renderConfirmedEvents);
    document.getElementById('profileLink').addEventListener('click', renderProfile);
    const createEventLink = document.getElementById('createEventLink');
    if (createEventLink) {
        createEventLink.addEventListener('click', renderCreateEvent);
    }

    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logoutBtn';
    logoutBtn.textContent = 'Cerrar Sesión';
    appDiv.appendChild(logoutBtn);
    logoutBtn.addEventListener('click', handleLogout);
};

const renderEvents = async () => {
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
  console.log('Eventos:', events); // Verifica que los eventos tienen imageUrl

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

      // Agregar la imagen si existe
      if (event.imageUrl) {
          const img = document.createElement('img');
          img.src = event.imageUrl;
          img.alt = 'Imagen del evento';
          img.style.maxWidth = '300px'; // Ajusta el tamaño según sea necesario
          img.style.height = 'auto'; // Mantener la relación de aspecto
          img.onerror = () => {
              img.src = 'path/to/default-image.jpg'; // Ruta a una imagen por defecto si la imagen falla
              console.error('Error al cargar la imagen:', event.imageUrl);
          };
          eventDiv.appendChild(img);
      }

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

const confirmAttendance = async (eventId) => {
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
          alert('Asistencia confirmada.');
          renderEvents();
      } else {
          const errorData = await response.json();
          console.error('Error al confirmar asistencia:', errorData.error);
      }
  } catch (error) {
      console.error('Error al confirmar asistencia:', error);
  }
};

const deleteEvent = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/events/${eventId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Evento eliminado.');
            renderEvents();
        } else {
            console.error('Error al eliminar el evento.');
        }
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
    }
};

const renderConfirmedEvents = async () => {
  const contentDiv = document.getElementById('content');
  if (!contentDiv) {
    console.error('El contenedor de contenido no se encontró.');
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
          li.textContent = `${event.title} - ${new Date(event.date).toLocaleDateString()}`;
          ul.appendChild(li);
        });
        contentDiv.appendChild(ul);
      }
    } else {
      console.error('Error al obtener los eventos confirmados.');
    }
  } catch (error) {
    console.error('Error al cargar los eventos confirmados:', error);
  }
};

const renderProfile = () => {
  const contentDiv = document.getElementById('content');
  if (!contentDiv) {
      console.error('El contenedor de contenido no se encontró.');
      return;
  }

  contentDiv.innerHTML = '';

  const header = document.createElement('h2');
  header.textContent = 'Perfil de Usuario';
  contentDiv.appendChild(header);

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const form = document.createElement('form');
  form.id = 'profileForm';

  form.innerHTML = `
      <label><strong>Nombre de usuario:</strong> <input type="text" id="editUsername" value="${username}" /></label>
      <button type="submit">Guardar Cambios</button>
  `;

  contentDiv.appendChild(form);

  form.addEventListener('submit', handleUpdateProfile);
};

const handleUpdateProfile = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const username = document.getElementById('editUsername').value;

  if (!userId) {
      console.error('ID de usuario no encontrado en el localStorage.');
      return;
  }

  try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
          method: 'PUT',
          headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userName: username })
      });

      if (response.ok) {
          const updatedUser = await response.json();
          localStorage.setItem('username', updatedUser.userName);
          alert('Nombre de usuario actualizado con éxito.');
          renderEvents();
      } else {
          const errorData = await response.json();
          console.error('Error al actualizar el perfil:', errorData.error);
      }
  } catch (error) {
      console.error('Error al actualizar el perfil:', error);
  }
};

const renderCreateEvent = () => {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        console.error('El contenedor de contenido no se encontró.');
        return;
    }

    contentDiv.innerHTML = '';

    const header = document.createElement('h2');
    header.textContent = 'Crear Evento';
    contentDiv.appendChild(header);

    const form = document.createElement('form');
    form.id = 'createEventForm';

    form.innerHTML = `
        <label>Título: <input type="text" id="title" /></label>
        <label>Descripción: <textarea id="description"></textarea></label>
        <label>Fecha y Hora: <input type="datetime-local" id="date" /></label>
        <label>Imagen URL: <input type="text" id="imageUrl" /></label>
        <button type="submit">Crear Evento</button>
    `;

    contentDiv.appendChild(form);

    form.addEventListener('submit', handleCreateEvent);
};

const handleCreateEvent = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;
  const imageUrl = document.getElementById('imageUrl').value;

  try {
      const response = await fetch(`${API_URL}/events`, {
          method: 'POST',
          headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, description, date, imageUrl })
      });

      if (response.ok) {
          alert('Evento creado.');
          renderEvents();
      } else {
          console.error('Error al crear el evento.');
      }
  } catch (error) {
      console.error('Error al crear el evento:', error);
  }
};

const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    renderHome();
};

document.addEventListener('DOMContentLoaded', renderHome);
