
document.addEventListener('DOMContentLoaded', function() {
  loadProducts();
  setupFilters();
  setupSearch();
  initCart();
});

// Sample product data
let products = [
  {
    id: '1',
    name: 'Titan X Геймърски ПК',
    price: 1999.99,
    description: 'Върховно геймърско изживяване с RTX 4080, i9 процесор и 32GB RAM.',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'prebuilt',
    subtype: 'heavy-gaming'
  },
  {
    id: '2',
    name: 'Професионална Работна Станция',
    price: 2499.99,
    description: 'Проектирана за професионалисти с Xeon процесор, NVIDIA Quadro и 64GB ECC RAM.',
    image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'prebuilt',
    subtype: 'workstation'
  },
  {
    id: '3',
    name: 'Начален Геймърски Компютър',
    price: 899.99,
    description: 'Перфектен начален геймърски компютър с RTX 3060, Ryzen 5 и 16GB RAM.',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'prebuilt',
    subtype: 'light-gaming'
  },
  {
    id: '4',
    name: 'Компактна Мощност',
    price: 1299.99,
    description: 'Малък размер, но голяма производителност.',
    image: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'prebuilt',
    subtype: 'light-gaming'
  },
  {
    id: '5',
    name: 'RTX 4080 Видео Карта',
    price: 799.99,
    description: 'Ново поколение графика с възможности за ray tracing.',
    image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'components',
    subtype: null
  },
  {
    id: '6',
    name: 'Механична RGB Клавиатура',
    price: 129.99,
    description: 'Премиум механични ключове с персонализируемо RGB осветление.',
    image: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'peripherals',
    subtype: null
  },
  {
    id: '7',
    name: 'Гейминг Слушалки Pro',
    price: 89.99,
    description: 'Immersive 7.1 съраунд звук с шумопотискащ микрофон.',
    image: 'https://images.unsplash.com/photo-1612444530582-fc66183b16f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'peripherals',
    subtype: null
  },
  {
    id: '8',
    name: 'Гейминг Мишка RGB',
    price: 59.99,
    description: '16000 DPI оптичен сензор с програмируеми бутони.',
    image: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'peripherals',
    subtype: null
  },
  {
    id: '9',
    name: 'Процесор Intel i9-13900K',
    price: 549.99,
    description: 'Върхова производителност за гейминг и креативни задачи.',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'components',
    subtype: null
  },
  {
    id: '10',
    name: 'AMD Ryzen 9 7950X',
    price: 599.99,
    description: 'Мултикор мощ за всякакви задачи и сценарии.',
    image: 'https://images.unsplash.com/photo-1555618254-5fa7b7e4a2c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'components',
    subtype: null
  },
  {
    id: '11',
    name: 'Супер Гейм Стрийм ПК',
    price: 2799.99,
    description: 'Перфектен за стриймъри и гейминг ентусиасти.',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'prebuilt',
    subtype: 'heavy-gaming'
  },
  {
    id: '12',
    name: 'Базова Работна Станция',
    price: 1799.99,
    description: 'Идеална за офис задачи и лека работа.',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'prebuilt',
    subtype: 'workstation'
  }
];

// Current filter and sort state
let currentCategory = 'all';
let currentSubtype = null;
let currentSort = 'price-desc';
let currentMaxPrice = 3000;
let searchQuery = '';

// Load product data and render products
function loadProducts() {
  renderProducts();
}

// Render products based on current filters
function renderProducts() {
  const productsGrid = document.getElementById('products-grid');
  productsGrid.innerHTML = '';
  
  // Apply filters
  let filteredProducts = products.filter(product => {
    // Category filter
    if (currentCategory !== 'all' && product.category !== currentCategory) {
      return false;
    }
    
    // Subtype filter (only for prebuilt PCs)
    if (currentSubtype && product.category === 'prebuilt' && product.subtype !== currentSubtype) {
      return false;
    }
    
    // Price filter
    if (product.price > currentMaxPrice) {
      return false;
    }
    
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Apply sorting
  if (currentSort === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
  
  // Render filtered and sorted products
  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = '<p class="no-products">Не са намерени продукти, отговарящи на вашите критерии.</p>';
    return;
  }
  
  filteredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <div class="product-img">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-price-cart">
          <p class="price">${product.price.toFixed(2)} лв.</p>
          <button class="add-to-cart-btn" data-id="${product.id}">
            <i class="fas fa-cart-plus"></i> Add
          </button>
        </div>
      </div>
    `;
    productsGrid.appendChild(productCard);
  });
  
  // Add event listeners to add-to-cart buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-id');
      addToCart(productId);
    });
  });
}

// Setup filter buttons and sliders
function setupFilters() {
  // Category filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentCategory = this.getAttribute('data-category');
      
      // Show/hide prebuilt filters based on category
      const prebuiltFilters = document.querySelector('.prebuilt-filters');
      if (currentCategory === 'prebuilt' || currentCategory === 'all') {
        prebuiltFilters.style.display = 'block';
      } else {
        prebuiltFilters.style.display = 'none';
        currentSubtype = null;
      }
      
      renderProducts();
    });
  });
  
  // Subtype filters
  document.querySelectorAll('.sub-filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        currentSubtype = null;
      } else {
        document.querySelectorAll('.sub-filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentSubtype = this.getAttribute('data-subtype');
      }
      renderProducts();
    });
  });
  
  // Sort buttons
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentSort = this.getAttribute('data-sort');
      renderProducts();
    });
  });
  
  // Price range slider
  const priceRange = document.getElementById('price-range');
  const currentMaxPriceElem = document.getElementById('current-max-price');
  
  priceRange.addEventListener('input', function() {
    currentMaxPrice = parseInt(this.value);
    currentMaxPriceElem.textContent = `${currentMaxPrice} лв.`;
    renderProducts();
  });
}

// Setup search functionality
function setupSearch() {
  const searchInput = document.getElementById('product-search');
  const searchBtn = document.getElementById('search-btn');
  
  // Functional search button
  searchBtn.addEventListener('click', function() {
    searchQuery = searchInput.value.trim();
    renderProducts();
  });
  
  // Search on Enter key press
  searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      searchQuery = this.value.trim();
      renderProducts();
    }
  });
}

// Cart functionality
function initCart() {
  const cartBtn = document.getElementById('cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const closeBtn = cartModal.querySelector('.close');
  
  // Open cart modal
  cartBtn.addEventListener('click', function(e) {
    e.preventDefault();
    cartModal.style.display = 'block';
    updateCartDisplay();
  });
  
  // Close cart modal
  closeBtn.addEventListener('click', function() {
    cartModal.style.display = 'none';
  });
  
  window.addEventListener('click', function(e) {
    if (e.target === cartModal) {
      cartModal.style.display = 'none';
    }
  });
  
  // Checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  checkoutBtn.addEventListener('click', function() {
    if (window.cart.length === 0) {
      alert('Вашата кошница е празна!');
      return;
    }
    // Store cart in localStorage
    localStorage.setItem('cart', JSON.stringify(window.cart));
    // Redirect to checkout page
    window.location.href = 'checkout.html';
  });
}

// Add to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = window.cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    window.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  
  updateCartCount();
  
  // Show notification
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.textContent = `${product.name} добавен в кошницата!`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }, 10);
}

// Update cart count in header
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const count = window.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = count;
}

// Update cart modal display
function updateCartDisplay() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElem = document.getElementById('cart-total-price');
  
  cartItemsContainer.innerHTML = '';
  
  if (window.cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Вашата кошница е празна.</p>';
    cartTotalElem.textContent = '0.00 лв.';
    return;
  }
  
  let total = 0;
  
  window.cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p class="cart-item-price">${item.price.toFixed(2)} лв.</p>
        <div class="cart-item-quantity">
          <button class="quantity-btn minus" data-id="${item.id}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn plus" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="remove-item-btn" data-id="${item.id}">
        <i class="fas fa-trash"></i>
      </button>
    `;
    
    cartItemsContainer.appendChild(cartItem);
  });
  
  cartTotalElem.textContent = `${total.toFixed(2)} лв.`;
  
  // Add event listeners to quantity buttons
  document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      decreaseQuantity(id);
    });
  });
  
  document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      increaseQuantity(id);
    });
  });
  
  document.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      removeFromCart(id);
    });
  });
}

// Increase item quantity
function increaseQuantity(id) {
  const item = window.cart.find(item => item.id === id);
  if (item) {
    item.quantity += 1;
    updateCartDisplay();
    updateCartCount();
  }
}

// Decrease item quantity
function decreaseQuantity(id) {
  const item = window.cart.find(item => item.id === id);
  if (item) {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartDisplay();
      updateCartCount();
    }
  }
}

// Remove item from cart
function removeFromCart(id) {
  window.cart = window.cart.filter(item => item.id !== id);
  updateCartDisplay();
  updateCartCount();
}
