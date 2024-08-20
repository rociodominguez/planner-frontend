import { confirmAttendance } from "./src/components/confirmAttendance";
import { handleCreateEvent, renderCreateEvent } from "./src/components/createEvent";
import { deleteEvent } from "./src/components/deleteEvent";
import { handleLogout } from "./src/components/handleLogout";
import { handleLogin, renderLogin } from "./src/components/login";
import { handleRegister, renderRegister } from "./src/components/register";
import { renderConfirmedEvents } from "./src/components/renderConfirmedEvents";
import { renderDashboard } from "./src/components/renderDashboard";
import { renderEvents } from "./src/components/renderEvents";
import { renderHome } from "./src/components/renderHome";
import { handleUpdateProfile, renderProfile } from "./src/components/renderProfile";
import "./style.css";

export const API_URL = 'http://localhost:8080/api/v1';
export const appDiv = document.getElementById('app');

renderHome()

renderRegister()

handleRegister()

renderLogin()

handleLogin()
  
renderDashboard()

renderEvents()

confirmAttendance()

deleteEvent()

renderConfirmedEvents()

renderProfile()

handleUpdateProfile()

renderCreateEvent()

handleCreateEvent()
  
handleLogout()

renderHome();