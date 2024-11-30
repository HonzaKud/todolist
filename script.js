// Načti úkoly z LocalStorage při načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    document.getElementById('filter-category').addEventListener('change', applyFiltersAndSorting);
    document.getElementById('filter-date').addEventListener('change', applyFiltersAndSorting);
    document.getElementById('sort-options').addEventListener('change', applyFiltersAndSorting);
});

// Přidávání úkolů
document.getElementById('todo-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const todoInput = document.getElementById('todo-input');
    const todoCategory = document.getElementById('todo-category');
    const todoDate = document.getElementById('todo-date');
    const todoText = todoInput.value.trim();
    const category = todoCategory.value;
    const dueDate = todoDate.value;

    if (todoText && dueDate) {
        addTodo(todoText, category, dueDate);
        saveTodoToLocalStorage(todoText, category, dueDate);
        todoInput.value = '';
    }
});

function addTodo(text, category, dueDate, completed = false) {
    const todoList = document.getElementById('todo-list');
    const li = document.createElement('li');
    li.className = `list-group-item d-flex justify-content-between align-items-center ${completed ? 'completed' : ''}`;
    li.dataset.category = category;
    li.dataset.dueDate = dueDate;
    li.dataset.completed = completed;

    li.innerHTML = `
        <span>${text} <em>(${category})</em></span>
        <div><small>Do: ${dueDate}</small></div>
        <div>
            <button onclick="markComplete(this)" class="btn btn-success btn-sm">Complete</button>
            <button onclick="deleteTask(this)" class="btn btn-danger btn-sm">Delete</button>
        </div>
    `;

    todoList.appendChild(li);
}

function markComplete(button) {
    const li = button.parentElement.parentElement;
    li.classList.toggle('completed');
    li.dataset.completed = li.classList.contains('completed');
    updateLocalStorage();
}

function deleteTask(button) {
    const li = button.parentElement.parentElement;
    li.remove();
    updateLocalStorage();
}

// Ukládání do LocalStorage
function saveTodoToLocalStorage(text, category, dueDate) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push({ text, category, dueDate, completed: false });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateLocalStorage() {
    const todos = [];
    const todoItems = document.querySelectorAll('#todo-list li');
    todoItems.forEach(li => {
        const text = li.querySelector('span').textContent.split(' (')[0];
        const category = li.dataset.category;
        const dueDate = li.dataset.dueDate;
        const completed = li.classList.contains('completed');
        todos.push({ text, category, dueDate, completed });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => addTodo(todo.text, todo.category, todo.dueDate, todo.completed));
}

function applyFiltersAndSorting() {
    const selectedCategory = document.getElementById('filter-category').value;
    const selectedDate = document.getElementById('filter-date').value;
    const sortOption = document.getElementById('sort-options').value;
    const todoItems = Array.from(document.querySelectorAll('#todo-list li'));

    // Filtrování
    todoItems.forEach(li => {
        const matchesCategory = selectedCategory === 'Vše' || li.dataset.category === selectedCategory;
        const matchesDate = !selectedDate || new Date(li.dataset.dueDate) <= new Date(selectedDate);

        li.style.display = matchesCategory && matchesDate ? '' : 'none';
    });

    // Řazení
    const visibleItems = todoItems.filter(li => li.style.display !== 'none');
    visibleItems.sort((a, b) => {
        switch (sortOption) {
            case 'date-asc':
                return new Date(a.dataset.dueDate) - new Date(b.dataset.dueDate);
            case 'date-desc':
                return new Date(b.dataset.dueDate) - new Date(a.dataset.dueDate);
            case 'status':
                return a.dataset.completed === b.dataset.completed ? 0 : a.dataset.completed === 'true' ? 1 : -1;
            case 'category':
                return a.dataset.category.localeCompare(b.dataset.category);
            default:
                return 0;
        }
    });

    const todoList = document.getElementById('todo-list');
    visibleItems.forEach(item => todoList.appendChild(item));
}
