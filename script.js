
// Cart functionality
let cart = [];

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
  const cartBtn = document.getElementById('cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const closeBtn = document.querySelector('.close');
  const cartItems = document.getElementById('cart-items');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const cartCount = document.getElementById('cart-count');
  const checkoutBtn = document.getElementById('checkout-btn');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const categoryTabs = document.querySelectorAll('.tab');
  
  // Add to cart functionality
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      const name = this.getAttribute('data-name');
      const price = parseFloat(this.getAttribute('data-price'));
      
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
      
      updateCart();
      showNotification(`${name} added to cart!`);
    });
  });
  
  // Open cart modal
  cartBtn.addEventListener('click', function(e) {
    e.preventDefault();
    cartModal.style.display = 'block';
    updateCartItems();
  });
  
  // Close cart modal
  closeBtn.addEventListener('click', function() {
    cartModal.style.display = 'none';
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === cartModal) {
      cartModal.style.display = 'none';
    }
  });
  
  // Checkout functionality
  checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
      showNotification('Your cart is empty!', 'warning');
      return;
    }
    
    showNotification('Proceeding to checkout...', 'success');
    // In a real implementation, this would redirect to a checkout page
    setTimeout(() => {
      cart = [];
      updateCart();
      cartModal.style.display = 'none';
      showNotification('Thank you for your purchase!', 'success');
    }, 2000);
  });
  
  // Category tabs functionality
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      
      // Set active tab
      categoryTabs.forEach(tab => tab.classList.remove('active'));
      this.classList.add('active');
      
      // Filter products
      const productCards = document.querySelectorAll('.product-card');
      
      productCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
  
  // Update cart count and total
  function updateCart() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
    
    updateCartItems();
  }
  
  // Update cart items in modal
  function updateCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
      cartItems.innerHTML = '<p>Your cart is empty.</p>';
      return;
    }
    
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
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
        const item = cart.find(item => item.id === id);
        
        if (item && item.quantity > 1) {
          item.quantity--;
          updateCart();
        }
      });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const item = cart.find(item => item.id === id);
        
        if (item) {
          item.quantity++;
          updateCart();
        }
      });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        cart = cart.filter(item => item.id !== id);
        updateCart();
      });
    });
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
  
  // Add notification styles
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 15px 20px;
      background-color: #3b82f6;
      color: white;
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s, transform 0.3s;
    }
    
    .notification.show {
      opacity: 1;
      transform: translateY(0);
    }
    
    .notification.success {
      background-color: #10b981;
    }
    
    .notification.warning {
      background-color: #f59e0b;
    }
    
    .notification.error {
      background-color: #ef4444;
    }
  `;
  document.head.appendChild(style);
  
  // Add smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for header
          behavior: 'smooth'
        });
      }
    });
  });
});
