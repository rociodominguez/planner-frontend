import { API_URL, appDiv } from "../../main";
import { renderLogin } from "./login";

export const renderRegister = () => {
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
  
export const handleRegister = async (e) => {
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
        console.error('Error en el registro.');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };