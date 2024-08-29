import { renderLogin } from '../Login/LoginComponent.js';
import { API_URL, customFetch } from '../../services/ApiService.js';
import './RegisterComponent.css';
import { renderHome } from '../HomeComponent/HomeComponent.js';

const handleRegister = async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('registerError');
    const loaderDiv = document.getElementById('registerLoader');

    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.classList.remove('show');
    }

    
    if (!username || !email || !password) {
        errorDiv.textContent = 'Todos los campos son obligatorios.';
        errorDiv.classList.add('show');
        return;
    }

    if (!validateEmail(email)) {
        errorDiv.textContent = 'Email no válido.';
        errorDiv.classList.add('show');
        return;
    }

    loaderDiv.style.display = 'block'; 

    try {
        const response = await customFetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: username, email, password })
        });

      
        if (response.ok) {
            renderLogin(); 
        } else {
            const errorData = await response.json();
            errorDiv.textContent = errorData.message || 'Error desconocido durante el registro.';
            errorDiv.classList.add('show');
        }
    } catch (error) {
        errorDiv.textContent = `Error: ${error.message}`;
        errorDiv.classList.add('show');
        console.log('Error en la solicitud de registro:', error);
    } finally {
        loaderDiv.style.display = 'none'; 
    }
};

const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
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
        <div id="registerLoader" class="loader" style="display: none;">
            <img src="/loader.gif" alt="Cargando..." style="width: 30px; height: 30px;">
        </div>
        <div id="registerError" class="error-message"></div> <!-- Div para mostrar errores -->
        <button type="button" id="backToHome">Volver al Menú Principal</button>
    `;

    appDiv.appendChild(form);
    form.addEventListener('submit', handleRegister);

    document.getElementById('backToHome').addEventListener('click', renderHome);
};
