import { API_URL } from '../services/ApiService.js';
import { renderDashboard } from './DashboardComponent.js';

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

export const renderLogin = () => {
    const appDiv = document.getElementById('app');
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
