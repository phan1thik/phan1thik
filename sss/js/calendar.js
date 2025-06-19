// 🔐 Проверка авторизации
if (localStorage.getItem("authorized") !== "true") {
  window.location.href = "login.html";
}

const grid = document.getElementById("dayGrid");
const markedDays = JSON.parse(localStorage.getItem("markedDays") || "[]");

// 📅 Получаем сегодняшнюю дату
const today = new Date();
const todayDay = today.getDate();

// ✅ Создание календаря
for (let i = 1; i <= 30; i++) {
  const day = document.createElement("div");
  day.className = "day";
  day.textContent = i;

  if (markedDays.includes(i)) {
    day.classList.add("active");
  }

  day.addEventListener("click", () => {
    if (i > todayDay) {
      alert("Нельзя отмечать будущие дни!");
      return;
    }

    if (!markedDays.includes(i)) {
      markedDays.push(i);
      localStorage.setItem("markedDays", JSON.stringify(markedDays));
      day.classList.add("active");
    } else {
      alert("Этот день уже отмечен!");
    }
  });

  grid.appendChild(day);
}

// 📝 Ежедневные задания
const dailyTasks = document.querySelectorAll("#dailyTasks input");
const weeklyTasks = document.querySelectorAll("#weeklyTasks input");

// 📆 Проверка даты последнего выполнения
const lastDailyReset = localStorage.getItem("lastDailyReset");
const todayDateStr = today.toISOString().split("T")[0];

if (lastDailyReset !== todayDateStr) {
  // Новый день — сбросить задания
  dailyTasks.forEach((task, index) => {
    task.checked = false;
  });
  localStorage.setItem("lastDailyReset", todayDateStr);
  localStorage.removeItem("dailyTasksState");
} else {
  // Восстановить состояние
  const savedState = JSON.parse(localStorage.getItem("dailyTasksState") || "[]");
  dailyTasks.forEach((task, index) => {
    task.checked = savedState[index] || false;
  });
}

// Сохранение ежедневных заданий
dailyTasks.forEach((task, index) => {
  task.addEventListener("change", () => {
    const state = Array.from(dailyTasks).map(t => t.checked);
    localStorage.setItem("dailyTasksState", JSON.stringify(state));
  });
});

// 🗓 Еженедельные задания (сохраняются вручную)
const savedWeekly = JSON.parse(localStorage.getItem("weeklyTasksState") || "[]");
weeklyTasks.forEach((task, index) => {
  task.checked = savedWeekly[index] || false;

  task.addEventListener("change", () => {
    const state = Array.from(weeklyTasks).map(t => t.checked);
    localStorage.setItem("weeklyTasksState", JSON.stringify(state));
  });
})