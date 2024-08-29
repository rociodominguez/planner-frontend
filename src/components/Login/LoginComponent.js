import { API_URL, customFetch } from '../../services/ApiService.js';
import { renderDashboard } from '../Dashboard/DashboardComponent.js';
import { renderHome } from '../HomeComponent/HomeComponent.js';
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
        const data = await customFetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ userName: username, password })
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', username);
        localStorage.setItem('userId', data.userId);

        renderDashboard();
    } catch (error) {
        loaderDiv.style.display = 'none';

        if (error.message.includes('401')) {
            errorDiv.textContent = 'Nombre de usuario o contraseña incorrectos. Verifica tus credenciales e intenta nuevamente.';
        } else if (error.message.includes('404')) {
            errorDiv.textContent = 'No se encontró una cuenta con ese nombre de usuario. Por favor, verifica e intenta de nuevo.';
        } else if (error.message.includes('500')) {
            errorDiv.textContent = 'Hubo un problema con el servidor. Por favor, intenta nuevamente más tarde.';
        } else {
            errorDiv.textContent = 'Ocurrió un error al intentar iniciar sesión. Por favor, intenta de nuevo.';
        }

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

    const header = document.createElement('h2');
    header.textContent = 'Iniciar Sesión';
    appDiv.appendChild(header);

    const form = document.createElement('form');
    form.id = 'loginForm';

    form.innerHTML = `
        <label>Nombre de usuario: <input type="text" id="username" /></label>
        <label>Contraseña: <input type="password" id="password" /></label>
        <button type="submit">Iniciar Sesión</button>
        <div id="loginLoader" class="loader" style="display: none;">
            <img src="/loader.gif" alt="Cargando..." style="width: 30px; height: 30px;">
        </div>
        <div id="loginError" class="error-message"></div>
        <button type="button" id="backToHome">Volver al Menú Principal</button>
    `;

    appDiv.appendChild(form);
    form.addEventListener('submit', handleLogin);

    document.getElementById('backToHome').addEventListener('click', renderHome);
};
