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
    // Add event listeners for profile menu items
    const profileLink = document.getElementById('profile-link');
    const ordersLink = document.getElementById('orders-link');
    const wishlistLink = document.getElementById('wishlist-link');
    const settingsLink = document.getElementById('settings-link');

    // Create placeholder pages
    function createPlaceholderPage(title, content) {
      // Save the current body content
      const currentContent = document.body.innerHTML;

      // Create back button for navigation
      const backButton = document.createElement('button');
      backButton.textContent = 'Back to Home';
      backButton.className = 'btn';
      backButton.style.margin = '1rem';
      backButton.addEventListener('click', () => {
        document.body.innerHTML = currentContent;
        // Reattach event listeners after restoring content
        reattachEventListeners();
      });

      // Create placeholder content
      const container = document.createElement('div');
      container.className = 'container';
      container.style.padding = '2rem';
      container.style.textAlign = 'center';

      const heading = document.createElement('h2');
      heading.textContent = title;
      heading.className = 'section-title';

      const paragraph = document.createElement('p');
      paragraph.textContent = content;
      paragraph.style.margin = '2rem 0';

      // Assemble the page
      container.appendChild(backButton);
      container.appendChild(heading);
      container.appendChild(paragraph);

      // Replace the body content
      document.body.innerHTML = '';
      document.body.appendChild(container);
    }

    // Keep dropdown menu open with a small delay
    let menuTimeout;

    function handleMenuMouseEnter() {
      clearTimeout(menuTimeout);
      userMenu.classList.add('active');
    }

    function handleMenuMouseLeave() {
      menuTimeout = setTimeout(() => {
        userMenu.classList.remove('active');
      }, 500); // 500ms delay before closing
    }

    // Reattach event listeners after DOM changes
    function reattachEventListeners() {
        // Re-get DOM elements after they were recreated
        const profileLink = document.getElementById('profile-link');
        const ordersLink = document.getElementById('orders-link');
        const settingsLink = document.getElementById('settings-link');
        const logoutBtn = document.getElementById('logout-btn');

        // Menu hover events
        userMenu.addEventListener('mouseenter', handleMenuMouseEnter);
        userMenu.addEventListener('mouseleave', handleMenuMouseLeave);

        // User profile actions
        profileLink.addEventListener('click', profileLink.onclick);
        ordersLink.addEventListener('click', ordersLink.onclick);
        settingsLink.addEventListener('click', settingsLink.onclick);
        
        if (logoutBtn) {
          logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateUIForLoggedOutUser();
            showNotification('Излязохте успешно от профила си.', 'info');
            window.location.reload();
          });
        }

        // Reattach other event listeners (if needed)
    }

    userMenu.addEventListener('mouseenter', handleMenuMouseEnter);
    userMenu.addEventListener('mouseleave', handleMenuMouseLeave);


    profileLink.addEventListener('click', (e) => {
      e.preventDefault();
      const user = JSON.parse(localStorage.getItem('currentUser'));
      
      // Създаване на страница за профил
      const profilePage = `
        <link href="profile.css" rel="stylesheet" type="text/css" />
        
        <section class="profile-section">
          <div class="container">
            <div class="profile-container">
              <div class="profile-header">
                <div class="profile-avatar">
                  ${user.name.charAt(0).toUpperCase()}
                </div>
                <div class="profile-title">
                  <h2>${user.name}</h2>
                  <p>Регистриран от ${new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div class="profile-details">
                <div class="profile-info-box">
                  <h3>Лична Информация</h3>
                  <div class="info-row">
                    <div class="info-label">Име</div>
                    <div class="info-value">${user.name}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Имейл</div>
                    <div class="info-value">${user.email}</div>
                  </div>
                  <div class="info-row">
                    <div class="info-label">Потребителски ID</div>
                    <div class="info-value">${user.id}</div>
                  </div>
                </div>
                
                <div class="profile-info-box">
                  <h3>Сигурност</h3>
                  <div class="info-row">
                    <div class="info-label">Парола</div>
                    <div class="info-value">••••••••</div>
                  </div>
                  <button class="btn-profile btn-outline" id="change-password-btn">Смяна на Парола</button>
                </div>
              </div>
              
              <div class="profile-actions">
                <button class="btn-profile btn-outline" id="back-to-home">Назад към Началото</button>
              </div>
            </div>
          </div>
        </section>
      `;
      
      // Запазване на текущото съдържание и актуализиране
      const currentContent = document.body.innerHTML;
      document.body.innerHTML = profilePage;
      
      // Добавяне на слушатели за събития
      document.getElementById('back-to-home').addEventListener('click', () => {
        document.body.innerHTML = currentContent;
        reattachEventListeners();
      });
      
      document.getElementById('change-password-btn').addEventListener('click', () => {
        alert('Функционалността за смяна на парола ще бъде внедрена скоро.');
      });
    });

    ordersLink.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Създаване на страница за поръчки
      const ordersPage = `
        <link href="profile.css" rel="stylesheet" type="text/css" />
        
        <section class="profile-section">
          <div class="container">
            <div class="profile-container">
              <div class="profile-header">
                <div class="profile-title">
                  <h2>Моите Поръчки</h2>
                  <p>Преглед и проследяване на вашите покупки</p>
                </div>
              </div>
              
              <div class="orders-empty">
                <i class="fas fa-shopping-bag"></i>
                <h3>Все още няма поръчки</h3>
                <p>След като направите покупка, вашите поръчки ще се появят тук. Разгледайте нашите продукти и намерете нещо, което ще харесате!</p>
                <div class="profile-actions" style="justify-content: center; margin-top: 2rem;">
                  <button class="btn-profile btn-primary" id="browse-products">Разгледай Продукти</button>
                  <button class="btn-profile btn-outline" id="back-to-home">Назад към Началото</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
      
      // Запазване на текущото съдържание и актуализиране
      const currentContent = document.body.innerHTML;
      document.body.innerHTML = ordersPage;
      
      // Добавяне на слушатели за събития
      document.getElementById('back-to-home').addEventListener('click', () => {
        document.body.innerHTML = currentContent;
        reattachEventListeners();
      });
      
      document.getElementById('browse-products').addEventListener('click', () => {
        window.location.href = 'products.html';
      });
    });

    settingsLink.addEventListener('click', (e) => {
      e.preventDefault();
      const user = JSON.parse(localStorage.getItem('currentUser'));
      
      // Създаване на страница за настройки
      const settingsPage = `
        <link href="profile.css" rel="stylesheet" type="text/css" />
        
        <section class="profile-section">
          <div class="container">
            <div class="profile-container">
              <div class="profile-header">
                <div class="profile-title">
                  <h2>Настройки на Акаунта</h2>
                  <p>Управлявайте информацията и предпочитанията за вашия акаунт</p>
                </div>
              </div>
              
              <form class="settings-form" id="settings-form">
                <div class="settings-form-group">
                  <label for="settings-name">Пълно Име</label>
                  <input type="text" id="settings-name" value="${user.name}" required>
                </div>
                
                <div class="settings-form-group">
                  <label for="settings-email">Имейл Адрес</label>
                  <input type="email" id="settings-email" value="${user.email}" required>
                </div>
                
                <div class="settings-form-group">
                  <label for="settings-phone">Телефонен Номер</label>
                  <input type="tel" id="settings-phone" placeholder="Добавете вашия телефонен номер">
                </div>
                
                <div class="settings-form-group">
                  <label for="settings-address">Адрес</label>
                  <input type="text" id="settings-address" placeholder="Добавете вашия адрес">
                </div>
                
                <div class="settings-form-group full-width">
                  <label for="settings-preferences">Предпочитания за Комуникация</label>
                  <div style="margin-top: 0.5rem;">
                    <input type="checkbox" id="prefs-email" checked>
                    <label for="prefs-email" style="display: inline; margin-left: 0.5rem;">Имейл известия за моите поръчки</label>
                  </div>
                  <div style="margin-top: 0.5rem;">
                    <input type="checkbox" id="prefs-marketing" checked>
                    <label for="prefs-marketing" style="display: inline; margin-left: 0.5rem;">Маркетингови имейли за нови продукти и оферти</label>
                  </div>
                </div>
                
                <div class="profile-actions full-width">
                  <button type="button" class="btn-profile btn-outline" id="back-to-home">Отказ</button>
                  <button type="submit" class="btn-profile btn-primary">Запази Промените</button>
                </div>
              </form>
              
              <div class="danger-zone">
                <h3>Опасна Зона</h3>
                <p>След като изтриете акаунта си, няма връщане назад. Моля, бъдете сигурни.</p>
                <button class="delete-account-btn" id="delete-account">Изтрий Моя Акаунт</button>
              </div>
            </div>
          </div>
        </section>
      `;
      
      // Запазване на текущото съдържание и актуализиране
      const currentContent = document.body.innerHTML;
      document.body.innerHTML = settingsPage;
      
      // Добавяне на слушатели за събития
      document.getElementById('back-to-home').addEventListener('click', () => {
        document.body.innerHTML = currentContent;
        reattachEventListeners();
      });
      
      document.getElementById('settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Настройките ви бяха запазени успешно!');
      });
      
      document.getElementById('delete-account').addEventListener('click', () => {
        if (confirm('Сигурни ли сте, че искате да изтриете профила си? Това действие не може да бъде отменено.')) {
          alert('Функционалността за изтриване на акаунт ще бъде внедрена скоро.');
        }
      });
    });
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