// Установите здесь дату ивента (год-месяц-день T часы:минуты:секунды)
const eventDate = new Date('2025-06-30 13:20:30');

// Функция обновления таймера
function updateCountdown() {
  const now = new Date();
  // Разница в миллисекундах
  let diff = eventDate - now;

  // Не даём уйти в минус
  if (diff < 0) {
    diff = 0;
    // Если нужно, можно прекратить обновление после старта:
    clearInterval(countdownInterval);
  }

  // Вычисление дней, часов, минут
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Вывод в DOM, добавляем секунды для плавности (если нужно)
  document.getElementById('days').textContent    = String(days).padStart(2, '0');
  document.getElementById('hours').textContent   = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  // Если в разметке есть <span id="seconds">, можно добавить:
  // document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Запускаем сразу и раз в секунду
updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);


// Анимация при скролле (ваш существующий код)
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.slide-in');
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition  = window.innerHeight / 1.3;
    if (elementPosition < screenPosition) {
      element.style.animation = 'slide-in 0.7s ease forwards';
    }
  });
};

window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Инициализация при загрузке