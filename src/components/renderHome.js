import { appDiv } from "../../main";
import { renderLogin } from "./login";
import { renderRegister } from "./register";

export const renderHome = () => {
    appDiv.innerHTML = '';
  
    const title = document.createElement('h1');
    title.textContent = 'Bienvenido a la SPA de Eventos';
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