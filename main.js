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
            console.log('Error en el registro:', await response.text());
        }
    } catch (error) {
        console.log('Error en la solicitud de registro:', error);
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
        <div id="loginError" class="error-message"></div>
    `;

    appDiv.appendChild(form);

    form.addEventListener('submit', handleLogin);
};

const handleLogin = async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const errorDiv = document.getElementById('loginError');
    errorDiv.classList.remove('show');

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
            errorDiv.textContent = `Error: ${errorData.error}`;
            errorDiv.classList.add('show'); 
        }
    } catch (error) {
        errorDiv.textContent = 'Error al iniciar sesión. Por favor, intenta de nuevo.';
        errorDiv.classList.add('show');
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
            const role = localStorage.getItem('role');
            if (role !== 'admin') {
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
        return;
    }

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    
    try {
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

            if (event.imageUrl) {
                const img = document.createElement('img');
                img.src = event.imageUrl;
                img.alt = 'Imagen del evento';
                img.style.maxWidth = '300px';
                img.style.height = 'auto';
                img.onerror = () => {
                    img.src = 'path/to/default-image.jpg';
                };
                eventDiv.appendChild(img);
            }

            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = 'Confirmar Asistencia';
            confirmBtn.addEventListener('click', () => confirmAttendance(event._id));
            eventDiv.appendChild(confirmBtn);

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancelar Asistencia';
            cancelBtn.style.display = 'none';
            cancelBtn.addEventListener('click', () => cancelAttendance(event._id));
            eventDiv.appendChild(cancelBtn);

            if (role === 'admin') {
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Eliminar Evento';
                deleteBtn.addEventListener('click', () => deleteEvent(event._id));
                eventDiv.appendChild(deleteBtn);
            }

            if (event.attendants && event.attendants.some(attendant => attendant._id === userId)) {
                confirmBtn.style.display = 'none';
                cancelBtn.style.display = 'inline';
            }

            contentDiv.appendChild(eventDiv);
        });
    } catch (error) {
        console.log('Error al cargar eventos:', error);
    }
};

const cancelAttendance = async (eventId) => {
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
            renderEvents();
        } else {
            console.log('Error al confirmar la asistencia:', await response.text());
        }
    } catch (error) {
        console.log('Error en la solicitud de confirmación de asistencia:', error);
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
            renderEvents();
        } else {
            console.log('Error al eliminar el evento:', await response.text());
        }
    } catch (error) {
        console.log('Error en la solicitud de eliminación de evento:', error);
    }
};

const renderConfirmedEvents = async () => {
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

const renderProfile = async () => {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        return;
    }

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const profile = await response.json();
            
            contentDiv.innerHTML = '';

            const header = document.createElement('h2');
            header.textContent = 'Perfil';
            contentDiv.appendChild(header);

            const username = document.createElement('p');
            username.textContent = `Nombre de usuario: ${profile.userName}`;
            contentDiv.appendChild(username);

            const email = document.createElement('p');
            email.textContent = `Email: ${profile.email}`;
            contentDiv.appendChild(email);

            const role = document.createElement('p');
            role.textContent = `Rol: ${profile.role}`;
            contentDiv.appendChild(role);
        } else {
            console.log('Error al cargar perfil:', await response.text());
        }
    } catch (error) {
        console.log('Error en la solicitud de perfil:', error);
    }
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
        <label>Imagen URL: <input type="text" id="imageUrl" /></label>
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
    const imageUrl = document.getElementById('imageUrl').value;

    const token = localStorage.getItem('token');
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
            renderEvents();
        } else {
            console.log('Error al crear evento:', await response.text());
        }
    } catch (error) {
        console.log('Error en la solicitud de creación de evento:', error);
    }
};

const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    renderHome();
};

renderHome();
