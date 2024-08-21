import "./style.css";

const API_URL = 'http://localhost:8080/api/v1';
const appDiv = document.getElementById('app');

const renderHome = () => {
  appDiv.innerHTML = '';

  const title = document.createElement('h1');
  title.textContent = 'Bienvenido a la SPA de Eventos';
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
      localStorage.setItem('rol', data.rol);
      localStorage.setItem('username', username);
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
      const rol = localStorage.getItem('rol');
      console.log('Rol actual:', rol);
      if (rol !== 'admin') {
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
      }
    });

    if (response.ok) {
      alert('Asistencia confirmada.');
      renderEvents();
    } else {
      alert('Error al confirmar asistencia.');
    }
  } catch (error) {
    console.error('Error al confirmar asistencia:', error);
  }
};

const renderConfirmedEvents = async () => {
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      console.error('Token no encontrado en el almacenamiento local');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8080/api/v1/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error en la respuesta de la red: ${response.statusText}`);
      }
  
      const events = await response.json();
      if (!Array.isArray(events)) {
        throw new Error('La respuesta no es una lista de eventos');
      }
  
      const eventsList = document.getElementById('eventsList');
      if (eventsList) {
        eventsList.innerHTML = events.map(event => `<li>${event.title} - ${event.date}</li>`).join('');
      } else {
        console.error('Elemento de lista de eventos no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener eventos confirmados:', error);
    }
};

const renderProfile = async () => {
  const contentDiv = document.getElementById('content');
  if (!contentDiv) {
    console.error('El contenedor de contenido no se encontró.');
    return;
  }

  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/users/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const user = await response.json();

  contentDiv.innerHTML = '';

  const header = document.createElement('h2');
  header.textContent = 'Perfil';
  contentDiv.appendChild(header);

  const username = document.createElement('p');
  username.textContent = `Nombre de usuario: ${user.userName}`;
  contentDiv.appendChild(username);

  const email = document.createElement('p');
  email.textContent = `Email: ${user.email}`;
  contentDiv.appendChild(email);

  const profileImage = document.createElement('img');
  profileImage.src = user.profileImageUrl || 'default-profile.png';
  profileImage.alt = 'Imagen de perfil';
  profileImage.style.width = '100px';
  profileImage.style.height = '100px';
  contentDiv.appendChild(profileImage);
};

const renderCreateEvent = () => {
  appDiv.innerHTML = '';

  const header = document.createElement('h2');
  header.textContent = 'Crear Evento';
  appDiv.appendChild(header);

  const form = document.createElement('form');
  form.id = 'createEventForm';

  form.innerHTML = `
    <label>Título: <input type="text" id="title" /></label>
    <label>Descripción: <textarea id="description"></textarea></label>
    <label>Fecha y hora: <input type="datetime-local" id="date" /></label>
    <button type="submit">Crear Evento</button>
  `;

  appDiv.appendChild(form);

  form.addEventListener('submit', handleCreateEvent);
};

const handleCreateEvent = async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, date })
    });

    if (response.ok) {
      alert('Evento creado con éxito.');
      renderDashboard();
    } else {
      alert('Error al crear el evento.');
    }
  } catch (error) {
    console.error('Error al crear el evento:', error);
  }
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('rol'); // Asegúrate de eliminar 'rol' también
  localStorage.removeItem('username');
  renderHome();
};

renderHome();
