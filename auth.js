
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
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user exists
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Login successful
        currentUser = {
          id: user.id,
          name: user.name,
          email: user.email
        };
        
        // Save current user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI
        updateUIForLoggedInUser();
        
        // Show success notification
        showNotification(`Добре дошли, ${user.name}!`, 'success');
        
        // Close modal
        document.getElementById('auth-modal').style.display = 'none';
      } else {
        // Login failed
        showNotification('Невалиден имейл или парола.', 'error');
      }
    });
  }
  
  // Signup form submission
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm-password').value;
      
      // Validate passwords match
      if (password !== confirmPassword) {
        showNotification('Паролите не съвпадат.', 'error');
        return;
      }
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      if (users.some(user => user.email === email)) {
        showNotification('Имейлът вече е регистриран.', 'error');
        return;
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password
      };
      
      // Add user to users array
      users.push(newUser);
      
      // Save users to localStorage
      localStorage.setItem('users', JSON.stringify(users));
      
      // Login the new user
      currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };
      
      // Save current user to localStorage
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      // Update UI
      updateUIForLoggedInUser();
      
      // Show success notification
      showNotification(`Регистрацията е успешна! Добре дошли, ${newUser.name}!`, 'success');
      
      // Close modal
      document.getElementById('auth-modal').style.display = 'none';
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
