import { renderHome } from '../HomeComponent/HomeComponent';

export const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    renderHome();
};
