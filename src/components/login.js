import { API_URL, appDiv } from "../../main";
import { renderDashboard } from "./renderDashboard";

export const renderLogin = () => {
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
    `;
  
    appDiv.appendChild(form);
  
    form.addEventListener('submit', handleLogin);
  };
  
export const handleLogin = async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
    
      try {
        const response = await fetch(`${API_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userName: username, password })
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log('Datos de login:', data);
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          localStorage.setItem('username', username);
          renderDashboard();
        } else {
          const errorData = await response.json();
          console.error(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
      }
    };