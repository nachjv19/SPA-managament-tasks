// 📁 src/js/purchases.js
import axios from 'axios';
import { getSession, getUserRole } from './session.js';

const USERS_URL = 'http://localhost:3000/users';
const PRODUCTS_URL = 'http://localhost:3000/products';
const PURCHASES_URL = 'http://localhost:3000/purchases';

export async function loadPurchases() {
  const container = document.querySelector('#purchase-list');
  if (!container) return;

  const session = getSession();
  const isAdmin = getUserRole() === 'admin';

  try {
    const [purchasesRes, productsRes, usersRes] = await Promise.all([
      axios.get(PURCHASES_URL),
      axios.get(PRODUCTS_URL),
      axios.get(USERS_URL)
    ]);

    let purchases = purchasesRes.data;
    const products = productsRes.data;
    const users = usersRes.data;

    // Filtrar por usuario si no es admin
    if (!isAdmin) {
      purchases = purchases.filter(p => p.user_id === session.id);
    }

    container.innerHTML = '';

    if (purchases.length === 0) {
      container.innerHTML = '<p class="text-gray-500">No hay compras registradas.</p>';
      return;
    }

    purchases.forEach(purchase => {
      const product = products.find(p => p.id === purchase.product_id);
      const user = users.find(u => u.id === purchase.user_id);

      const card = document.createElement('div');
      card.className = 'bg-white p-4 shadow rounded mb-3';

      card.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-800">${product?.name || 'Producto desconocido'}</h3>
        <p class="text-sm text-gray-600">Cantidad: ${purchase.quantity}</p>
        <p class="text-sm text-gray-500">Fecha: ${new Date(purchase.date).toLocaleString()}</p>
        ${
          isAdmin
            ? `<p class="text-sm text-gray-700">Comprado por: ${user?.username || 'Desconocido'}</p>`
            : ''
        }
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error('❌ Error cargando historial de compras:', err);
    container.innerHTML = '<p class="text-red-500">No se pudo cargar el historial.</p>';
  }
}

export function initPurchases() {
  loadPurchases();
}
