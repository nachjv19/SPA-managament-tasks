// 📁 src/components/navbar.js
import { clearSession, getUserRole, getUsername } from '../js/session.js';

export function loadNavbar() {
  const role = getUserRole();
  const username = getUsername();
  const container = document.querySelector('#navbar');
  if (!container) return;

  container.innerHTML = `
    <nav class="bg-gray-800 text-white px-6 py-4 flex flex-col sm:flex-row sm:justify-between items-center rounded shadow-md">
      <div class="flex items-center space-x-4 mb-2 sm:mb-0">
        <span class="text-xl font-bold text-yellow-400">VibrantApp</span>
        <span class="text-sm text-gray-200 hidden sm:inline">Hola, <strong>${username}</strong></span>
      </div>

      <div class="flex flex-wrap justify-center sm:justify-end gap-2">
        <a href="#/dashboard" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition">Inicio</a>
        <a href="#/stock" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition">Gestionar Eventos</a>
        <a href="#/purchases" class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition">Gestionar usuarios</a>
        ${
          role === 'admin'
            ? `<a href="#/admin-products" class="bg-yellow-400 text-black hover:bg-yellow-500 px-3 py-1 rounded transition">Gestionar Hosters</a>`
            : ''
        }
        <button id="logout" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition">Cerrar sesión</button>
      </div>
    </nav>
  `;

  document.querySelector('#logout')?.addEventListener('click', () => {
    clearSession();
    location.hash = '#/login';
  });
}
