// Cart system using localStorage
const CART_KEY = 'lgrinta_cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  showCartToast(product.title);
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function getCartTotal() {
  return getCart().reduce((sum, i) => sum + (i.price * (i.qty || 1)), 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = getCart().reduce((sum, i) => sum + (i.qty || 1), 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

function showCartToast(title) {
  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.style.cssText = `
      position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
      background:#D4AF37;color:#0a0a0a;
      padding:11px 20px;border-radius:12px;
      font-weight:700;z-index:9999;font-size:14px;
      transition:opacity .3s;display:flex;align-items:center;gap:10px;
      white-space:nowrap;box-shadow:0 4px 24px rgba(212,175,55,.4);
    `;
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span>تمت الإضافة: <strong>${title}</strong></span>
  `;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.style.opacity = '0', 2500);
}

document.addEventListener('DOMContentLoaded', updateCartBadge);