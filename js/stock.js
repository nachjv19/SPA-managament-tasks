// 📁 src/js/stock.js
import axios from 'axios';
import { getUsername } from './session.js';

const API_URL = 'http://localhost:3000';

export async function initStock() {
  const container = document.querySelector('#product-list');
  const form = document.querySelector('#purchase-form');
  if (!container || !form) return;

  try {
    const { data: products } = await axios.get(`${API_URL}/products?is_active=true`);

    // Pintar productos
    container.innerHTML = products.map(p => `
      <div class="bg-gray-700 text-white p-4 rounded shadow">
        <h3 class="text-xl font-bold mb-2">${p.name}</h3>
        <p>Precio: <strong>$${p.price}</strong></p>
        <p>Stock disponible: <strong>${p.stock}</strong></p>
        <input type="checkbox" class="product-check mt-2" data-id="${p.id}" />
        <input 
          type="number" 
          class="qty-input mt-2 w-full rounded p-1 text-black"
          placeholder="Cantidad"
          min="1"
          max="${p.stock}"
          data-id="${p.id}"
        />
      </div>
    `).join('');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = getUsername();
      const checks = document.querySelectorAll('.product-check:checked');

      if (checks.length === 0) {
        alert('Selecciona al menos un producto para comprar.');
        return;
      }

      const purchases = [];

      for (const check of checks) {
        const id = check.dataset.id;
        const qtyInput = document.querySelector(`.qty-input[data-id="${id}"]`);
        const quantity = parseInt(qtyInput.value);

        if (!quantity || quantity <= 0) {
          alert('Ingresa una cantidad válida.');
          return;
        }

        const { data: product } = await axios.get(`${API_URL}/products/${id}`);

        if (quantity > product.stock) {
          alert(`No hay suficiente stock para ${product.name}.`);
          return;
        }

        // Calcular total
        const total = quantity * product.price;

        purchases.push({
          product_id: product.id,
          name: product.name,
          user: username,
          quantity,
          price_unit: product.price,
          total_price: total,
          date: new Date().toISOString()
        });

        // Actualizar stock
        await axios.patch(`${API_URL}/products/${id}`, {
          stock: product.stock - quantity
        });
      }

      // Registrar compras
      for (const item of purchases) {
        await axios.post(`${API_URL}/purchases`, item);
      }

      alert('¡Compra exitosa!');
      form.reset();
      initStock(); // recargar stock

    });

  } catch (err) {
    console.error('Error al cargar productos:', err);
  }
}
