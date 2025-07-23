// 📁 js/router.js
import { Uautenticado } from './session.js';

const routes = {
  '#/login': 'views/login.html',
  '#/register': 'views/register.html',
  '#/dashboard': 'views/dashboard.html',
  '#/admin-users': 'views/admin-users.html',
  '#/trash-users': 'views/trash-users.html',
  '#/purchases': 'views/purchases.html',
  '#/admin-products': 'views/admin-products.html',
  '#/stock': 'views/stock.html'
};

export async function loadView() {
  const path = location.hash || '#/login';
  const isAuth = Uautenticado();

  const publicRoutes = ['#/login', '#/register'];
  const protectRoutes = ['#/dashboard', '#/tasks'];

  // Redirección a login si no está autenticado y la ruta es protegida
  if (!isAuth && protectRoutes.includes(path)) {
    location.hash = '#/login';
    return;
  }

  // Redirección a dashboard si ya está autenticado y accede a rutas públicas
  if (isAuth && publicRoutes.includes(path)) {
    location.hash = '#/dashboard';
    return;
  }

  const file = routes[path] || 'views/404.html';

  try {
    const res = await fetch(file);
    const html = await res.text();
    document.querySelector('#app').innerHTML = html;

    // Módulos por vista
    if (path === '#/login') {
        import('./auth.js').then(m => m.initLogin());
        import('../components/navbar.js').then(m => m.loadNavbar());
    }

    if (path === '#/register') {
      import('./auth.js').then(m => m.initRegister());
      import('../components/navbar.js').then(m => m.loadNavbar());
    }
     if (path === '#/dashboard') {
       import('./dashboard.js').then(m => m.initDashboard());
       import('../components/navbar.js').then(m => m.loadNavbar());
    }

    if (path === '#/admin-users') {
      import('./admin.js').then(m => m.initAdminUsers());
      import('../components/navbar.js').then(m => m.loadNavbar());
    } 

    if (path === '#/trash-users'){
        import ('./trash.users.js').then(m => m.loadTrashUsers());
        import('../components/navbar.js').then(m => m.loadNavbar());
    }

    if (path === '#/purchases') {
        import('./purchases.js').then(m => m.initPurchases());
        import('../components/navbar.js').then(m => m.loadNavbar());
    }
    if (path === '#/stock') {
      import('./stock.js').then(m => m.initStock());
      import('../components/navbar.js').then(m => m.loadNavbar());
    }


    if(path === '#/admin-products'){
      import('./admin-products.js').then(m => m.initAdminProducts());
      import('../components/navbar.js').then(m => m.loadNavbar());
    }

    if (protectRoutes.includes(path)) {
        import('../components/navbar.js').then(m => m.loadNavbar());
    }


    
  } catch (err) {
    document.querySelector('#app').innerHTML = '<p>Error cargando la vista</p>';
    console.error(err);
  }
}
