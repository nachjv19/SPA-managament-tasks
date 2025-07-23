// 📁 src/js/dashboard.js
import { getUsername, getUserRole } from './session.js';

export function initDashboard() {
  const container = document.querySelector('#dashboard');
  if (!container) return;

  const username = getUsername();
  const role = getUserRole();

  container.innerHTML = `
    <div class="text-center space-y-4">
      <h2 class="text-2xl font-bold text-gray-800">Bienvenido, ${username}</h2>
      <p class="text-gray-600">Estás logueado como <span class="font-semibold">${role}</span></p>

      <div class="mt-4 space-x-4">
        <a href="#/stock" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Admin Eventos</a>
        <a href="#/purchases" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Admin Users</a>
        ${
          role === 'admin'
            ? `<a href="#/admin-products" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Gestionar Solicitudes</a>`
            : ''
        }
      </div>
    </div>
  `;
}
