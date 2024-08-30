import { renderEvents } from '../EventsComponent/EventsComponent.js';
import { renderConfirmedEvents } from '../ConfirmedEvents/ConfirmedEventsComponent.js';
import { renderProfile } from '../Profile/ProfileComponent.js';
import { renderCreateEvent } from '../CreateEvent/CreateEventComponent.js';
import { handleLogout } from '../Logout/LogoutComponent.js';
import './DashboardComponent.css';

export const renderDashboard = async () => {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = '';


    const bgDiv = document.createElement('div');
    bgDiv.className = 'bg-5';
    
    const heading = document.createElement('h1');
    heading.className = 'animated-shadow';
    heading.textContent = 'MyPlanner';
    
    bgDiv.appendChild(heading);
    appDiv.appendChild(bgDiv);
    
    

    const userInfo = document.createElement('p');
    const username = localStorage.getItem('username');
    userInfo.textContent = `🖐 Hola ${username ? username : 'No estás logueado'}`;
    appDiv.appendChild(userInfo);

    const nav = document.createElement('nav');
    const ul = document.createElement('ul');
    ul.classList.add('nav-menu');

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

    const logoutLi = document.createElement('li');
    const logoutLink = document.createElement('a');
    logoutLink.href = '#';
    logoutLink.id = 'logoutLink';
    logoutLink.textContent = 'Cerrar Sesión';
    logoutLi.appendChild(logoutLink);
    ul.appendChild(logoutLi);

    nav.appendChild(ul);
    appDiv.appendChild(nav);

    const contentDiv = document.createElement('div');
    contentDiv.id = 'content';
    appDiv.appendChild(contentDiv);

    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.style.display = 'none';
    loadingDiv.innerHTML = '<img src="/loader.gif" alt="Cargando...">';
    contentDiv.appendChild(loadingDiv);

    document.getElementById('eventsLink').addEventListener('click', async () => {
        loadingDiv.style.display = 'block';
        await renderEvents();
        loadingDiv.style.display = 'none';
    });
    
    document.getElementById('confirmedEventsLink').addEventListener('click', renderConfirmedEvents);
    document.getElementById('profileLink').addEventListener('click', renderProfile);

    const createEventLink = document.getElementById('createEventLink');
    if (createEventLink) {
        createEventLink.addEventListener('click', renderCreateEvent);
    }

    document.getElementById('logoutLink').addEventListener('click', handleLogout);

    loadingDiv.style.display = 'block';
    await renderEvents();
    loadingDiv.style.display = 'none';
};
