
// Checkout page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Retrieve cart from localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const checkoutItems = document.getElementById('checkout-items');
  const checkoutTotalPrice = document.getElementById('checkout-total-price');
  const paymentForm = document.getElementById('payment-form');
  
  // Display cart items in checkout
  function displayCheckoutItems() {
    checkoutItems.innerHTML = '';
    
    if (cart.length === 0) {
      checkoutItems.innerHTML = '<p>Вашата кошница е празна.</p>';
      return;
    }
    
    let totalPrice = 0;
    
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      
      const checkoutItem = document.createElement('div');
      checkoutItem.classList.add('checkout-item');
      checkoutItem.innerHTML = `
        <div>
          <div class="checkout-item-name">${item.name}</div>
          <div class="checkout-item-details">Количество: ${item.quantity} × ${item.price.toFixed(2)} лв.</div>
        </div>
        <div class="checkout-item-total">${itemTotal.toFixed(2)} лв.</div>
      `;
      
      checkoutItems.appendChild(checkoutItem);
    });
    
    checkoutTotalPrice.textContent = `${totalPrice.toFixed(2)} лв.`;
  }
  
  // Process the order
  paymentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show processing message
    showNotification('Обработка на плащането...', 'info');
    
    // Simulate payment processing
    setTimeout(() => {
      // Clear cart after successful order
      localStorage.setItem('cart', JSON.stringify([]));
      
      // Show success message
      showNotification('Поръчката е успешно завършена!', 'success');
      
      // Redirect to thank you page or home page after delay
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    }, 2000);
  });
  
  // Card number formatting
  const cardNumberInput = document.getElementById('card-number');
  cardNumberInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }
    
    e.target.value = formattedValue;
  });
  
  // Expiry date formatting
  const expiryInput = document.getElementById('expiry');
  expiryInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (value.length > 0) {
      formattedValue = value.substring(0, 2);
      if (value.length > 2) {
        formattedValue += '/' + value.substring(2, 4);
      }
    }
    
    e.target.value = formattedValue;
  });
  
  // CVV formatting - limit to 3 or 4 digits
  const cvvInput = document.getElementById('cvv');
  cvvInput.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
  });
  
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
  
  // Initialize checkout page
  displayCheckoutItems();
});
