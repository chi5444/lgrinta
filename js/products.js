// ─── Products: fetch from Supabase ───────────────────────────────────────────
async function fetchProducts(filters = {}) {
  let query = _supabase.from('products').select('*').eq('in_stock', true);
  if (filters.category && filters.category !== 'all') query = query.eq('category', filters.category);
  if (filters.game     && filters.game     !== 'all') query = query.eq('game',     filters.game);
  if (filters.search)  query = query.ilike('title', `%${filters.search}%`);
  const { data, error } = await query.order('id', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
}

// ─── Category icon SVG map ────────────────────────────────────────────────────
function getCategoryIconSVG(category) {
  const icons = {
    gift_cards: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
    games:       `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="13" rx="5"/><path d="M8 12h2m-1-1v2M16 12h.01M18 12h.01"/></svg>`,
    social:      `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    subscriptions:`<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    top_up:      `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="8.5"/><polyline points="22 8.5 12 8.5 2 8.5"/></svg>`,
    accounts:    `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>`,
  };
  return icons[category] || icons['games'];
}

// ─── Render product card (used in product.html related grid) ─────────────────
function renderProductCard(p) {
  const discount = p.old_price ? Math.round((1 - p.price / p.old_price) * 100) : null;
  const lang = document.documentElement.getAttribute('data-lang') || 'ar';
  const curr = lang === 'ar' ? 'د.ت' : 'TND';
  const safeTitle = p.title.replace(/'/g, "\\'");
  const safeGame  = (p.game  || '').replace(/'/g, "\\'");
  const safeImg   = p.image_url ? `'${p.image_url}'` : 'null';

  const imgContent = p.image_url
    ? `<img src="${p.image_url}" alt="${p.title}" loading="lazy"
          style="width:100%;height:100%;object-fit:cover;"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
       <div class="product-img-placeholder ${p.img_class||'img-default'}" style="display:none;width:100%;height:100%;align-items:center;justify-content:center;">
         <div style="width:48px;height:48px;opacity:.7;color:#D4AF37">${getCategoryIconSVG(p.category)}</div>
       </div>`
    : `<div class="product-img-placeholder ${p.img_class||'img-default'}" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
         <div style="width:48px;height:48px;opacity:.7;color:#D4AF37">${getCategoryIconSVG(p.category)}</div>
       </div>`;

  const addCartBtn = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
    <span>${lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}</span>`;

  return `
    <article class="product-card" onclick="window.location.href='product.html?id=${p.id}'">
      <div class="product-img-wrap">
        <div class="product-img">${imgContent}</div>
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        ${discount ? `<span class="product-discount">-${discount}%</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-meta-row">
          <span class="product-game-tag">${p.game || ''}</span>
          ${p.region ? `<span class="product-region-tag">${p.region}</span>` : ''}
        </div>
        <h3 class="product-title">${p.title}</h3>
        <div class="product-pricing">
          <span class="product-price">${p.price} <span class="price-curr">${curr}</span></span>
          ${p.old_price ? `<span class="product-old-price">${p.old_price} ${curr}</span>` : ''}
        </div>
        <button class="btn-add-cart"
          onclick="event.stopPropagation();addToCart({
            id:${p.id},title:'${safeTitle}',price:${p.price},
            image_url:${safeImg},game:'${safeGame}',
            category:'${p.category||''}',img_class:'${p.img_class||'img-default'}'
          })">
          ${addCartBtn}
        </button>
      </div>
    </article>`;
}