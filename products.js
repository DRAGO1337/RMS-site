
// Products page functionality
let products = [];
let currentCategory = 'all';
let currentSubtype = null;
let currentSort = 'price-desc';
let currentMaxPrice = 3000;

document.addEventListener('DOMContentLoaded', function() {
  loadProducts();
  
  // Set up event listeners for filters
  setupFilterListeners();
  
  // Initialize cart data from localStorage
  initCartFromStorage();
});

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
  
  priceRange.addEventListener('input', function() {
    currentMaxPrice = parseInt(this.value);
    currentMaxPriceElement.textContent = `${currentMaxPrice} лв.`;
    renderProducts();
  });
}

// Cart functionality
let cart = [];

function initCartFromStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }
}

function addToCart(id, name, price) {
  // Check if product is already in cart
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id,
      name,
      price,
      quantity: 1
    });
  }
  
  // Save cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart UI
  updateCartCount();
  
  // Show notification
  showNotification(`${name} добавен в кошницата!`);
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
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
