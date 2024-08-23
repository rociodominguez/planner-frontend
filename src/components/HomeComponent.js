import { renderRegister } from './RegisterComponent.js';
import { renderLogin } from './LoginComponent.js';

export const renderHome = () => {
    const appDiv = document.getElementById('app');
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
