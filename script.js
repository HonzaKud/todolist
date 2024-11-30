// Načti úkoly z LocalStorage při načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    document.getElementById('filter-category').addEventListener('change', filterTodos);
});

// Přidávání úkolů
document.getElementById('todo-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const todoInput = document.getElementById('todo-input');
    const todoCategory = document.getElementById('todo-category');
    const todoText = todoInput.value.trim();
    const category = todoCategory.value;

    if (todoText) {
        addTodo(todoText, category);
        saveTodoToLocalStorage(todoText, category);
        todoInput.value = '';
    }
});

function addTodo(text, category, completed = false) {
    const todoList = document.getElementById('todo-list');
    const li = document.createElement('li');
    li.className = completed ? 'completed' : '';
    li.dataset.category = category;

    li.innerHTML = `
        <span>${text} <em>(${category})</em></span>
        <div>
            <button onclick="markComplete(this)">Complete</button>
            <button onclick="deleteTask(this)">Delete</button>
        </div>
    `;

    todoList.appendChild(li);
}

function markComplete(button) {
    const li = button.parentElement.parentElement;
    li.classList.toggle('completed');
    updateLocalStorage();
}

function deleteTask(button) {
    const li = button.parentElement.parentElement;
    li.remove();
    updateLocalStorage();
}

// Ukládání do LocalStorage
function saveTodoToLocalStorage(text, category) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push({ text, category, completed: false });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateLocalStorage() {
    const todos = [];
    const todoItems = document.querySelectorAll('#todo-list li');
    todoItems.forEach(li => {
        const text = li.querySelector('span').textContent.split(' (')[0];
        const category = li.dataset.category;
        const completed = li.classList.contains('completed');
        todos.push({ text, category, completed });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => addTodo(todo.text, todo.category, todo.completed));
}

function filterTodos() {
    const selectedCategory = document.getElementById('filter-category').value;
    const todoItems = document.querySelectorAll('#todo-list li');

    todoItems.forEach(li => {
        if (selectedCategory === 'Vše' || li.dataset.category === selectedCategory) {
            li.style.display = ''; // Zobraz úkol
        } else {
            li.style.display = 'none'; // Skryj úkol
        }
    });
}
