import { renderHome } from "./renderHome";

export const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    renderHome();
  };