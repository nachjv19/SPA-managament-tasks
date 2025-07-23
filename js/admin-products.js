import axios from 'axios';
const API_URL = 'http://localhost:3000/products';

let editingProductId = null; // ← Identificador si estamos editando

export async function loadAdminProducts() {
  const container = document.getElementById('product-list');
  if (!container) return;

  try {
    const { data: products } = await axios.get(`${API_URL}?is_active=true`);

    container.innerHTML = '';

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'bg-gray-700 text-white p-4 rounded shadow flex justify-between items-center';

      card.innerHTML = `
        <div>
          <h4 class="font-bold text-lg">${product.name}</h4>
          <p>Precio: <strong>$${product.price}</strong></p>
          <p>Stock: <strong>${product.stock}</strong></p>
        </div>
        <div class="flex gap-2">
          <button class="edit-btn bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded" data-id="${product.id}">
            Editar
          </button>
          <button class="delete-btn bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded" data-id="${product.id}">
            Eliminar
          </button>
        </div>
      `;

      container.appendChild(card);

      // 🧨 ELIMINAR
      card.querySelector('.delete-btn')?.addEventListener('click', async () => {
        const confirmDelete = confirm('¿Seguro que deseas eliminar este producto?');
        if (!confirmDelete) return;

        await axios.patch(`${API_URL}/${product.id}`, {
          is_active: false
        });

        loadAdminProducts();
      });

      // ✏️ EDITAR
      card.querySelector('.edit-btn')?.addEventListener('click', () => {
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        editingProductId = product.id; // ← Modo edición activado
        document.getElementById('product-submit-btn').textContent = 'Actualizar producto';
      });
    });

  } catch (err) {
    console.error('Error al cargar productos:', err);
  }
}

export function initAdminProducts() {
  const form = document.getElementById('product-form');
  const container = document.getElementById('product-list');
  if (!form || !container) return;

  loadAdminProducts();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('product-name')?.value.trim();
    const price = parseFloat(document.getElementById('product-price')?.value);
    const stock = parseInt(document.getElementById('product-stock')?.value);

    if (!name || isNaN(price) || price <= 0 || isNaN(stock) || stock <= 0) {
      alert('Todos los campos deben estar completos y tener valores válidos.');
      return;
    }

    try {
      if (editingProductId) {
        // MODO EDICIÓN
        await axios.patch(`${API_URL}/${editingProductId}`, {
          name,
          price,
          stock
        });

        editingProductId = null;
        document.getElementById('product-submit-btn').textContent = 'Guardar producto';

      } else {
        // MODO CREACIÓN
        const { data: products } = await axios.get(API_URL);
        const nextId = String(Math.max(0, ...products.map(p => parseInt(p.id))) + 1);

        const newProduct = {
          id: nextId,
          name,
          price,
          stock,
          is_active: true
        };

        await axios.post(API_URL, newProduct);
      }

      form.reset();
      loadAdminProducts();

    } catch (err) {
      console.error('Error al guardar/actualizar producto:', err);
    }
  });
}
