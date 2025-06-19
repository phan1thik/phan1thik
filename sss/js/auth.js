document.addEventListener('DOMContentLoaded', function() {
  // Элементы DOM
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginError = document.getElementById('loginError');
  const registerError = document.getElementById('registerError');

  // Переключение между вкладками
  function switchTab(activeTab, activeForm) {
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active-form'));
    
    activeTab.classList.add('active');
    activeForm.classList.add('active-form');
  }

  // Обработчики событий для вкладок
  loginTab.addEventListener('click', () => switchTab(loginTab, loginForm));
  registerTab.addEventListener('click', () => switchTab(registerTab, registerForm));

  // Проверка авторизации при загрузке
  checkAuth();

  // Обработчик формы входа
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    // Проверка в локальном хранилище
    const users = JSON.parse(localStorage.getItem('genshinUsers')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // Успешный вход
      loginError.style.display = 'none';
      
      // Сохраняем данные сессии
      const session = { 
        username: user.username,
        loggedIn: true,
        expires: rememberMe ? Date.now() + 30 * 24 * 60 * 60 * 1000 : Date.now() + 24 * 60 * 60 * 1000
      };
      
      localStorage.setItem('genshinSession', JSON.stringify(session));
      
      // Перенаправляем на календарь
      window.location.href = 'calendar.html';
    } else {
      loginError.style.display = 'flex';
    }
  });

  // Обработчик формы регистрации
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const repeatPassword = document.getElementById('registerRepeat').value.trim();
    const agreeChecked = document.getElementById('registerAgree').checked;

    // Валидация
    if (!validateRegistration(username, password, repeatPassword, agreeChecked)) {
      return;
    }

    // Регистрация пользователя
    const users = JSON.parse(localStorage.getItem('genshinUsers')) || [];
    
    // Проверка на существующего пользователя
    if (users.some(u => u.username === username)) {
      registerError.textContent = 'Это имя пользователя уже занято';
      registerError.style.display = 'flex';
      return;
    }

    // Добавляем нового пользователя
    users.push({ username, password });
    localStorage.setItem('genshinUsers', JSON.stringify(users));
    
    // Автоматический вход после регистрации
    const session = { 
      username,
      loggedIn: true,
      expires: Date.now() + 24 * 60 * 60 * 1000 // 1 день
    };
    localStorage.setItem('genshinSession', JSON.stringify(session));
    
    // Перенаправление на календарь
    window.location.href = 'calendar.html';
  });

  // Функция валидации регистрации
  function validateRegistration(username, password, repeatPassword, agreeChecked) {
    if (username.length < 4 || username.length > 16) {
      registerError.textContent = 'Имя пользователя должно быть от 4 до 16 символов';
      registerError.style.display = 'flex';
      return false;
    }
    
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      registerError.textContent = 'Имя пользователя может содержать только буквы и цифры';
      registerError.style.display = 'flex';
      return false;
    }
    
    if (password.length < 8) {
      registerError.textContent = 'Пароль должен содержать минимум 8 символов';
      registerError.style.display = 'flex';
      return false;
    }
    
    if (password !== repeatPassword) {
      registerError.textContent = 'Пароли не совпадают';
      registerError.style.display = 'flex';
      return false;
    }
    
    if (!agreeChecked) {
      registerError.textContent = 'Необходимо согласие с условиями';
      registerError.style.display = 'flex';
      return false;
    }
    
    return true;
  }

  // Проверка авторизации
  function checkAuth() {
    const session = JSON.parse(localStorage.getItem('genshinSession'));
    
    if (session && session.loggedIn && session.expires > Date.now()) {
      // Пользователь уже авторизован - перенаправляем на календарь
      window.location.href = 'calendar.html';
    }
  }
});