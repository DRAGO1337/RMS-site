
// Products page functionality
document.addEventListener('DOMContentLoaded', function() {
  loadProducts();
  setupFilterListeners();
  setupSearch();
  initCart();
});

// Setup search functionality
function setupSearch() {
  const searchInput = document.getElementById('product-search');
  const searchBtn = document.getElementById('search-btn');
  
  // Search when button is clicked
  searchBtn.addEventListener('click', performSearch);
  
  // Search when Enter key is pressed
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
  
  function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
      renderProducts(); // Reset to show all products
      return;
    }
    
    // Filter products based on search term
    const searchResults = products.filter(product => {
      return (
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    });
    
    // Render search results
    renderSearchResults(searchResults, searchTerm);
  }
  
  function renderSearchResults(results, searchTerm) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    if (results.length === 0) {
      productsGrid.innerHTML = `<p class="no-products">Няма продукти, съответстващи на търсенето "${searchTerm}".</p>`;
      return;
    }
    
    // Display search results count
    productsGrid.innerHTML = `<p class="search-results-count">${results.length} продукта, съответстващи на търсенето "${searchTerm}"</p>`;
    
    // Render each product in search results
    results.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.setAttribute('data-category', product.category);
      if (product.subtype) {
        productCard.setAttribute('data-subtype', product.subtype);
      }

      productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="price">${product.price.toFixed(2)} лв.</p>
          <p class="description">${product.description}</p>
          <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Добави в Кошницата</button>
        </div>
      `;

      productsGrid.appendChild(productCard);
    });
    
    // Re-add event listeners to newly created add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function() {
        addToCart(
          this.getAttribute('data-id'),
          this.getAttribute('data-name'),
          parseFloat(this.getAttribute('data-price'))
        );
      });
    });
  }
}
</old_str>
<new_str>document.addEventListener('DOMContentLoaded', function() {
  loadProducts();
  setupFilterListeners();
  setupSearch();
  initCart();
});

// Setup search functionality
function setupSearch() {
  const searchInput = document.getElementById('product-search');
  const searchBtn = document.getElementById('search-btn');
  
  // Search when button is clicked
  searchBtn.addEventListener('click', performSearch);
  
  // Search when Enter key is pressed
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
  
  function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
      renderProducts(); // Reset to show all products
      return;
    }
    
    // Filter products based on search term
    const searchResults = products.filter(product => {
      return (
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    });
    
    // Render search results
    renderSearchResults(searchResults, searchTerm);
  }
  
  function renderSearchResults(results, searchTerm) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    if (results.length === 0) {
      productsGrid.innerHTML = `<p class="no-products">Няма продукти, съответстващи на търсенето "${searchTerm}".</p>`;
      return;
    }
    
    // Display search results count
    productsGrid.innerHTML = `<p class="search-results-count">${results.length} продукта, съответстващи на търсенето "${searchTerm}"</p>`;
    
    // Render each product in search results
    results.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.setAttribute('data-category', product.category);
      if (product.subtype) {
        productCard.setAttribute('data-subtype', product.subtype);
      }

      productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="price">${product.price.toFixed(2)} лв.</p>
          <p class="description">${product.description}</p>
          <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Добави в Кошницата</button>
        </div>
      `;

      productsGrid.appendChild(productCard);
    });
    
    // Re-add event listeners to newly created add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function() {
        addToCart(
          this.getAttribute('data-id'),
          this.getAttribute('data-name'),
          parseFloat(this.getAttribute('data-price'))
        );
      });
    });
  }
}

// Initialize cart
function initCart() {
  // Use window.cart to ensure it's accessible across pages
  if (!window.cart) {
    window.cart = [];
  }

  // Load cart from localStorage if available
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    window.cart = JSON.parse(savedCart);
  }
  
  // Update cart count
  updateCartCount();
  
  // Set up cart modal functionality
  setupCartModal();
}

// Update cart count in the header
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (!window.cart) return;
  
  const totalItems = window.cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Add an item to the cart
function addToCart(id, name, price) {
  // Check if product is already in cart
  const existingItem = window.cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    window.cart.push({
      id,
      name,
      price,
      quantity: 1
    });
  }
  
  // Save cart to localStorage
  localStorage.setItem('cart', JSON.stringify(window.cart));
  
  // Update cart UI
  updateCartCount();
  
  // Add animation effect
  animateCartAddition(id);
  
  // Show notification
  showNotification(`${name} добавен в кошницата!`);
}

// Animate cart addition
function animateCartAddition(id) {
  const cartIcon = document.querySelector('.cart-icon');
  const button = document.querySelector(`.add-to-cart[data-id="${id}"]`);
  
  if (cartIcon && button) {
    // Add shake effect to cart icon
    cartIcon.classList.add('cart-shake');
    
    // Create an element that will animate to the cart
    const animEl = document.createElement('div');
    animEl.classList.add('cart-item-animation');
    
    // Get the position of the button and cart icon
    const buttonRect = button.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();
    
    // Position the animation element at the button
    animEl.style.top = `${buttonRect.top + window.scrollY}px`;
    animEl.style.left = `${buttonRect.left}px`;
    animEl.style.width = '10px';
    animEl.style.height = '10px';
    animEl.style.backgroundColor = '#3b82f6';
    animEl.style.borderRadius = '50%';
    animEl.style.position = 'absolute';
    animEl.style.transition = 'all 0.6s ease-in-out';
    animEl.style.zIndex = '1000';
    
    // Add it to the body
    document.body.appendChild(animEl);
    
    // Trigger animation to cart
    setTimeout(() => {
      animEl.style.top = `${cartRect.top + window.scrollY}px`;
      animEl.style.left = `${cartRect.left}px`;
      animEl.style.opacity = '0';
      animEl.style.transform = 'scale(0.3)';
    }, 10);
    
    // Remove the element after animation completes
    setTimeout(() => {
      animEl.remove();
      cartIcon.classList.remove('cart-shake');
    }, 800);
  }
}

// Setup cart modal
function setupCartModal() {
  const cartBtn = document.getElementById('cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  if (cartBtn && cartModal) {
    // Open cart modal
    cartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      cartModal.style.display = 'block';
      updateCartItems();
    });
    
    // Close cart modal
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        cartModal.style.display = 'none';
      });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
      if (e.target === cartModal) {
        cartModal.style.display = 'none';
      }
    });
    
    // Setup checkout button
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function() {
        if (window.cart.length === 0) {
          showNotification('Вашата кошница е празна!', 'warning');
          return;
        }
        
        // Save cart to localStorage before redirecting
        localStorage.setItem('cart', JSON.stringify(window.cart));
        
        showNotification('Пренасочване към плащане...', 'success');
        setTimeout(() => {
          window.location.href = 'checkout.html';
        }, 1000);
      });
    }
  }
}

// Update cart items in modal
function updateCartItems() {
  const cartItems = document.getElementById('cart-items');
  const cartTotalPrice = document.getElementById('cart-total-price');
  
  if (!cartItems) return;
  
  cartItems.innerHTML = '';
  
  if (window.cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  
  window.cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price.toFixed(2)} лв. each</div>
      </div>
      <div class="cart-item-quantity">
        <button class="quantity-btn minus" data-id="${item.id}">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn plus" data-id="${item.id}">+</button>
        <span class="remove-item" data-id="${item.id}">×</span>
      </div>
    `;
    cartItems.appendChild(cartItem);
  });
  
  // Add event listeners for quantity buttons
  document.querySelectorAll('.quantity-btn.minus').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      const item = window.cart.find(item => item.id === id);
      
      if (item && item.quantity > 1) {
        item.quantity--;
        updateCart();
      }
    });
  });
  
  document.querySelectorAll('.quantity-btn.plus').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      const item = window.cart.find(item => item.id === id);
      
      if (item) {
        item.quantity++;
        updateCart();
      }
    });
  });
  
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      window.cart = window.cart.filter(item => item.id !== id);
      updateCart();
    });
  });
  
  // Update total price
  if (cartTotalPrice) {
    const totalPrice = window.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = `${totalPrice.toFixed(2)} лв.`;
  }
}

// Update cart function
function updateCart() {
  // Make sure we're saving the current cart state
  localStorage.setItem('cart', JSON.stringify(window.cart));
  console.log("Cart updated:", window.cart);
  updateCartCount();
  updateCartItems();
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.classList.add('notification', type);
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Products data
let products = [];
let currentCategory = 'all';
let currentSubtype = null;
let currentSort = 'price-desc';
let currentMaxPrice = 3000;

// Load product data
function loadProducts() {
  // In a real implementation, this would likely be an API call
  // For now, using hardcoded data for demonstration
  products = [
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
    },
    // Added new products
    {
      id: '13',
      name: 'RAM Kingston HyperX 32GB',
      price: 189.99,
      description: 'Високоскоростна DDR4 памет с RGB осветление, идеална за геймъри.',
      image: 'https://images.unsplash.com/photo-1562076980-53ceb5d79296?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'components',
      subtype: null
    },
    {
      id: '14',
      name: 'SSD Samsung 1TB',
      price: 149.99,
      description: 'Ултра бърз NVMe SSD с четене до 7000MB/s и запис 5000MB/s.',
      image: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'components',
      subtype: null
    },
    {
      id: '15',
      name: 'Охладителна Система NZXT Kraken',
      price: 179.99,
      description: 'Водно охлаждане с LED дисплей и RGB вентилатори.',
      image: 'https://images.unsplash.com/photo-1587135991058-8816b028691f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'components',
      subtype: null
    },
    {
      id: '16',
      name: 'Геймърски Монитор 27" 240Hz',
      price: 449.99,
      description: '1ms време за отговор, G-Sync, HDR и IPS панел.',
      image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'peripherals',
      subtype: null
    },
    {
      id: '17',
      name: 'Студентски ПК Сет',
      price: 799.99,
      description: 'Пълен комплект с компютър, монитор и периферия за студенти.',
      image: 'https://images.unsplash.com/photo-1552831388-6a0b3575b32a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'prebuilt',
      subtype: 'light-gaming'
    },
    {
      id: '18',
      name: 'Геймърска Видео Карта RX 6800 XT',
      price: 689.99,
      description: 'AMD конкурент на RTX серията с отлична производителност.',
      image: 'https://images.unsplash.com/photo-1596838132731-3bc4a0a31b28?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'components',
      subtype: null
    },
    {
      id: '19',
      name: 'Кутия Corsair 5000D Airflow',
      price: 179.99,
      description: 'Просторна с отличен въздушен поток и място за големи компоненти.',
      image: 'https://images.unsplash.com/photo-1648126963542-597907a10b0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'components',
      subtype: null
    },
    {
      id: '20',
      name: 'Захранване Corsair 850W Gold',
      price: 149.99,
      description: 'Модулно захранване с 80+ Gold сертификат и тихи вентилатори.',
      image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'components',
      subtype: null
    },
    {
      id: '21',
      name: 'Ултра Геймърски ПК RTX 4090',
      price: 3999.99,
      description: 'Най-мощният геймърски компютър с топ компоненти и водно охлаждане.',
      image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'prebuilt',
      subtype: 'heavy-gaming'
    },
    {
      id: '22',
      name: 'Геймърски Бюро RGB',
      price: 299.99,
      description: 'Ергономично бюро с RGB осветление и държач за слушалки.',
      image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'peripherals',
      subtype: null
    },
    {
      id: '23',
      name: 'Бюджетен ПК за Офис',
      price: 649.99,
      description: 'Идеален компютър за офис работа и интернет сърфиране.',
      image: 'https://images.unsplash.com/photo-1595231776515-ddffb1f4eb73?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'prebuilt',
      subtype: 'workstation'
    },
    {
      id: '24',
      name: 'Стриймърски Микрофон Blue Yeti',
      price: 149.99,
      description: 'Професионален USB микрофон с множество режими на запис.',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'peripherals',
      subtype: null
    }
  ];

  renderProducts();
}

// Render products based on current filters
function renderProducts() {
  const productsGrid = document.getElementById('products-grid');
  productsGrid.innerHTML = '';

  let filteredProducts = products.filter(product => {
    // Filter by category
    const categoryMatch = currentCategory === 'all' || product.category === currentCategory;

    // Filter by subtype if applicable
    const subtypeMatch = !currentSubtype || product.subtype === currentSubtype;

    // Filter by price
    const priceMatch = product.price <= currentMaxPrice;

    return categoryMatch && subtypeMatch && priceMatch;
  });

  // Sort products
  filteredProducts.sort((a, b) => {
    if (currentSort === 'price-asc') {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  // Display filtered and sorted products
  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = '<p class="no-products">Няма намерени продукти, отговарящи на филтрите.</p>';
    return;
  }

  filteredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.setAttribute('data-category', product.category);
    if (product.subtype) {
      productCard.setAttribute('data-subtype', product.subtype);
    }

    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">${product.price.toFixed(2)} лв.</p>
        <p class="description">${product.description}</p>
        <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Добави в Кошницата</button>
      </div>
    `;

    productsGrid.appendChild(productCard);
  });

  // Add event listeners to newly created add-to-cart buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      addToCart(
        this.getAttribute('data-id'),
        this.getAttribute('data-name'),
        parseFloat(this.getAttribute('data-price'))
      );
    });
  });
}

// Set up event listeners for filters
function setupFilterListeners() {
  // Category filter buttons
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      currentCategory = this.getAttribute('data-category');

      // Show/hide computer type filters based on category
      const prebuiltFilters = document.querySelector('.prebuilt-filters');
      if (currentCategory === 'prebuilt' || currentCategory === 'all') {
        prebuiltFilters.style.display = 'block';
      } else {
        prebuiltFilters.style.display = 'none';
        currentSubtype = null; // Reset subtype if not in prebuilt category
        document.querySelectorAll('.sub-filter-btn').forEach(btn => btn.classList.remove('active'));
      }

      renderProducts();
    });
  });

  // Subtype (computer type) filter buttons
  document.querySelectorAll('.sub-filter-btn').forEach(button => {
    button.addEventListener('click', function() {
      // If already active, deactivate it
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        currentSubtype = null;
      } else {
        document.querySelectorAll('.sub-filter-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        currentSubtype = this.getAttribute('data-subtype');
      }

      renderProducts();
    });
  });

  // Sort buttons
  document.querySelectorAll('.sort-btn').forEach(button => {
    button.addEventListener('click', function() {
      document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      currentSort = this.getAttribute('data-sort');
      renderProducts();
    });
  });

  // Price range slider
  const priceRange = document.getElementById('price-range');
  const currentMaxPriceElement = document.getElementById('current-max-price');

  if (priceRange && currentMaxPriceElement) {
    priceRange.addEventListener('input', function() {
      currentMaxPrice = parseInt(this.value);
      currentMaxPriceElement.textContent = `${currentMaxPrice} лв.`;
      renderProducts();
    });
  }
}
