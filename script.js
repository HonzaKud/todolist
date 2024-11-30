document.getElementById('todo-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const todoInput = document.getElementById('todo-input');
    const todoText = todoInput.value.trim();

    if (todoText) {
        addTodo(todoText);
        todoInput.value = '';
    }
});

function addTodo(text) {
    const todoList = document.getElementById('todo-list');
    const li = document.createElement('li');

    li.innerHTML = `
        <span>${text}</span>
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
}

function deleteTask(button) {
    const li = button.parentElement.parentElement;
    li.remove();
}
