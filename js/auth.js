// Auth helpers
async function getCurrentUser() {
  const { data: { session } } = await _supabase.auth.getSession();
  return session?.user || null;
}

async function isAdmin(user) {
  if (!user) return false;
  return user.email && user.email.startsWith('admin@');
}

async function signOut() {
  await _supabase.auth.signOut();
  window.location.href = '/index.html';
}

async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = '/login.html';
    return null;
  }
  return user;
}

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !await isAdmin(user)) {
    window.location.href = '/index.html';
    return null;
  }
  return user;
}

// Update nav UI
async function updateNavAuth() {
  const user = await getCurrentUser();
  const navLogin = document.getElementById('nav-login');
  const navUser = document.getElementById('nav-user');
  const navAdmin = document.getElementById('nav-admin');

  if (user) {
    if (navLogin) navLogin.style.display = 'none';
    if (navUser) {
      navUser.style.display = 'flex';
      const nameEl = document.getElementById('nav-username');
      if (nameEl) nameEl.textContent = user.email.split('@')[0];
    }
    if (navAdmin && await isAdmin(user)) {
      navAdmin.style.display = 'flex';
    }
  } else {
    if (navLogin) navLogin.style.display = 'flex';
    if (navUser) navUser.style.display = 'none';
    if (navAdmin) navAdmin.style.display = 'none';
  }
}