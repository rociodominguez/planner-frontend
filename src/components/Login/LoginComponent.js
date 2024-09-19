import { API_URL, customFetch } from '../../services/ApiService.js';
import { renderDashboard } from '../Dashboard/DashboardComponent.js';
import { renderRegister } from '../Register/RegisterComponent.js';
import './LoginComponent.css';

const handleLogin = async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const errorDiv = document.getElementById('loginError');
    const loaderDiv = document.getElementById('loginLoader');

    errorDiv.classList.remove('show');
    errorDiv.textContent = ''; 
    loaderDiv.style.display = 'block';

    if (!username || !password) {
        loaderDiv.style.display = 'none';
        errorDiv.textContent = 'Por favor, ingresa tu nombre de usuario y contraseña.';
        errorDiv.classList.add('show');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ userName: username, password })
        });

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error en el inicio de sesión');
        }

        const data = await response.json();
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', username);
        localStorage.setItem('userId', data.userId);

        renderDashboard();
    } catch (error) {
        loaderDiv.style.display = 'none';

        // Mostrar el mensaje de error específico
        errorDiv.textContent = error.message || 'Ocurrió un error al intentar iniciar sesión. Por favor, intenta de nuevo.';
        errorDiv.classList.add('show');
        console.log('Error en la solicitud de inicio de sesión:', error);
    } finally {
        loaderDiv.style.display = 'none';
    }
};


export const renderLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
        renderDashboard();
        return;
    }

    const appDiv = document.getElementById('app');
    appDiv.innerHTML = '';

    const form = document.createElement('form');
    form.className = 'form';

    form.innerHTML = `
        <p class="form-title">Accede a tu cuenta</p>
        <div class="input-container">
            <input placeholder="Usuario" type="text" id="username"/>
            <span>
                <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                </svg>
            </span>
        </div>
        <div class="input-container">
            <input placeholder="Contraseña" type="password" id="password"/>
            <span>
                <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
                </svg>
            </span>
        </div>
        <button class="submit" type="submit">Acceder</button>
        <div id="loginLoader" class="loader" style="display: none;">
            <img src="/loader.gif" alt="Cargando..." style="width: 30px; height: 30px;">
        </div>
        <div id="loginError" class="error-message"></div>
        <p class="signup-link">
            ¿Aún no tienes cuenta?
            <a href="#" id="signUpLink">Regístrate</a>
        </p>
    `;

    appDiv.appendChild(form);
    form.addEventListener('submit', handleLogin);

    document.getElementById('signUpLink').addEventListener('click', (e) => {
        e.preventDefault();
        renderRegister();
    });
};
