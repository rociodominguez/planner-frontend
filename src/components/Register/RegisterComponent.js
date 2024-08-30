import { renderLogin } from '../Login/LoginComponent.js';
import { API_URL, customFetch } from '../../services/ApiService.js';
import './RegisterComponent.css';

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

    // Validaciones
    if (!username) {
        errorDiv.textContent = 'Por favor, ingresa un nombre de usuario.';
        errorDiv.classList.add('show');
        return;
    }

    if (!email) {
        errorDiv.textContent = 'Por favor, ingresa tu correo electrónico.';
        errorDiv.classList.add('show');
        return;
    }

    if (!password) {
        errorDiv.textContent = 'Por favor, ingresa una contraseña.';
        errorDiv.classList.add('show');
        return;
    }

    if (!validateEmail(email)) {
        errorDiv.textContent = 'El formato del correo electrónico es incorrecto. Asegúrate de que tenga el formato correcto: ejemplo@dominio.com';
        errorDiv.classList.add('show');
        return;
    }

    loaderDiv.style.display = 'block';

    try {
        const responseData = await customFetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: username, email, password })
        });

        if (responseData.error) {
            errorDiv.textContent = `Error: ${responseData.error.message}`;
            errorDiv.classList.add('show');
            return;
        }

        renderLogin();

    } catch (error) {
        errorDiv.textContent = 'Hubo un problema al intentar registrarte. Por favor, intenta de nuevo más tarde.';
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

    const form = document.createElement('form');
    form.className = 'form';  

    form.innerHTML = `
        <p class="form-title">Crea tu cuenta</p>
        <div class="input-container">
            <input placeholder="Usuario" type="text" id="username" />
            <span>
                <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                </svg>
            </span>
        </div>
        <div class="input-container">
            <input placeholder="Correo electrónico" type="email" id="email" />
            <span>
                <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                </svg>
            </span>
        </div>
        <div class="input-container">
            <input placeholder="Contraseña" type="password" id="password" />
            <span>
                <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                </svg>
            </span>
        </div>
        <button class="submit" type="submit">Regístrate</button>
        <div id="registerLoader" class="loader" style="display: none;">
            <img src="/loader.gif" alt="Cargando..." style="width: 30px; height: 30px;">
        </div>
        <div id="registerError" class="error-message"></div>
        <p class="signup-link">
            ¿Ya tienes una cuenta?
            <a href="#" id="backToLogin">Acceder</a>
        </p>
    `;

    appDiv.appendChild(form);
    form.addEventListener('submit', handleRegister);

    document.getElementById('backToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        renderLogin();
    });
};
