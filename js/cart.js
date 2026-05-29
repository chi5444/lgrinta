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
      position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
      background:#D4AF37;color:#0a0a0a;padding:12px 24px;border-radius:8px;
      font-weight:700;z-index:9999;font-size:14px;letter-spacing:.5px;
      transition:opacity .3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = `✓ تمت إضافة "${title}" للسلة`;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.style.opacity = '0', 2500);
}

document.addEventListener('DOMContentLoaded', updateCartBadge);