import { renderEvents } from './EventsComponent.js';
import { renderConfirmedEvents } from './ConfirmedEventsComponent.js';
import { renderProfile } from './ProfileComponent.js';
import { renderCreateEvent } from './CreateEventComponent.js';
import { handleLogout } from './LogoutComponent.js';

export const renderDashboard = async () => {
    const appDiv = document.getElementById('app');
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

    renderEvents();
};
