import { API_URL, appDiv } from "../../main";
import { renderDashboard } from "./renderDashboard";

export const renderProfile = () => {
    appDiv.innerHTML = '';
  
    const header = document.createElement('h2');
    header.textContent = 'Perfil';
    appDiv.appendChild(header);
  
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
  
    // const userInfo = document.createElement('p');
    // userInfo.textContent = `Nombre de usuario: ${username} - Email: ${email}`;
    // appDiv.appendChild(userInfo);
  
    const form = document.createElement('form');
    form.id = 'updateProfileForm';
  
    form.innerHTML = `
      <label>Nombre de usuario: <input type="text" id="updateUsername" value="${username}" /></label>
      <button type="submit">Actualizar</button>
    `;
  
    appDiv.appendChild(form);
  
    form.addEventListener('submit', handleUpdateProfile);
  
    const backButton = document.createElement('button');
    backButton.textContent = 'Volver';
    backButton.id = 'backButton';
    appDiv.appendChild(backButton);
  
    backButton.addEventListener('click', renderDashboard);
};

export const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const username = document.getElementById('updateUsername').value;
  //   const email = document.getElementById('updateEmail').value;
  
    const token = localStorage.getItem('token');
  
    try {
      const response = await fetch(`${API_URL}/users/${localStorage.getItem('userId')}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userName: username })
      });
  
      if (response.ok) {
        localStorage.setItem('username', username);
      //   localStorage.setItem('email', email);
        renderProfile();
      } else {
        const errorData = await response.json();
        console.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
  };
  