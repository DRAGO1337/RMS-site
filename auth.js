// Authentication System
let currentUser = null;

// Check if user is logged in from localStorage
document.addEventListener('DOMContentLoaded', function() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateUIForLoggedInUser();
  }

  setupAuthListeners();
});

// Setup all authentication-related event listeners
function setupAuthListeners() {
  // Login button click
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      document.getElementById('auth-modal').style.display = 'block';
      document.getElementById('login-form').style.display = 'block';
      document.getElementById('signup-form').style.display = 'none';
    });
  }

  // Close modal
  const closeBtn = document.querySelector('.auth-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      document.getElementById('auth-modal').style.display = 'none';
    });
  }

  // Switch to signup form
  const switchToSignup = document.getElementById('switch-to-signup');
  if (switchToSignup) {
    switchToSignup.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('signup-form').style.display = 'block';
    });
  }

  // Switch to login form
  const switchToLogin = document.getElementById('switch-to-login');
  if (switchToLogin) {
    switchToLogin.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('signup-form').style.display = 'none';
      document.getElementById('login-form').style.display = 'block';
    });
  }

  // Login form submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        // Show loading indicator
        showNotification('Влизане...', 'info');

        // Call login API
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Грешка при влизане');
        }

        // Login successful
        currentUser = data.user;

        // Save current user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update UI
        updateUIForLoggedInUser();

        // Show success notification
        showNotification(`Добре дошли, ${currentUser.name}!`, 'success');

        // Close modal
        document.getElementById('auth-modal').style.display = 'none';
      } catch (error) {
        console.error('Login error:', error);
        showNotification(error.message || 'Невалиден имейл или парола.', 'error');
      }
    });
  }

  // Signup form submission
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      console.log("Signup form submitted");

      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm-password').value;

      // Validate form data
      if (!name || !email || !password) {
        showNotification('Моля, попълнете всички задължителни полета.', 'error');
        return;
      }

      // Validate passwords match
      if (password !== confirmPassword) {
        showNotification('Паролите не съвпадат.', 'error');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Моля, въведете валиден имейл адрес.', 'error');
        return;
      }

      try {
        // Show loading indicator
        showNotification('Регистрация...', 'info');

        console.log('Sending registration data:', { name, email, password });

        // Call register API
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        console.log('Registration response status:', response.status);

        const data = await response.json();
        console.log('Registration response data:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Грешка при регистрация');
        }

        // Registration successful
        currentUser = data.user;

        // Save current user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update UI
        updateUIForLoggedInUser();

        // Show success notification
        showNotification(`Регистрацията е успешна! Добре дошли, ${currentUser.name}!`, 'success');

        // Close modal
        document.getElementById('auth-modal').style.display = 'none';

        console.log('User registered successfully:', currentUser);
      } catch (error) {
        console.error('Registration error:', error);
        showNotification(error.message || 'Грешка при регистрация. Моля опитайте отново.', 'error');
      }
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();

      // Clear current user
      currentUser = null;
      localStorage.removeItem('currentUser');

      // Update UI
      updateUIForLoggedOutUser();

      // Show notification
      showNotification('Излязохте успешно от профила си.', 'info');
    });
  }

  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    const modal = document.getElementById('auth-modal');
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Update UI elements for logged in users
function updateUIForLoggedInUser() {
  document.getElementById('login-btn').style.display = 'none';

  const userMenu = document.getElementById('user-menu');
  if (userMenu) {
    userMenu.style.display = 'block';
    const userName = document.getElementById('user-name');
    if (userName && currentUser) {
      userName.textContent = currentUser.name;
    }
  }
}

// Update UI elements for logged out users
function updateUIForLoggedOutUser() {
  document.getElementById('login-btn').style.display = 'block';

  const userMenu = document.getElementById('user-menu');
  if (userMenu) {
    userMenu.style.display = 'none';
  }
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
  // Prevent recursion issues completely
  if (window.inAuthNotification) {
    return;
  }

  // Set recursion guard
  window.inAuthNotification = true;

  // Don't try to call other implementations - always use our own

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
      window.inAuthNotification = false;
    }, 300);
  }, 3000);
}