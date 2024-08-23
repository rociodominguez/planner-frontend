import { renderLogin } from './LoginComponent.js';
import { API_URL } from '../services/ApiService.js';

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

export const renderRegister = () => {
    const appDiv = document.getElementById('app');
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
