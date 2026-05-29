// Products fetching and rendering
async function fetchProducts(filters = {}) {
  let query = _supabase.from('products').select('*').eq('in_stock', true);

  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters.game && filters.game !== 'all') {
    query = query.eq('game', filters.game);
  }
  if (filters.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  const { data, error } = await query.order('id', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
}

function renderProductCard(product) {
  const discount = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : null;

  return `
    <article class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
      <div class="product-img-wrap">
        <div class="product-img ${product.img_class || 'img-default'}">
          <span class="product-icon">${product.icon || '🎮'}</span>
        </div>
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        ${discount ? `<span class="product-discount">-${discount}%</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-meta">
          <span class="product-game">${product.game || ''}</span>
          ${product.region ? `<span class="product-region">${product.region}</span>` : ''}
        </div>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-pricing">
          <span class="product-price">${product.price} <span class="currency">SAR</span></span>
          ${product.old_price ? `<span class="product-old-price">${product.old_price} SAR</span>` : ''}
        </div>
        <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart({id:${product.id}, title:'${product.title.replace(/'/g,"\\'")}', price:${product.price}, icon:'${product.icon || '🎮'}', game:'${product.game || ''}'})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          إضافة للسلة
        </button>
      </div>
    </article>
  `;
}

async function loadCategories() {
  const { data } = await _supabase.from('products').select('category, game').eq('in_stock', true);
  if (!data) return;

  const categories = [...new Set(data.map(p => p.category).filter(Boolean))];
  const games = [...new Set(data.map(p => p.game).filter(Boolean))];

  const catContainer = document.getElementById('category-filters');
  const gameContainer = document.getElementById('game-filters');

  if (catContainer) {
    catContainer.innerHTML = `<button class="filter-btn active" data-category="all">الكل</button>` +
      categories.map(c => `<button class="filter-btn" data-category="${c}">${c}</button>`).join('');
  }
  if (gameContainer) {
    gameContainer.innerHTML = `<button class="filter-btn active" data-game="all">الكل</button>` +
      games.map(g => `<button class="filter-btn" data-game="${g}">${g}</button>`).join('');
  }
}