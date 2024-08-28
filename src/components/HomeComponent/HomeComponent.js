import { renderRegister } from '../Register/RegisterComponent.js';
import { renderLogin } from '../Login/LoginComponent.js';
import './HomeComponent.css';

export const renderHome = () => {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = '';

    const title = document.createElement('h1');
    title.textContent = '¡Bienvenido!';
    appDiv.appendChild(title);

    const description = document.createElement('p');
    description.textContent = 'MyPlanner te permite gestionar tus eventos, confirmaciones y más. Regístrate o inicia sesión para comenzar.';
    appDiv.appendChild(description);


    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const registerBtn = document.createElement('button');
    registerBtn.textContent = 'Registro';
    registerBtn.id = 'registerBtn';
    buttonContainer.appendChild(registerBtn);

    const loginBtn = document.createElement('button');
    loginBtn.textContent = 'Iniciar Sesión';
    loginBtn.id = 'loginBtn';
    buttonContainer.appendChild(loginBtn);

    appDiv.appendChild(buttonContainer);

    registerBtn.addEventListener('click', renderRegister);
    loginBtn.addEventListener('click', renderLogin);
};
