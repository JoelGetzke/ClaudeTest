/* ============================================================
   THREADHAUS — app.js
   ============================================================ */

/* ── Product catalogue ───────────────────────────────────── */
const products = [
  { id: 1, name: 'The Minimal',  sub: 'Classic crew neck',        price: 34, color: '#f0e8d8', emoji: '👕', tag: 'new'  },
  { id: 2, name: 'Night Rider',  sub: 'Heavyweight black tee',    price: 42, color: '#2a2a28', emoji: '🖤', tag: 'hot'  },
  { id: 3, name: 'Sun Washed',   sub: 'Faded vintage wash',       price: 38, color: '#d4a96a', emoji: '☀️', tag: ''     },
  { id: 4, name: 'Stone Cold',   sub: 'Slate grey essential',     price: 36, color: '#9ca3a8', emoji: '🪨', tag: ''     },
  { id: 5, name: 'Desert Rose',  sub: 'Terracotta pigment dye',   price: 44, color: '#c47a5a', emoji: '🌵', tag: 'hot'  },
  { id: 6, name: 'Alpine',       sub: 'Muted forest green',       price: 38, color: '#5a7a5a', emoji: '🌲', tag: 'new'  },
  { id: 7, name: 'Cloud Nine',   sub: 'Ultra-soft white',         price: 32, color: '#f8f4ee', emoji: '☁️', tag: 'sale' },
  { id: 8, name: 'Midnight',     sub: 'Deep navy relaxed fit',    price: 46, color: '#1e2a42', emoji: '🌙', tag: ''     },
];

/* ── Cart state ──────────────────────────────────────────── */
let cart = [];

/* ── Render product grid ─────────────────────────────────── */
function renderProducts() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = products.map(p => `
    <div class="card" onclick="addToCart(${p.id})">
      <div class="card-img" style="background:${p.color}">${p.emoji}</div>
      <div class="card-body">
        ${p.tag ? `<span class="tag tag-${p.tag}">${p.tag}</span><br>` : ''}
        <h3>${p.name}</h3>
        <p class="sub">${p.sub}</p>
        <div class="card-footer">
          <span class="price">$${p.price}</span>
          <button class="add-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ── Add item to cart ────────────────────────────────────── */
function addToCart(id) {
  const product  = products.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateBadge();
  showToast(`${product.name} added to cart!`);
}

/* ── Update cart badge count ─────────────────────────────── */
function updateBadge() {
  document.getElementById('cart-count').textContent =
    cart.reduce((sum, item) => sum + item.qty, 0);
}

/* ── Toast notification ──────────────────────────────────── */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

/* ── Render cart items ───────────────────────────────────── */
function renderCart() {
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total-section');

  if (!cart.length) {
    itemsEl.innerHTML = '<div class="cart-empty">Your cart is empty.<br>Go find something you like!</div>';
    totalEl.innerHTML = '';
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img" style="background:${item.color}">${item.emoji}</div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${item.sub}</p>
      </div>
      <div class="qty-ctrl">
        <button onclick="changeQty(${item.id}, -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <span style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#c4410c;min-width:52px;text-align:right">
        $${item.price * item.qty}
      </span>
      <button class="remove-btn" onclick="removeItem(${item.id})">✕</button>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 75 ? 0 : 6.99;
  const total    = subtotal + shipping;

  totalEl.innerHTML = `
    <div class="cart-summary">
      <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span></div>
      <div class="summary-total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
    </div>
    <button class="checkout-big-btn" onclick="showCheckout()">Proceed to Checkout →</button>
  `;
}

/* ── Render order mini-summary on checkout page ──────────── */
function renderOrderMini() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 75 ? 0 : 6.99;
  const total    = subtotal + shipping;

  document.getElementById('order-summary-mini').innerHTML =
    cart.map(item => `
      <div class="order-mini-item">
        <span>${item.emoji} ${item.name} × ${item.qty}</span>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
      </div>
    `).join('') +
    `<div class="order-mini-item" style="border-top:1px solid #c8bfaa;margin-top:8px;padding-top:8px;font-weight:500">
       <span>Total</span>
       <span style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#c4410c">
         $${total.toFixed(2)}
       </span>
     </div>`;
}

/* ── Adjust quantity ─────────────────────────────────────── */
function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  updateBadge();
  renderCart();
}

/* ── Remove item from cart ───────────────────────────────── */
function removeItem(id) {
  cart = cart.filter(x => x.id !== id);
  updateBadge();
  renderCart();
}

/* ── Screen navigation ───────────────────────────────────── */
function setActive(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  window.scrollTo(0, 0);
}

function showShop()     { setActive('shop-screen'); }
function showCart()     { renderCart(); setActive('cart-screen'); }
function showCheckout() { renderOrderMini(); setActive('checkout-screen'); }
function placeOrder()   { setActive('success-screen'); }

function resetStore() {
  cart = [];
  updateBadge();
  setActive('shop-screen');
}

/* ── Init ────────────────────────────────────────────────── */
renderProducts();
