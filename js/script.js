document.addEventListener('DOMContentLoaded', () => {

  // --- Clock & Greeting ---
  const clockEl = document.getElementById('clock');
  const dateEl = document.getElementById('date');
  const greetingEl = document.getElementById('greeting');

  function updateClock() {
    const now = new Date();
    
    clockEl.textContent = now.toTimeString().split(' ')[0];
    
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);

    const hours = now.getHours();
    let greeting = 'Good Morning';
    if (hours >= 12 && hours < 18) greeting = 'Good Afternoon';
    else if (hours >= 18) greeting = 'Good Evening';

    greetingEl.textContent = greeting;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --- Focus Timer ---
  let timeLeft = 25 * 60;
  let timerId = null;
  const timerDisplay = document.getElementById('timer-display');

  function renderTimer() {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
  }

  document.getElementById('start-btn').addEventListener('click', () => {
    if (timerId) return;
    timerId = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        renderTimer();
      } else {
        clearInterval(timerId);
        timerId = null;
      }
    }, 1000);
  });

  document.getElementById('stop-btn').addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
  });

  document.getElementById('reset-btn').addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 25 * 60;
    renderTimer();
  });

  // --- Tasks (To-Do) ---
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const todoError = document.getElementById('todo-error');

  let todos = JSON.parse(localStorage.getItem('todos')) || [
    { text: 'belanja', completed: false },
    { text: 'belajar', completed: false }
  ];

  function renderTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    todoList.innerHTML = '';
    todos.forEach((todo, i) => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <div class="todo-item-left">
          <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${i})">
          <span>${todo.text}</span>
        </div>
        <button class="btn btn-red" onclick="deleteTodo(${i})">Delete</button>
      `;
      todoList.appendChild(li);
    });
  }

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    todoError.textContent = '';

    if (todos.some(t => t.text.toLowerCase() === text.toLowerCase())) {
      todoError.textContent = 'Task already exists!';
      return;
    }

    todos.push({ text, completed: false });
    todoInput.value = '';
    renderTodos();
  });

  window.toggleTodo = (i) => {
    todos[i].completed = !todos[i].completed;
    renderTodos();
  };

  window.deleteTodo = (i) => {
    todos.splice(i, 1);
    renderTodos();
  };

  renderTodos();

  // --- Quick Links ---
  const linkForm = document.getElementById('link-form');
  const linkName = document.getElementById('link-name');
  const linkUrl = document.getElementById('link-url');
  const linksContainer = document.getElementById('links-container');

  let links = JSON.parse(localStorage.getItem('quick_links')) || [
    { name: 'Google', url: 'https://google.com' },
    { name: 'Gmail', url: 'https://gmail.com' },
    { name: 'Calendar', url: 'https://calendar.google.com' }
  ];

  function renderLinks() {
    localStorage.setItem('quick_links', JSON.stringify(links));
    linksContainer.innerHTML = '';
    links.forEach((link, i) => {
      const a = document.createElement('a');
      a.className = 'link-tag';
      a.href = link.url;
      a.target = '_blank';
      a.innerHTML = `
        ${link.name}
        <button class="del-btn" onclick="event.preventDefault(); deleteLink(${i})">✕</button>
      `;
      linksContainer.appendChild(a);
    });
  }

  linkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    links.push({ name: linkName.value.trim(), url: linkUrl.value.trim() });
    linkName.value = '';
    linkUrl.value = '';
    renderLinks();
  });

  window.deleteLink = (i) => {
    links.splice(i, 1);
    renderLinks();
  };

  renderLinks();
});
