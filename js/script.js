document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoCategory = document.getElementById("todo-category");
    const todoDate = document.getElementById("todo-date");
    const incompleteTasks = document.getElementById("incomplete-tasks");
    const completedTasks = document.getElementById("completed-tasks");

    // Funkce pro přidání úkolu
    function addTask(event) {
        event.preventDefault(); // Zabraň odeslání formuláře

        const taskText = todoInput.value.trim();
        const taskCategory = todoCategory.value;
        const taskDate = todoDate.value;

        if (!taskText || !taskDate) {
            alert("Prosím, vyplňte všechny údaje.");
            return;
        }

        const task = {
            text: taskText,
            category: taskCategory,
            date: taskDate,
            completed: false
        };

        // Přidání úkolu do DOM
        renderTask(task, incompleteTasks);

        // Uložení úkolu do LocalStorage
        saveTaskToLocalStorage(task);

        // Vymazání formuláře
        todoInput.value = "";
        todoDate.value = "";
    }


    const filterCategory = document.getElementById("filter-category");

// Událost pro změnu filtru
filterCategory.addEventListener("change", () => {
    const selectedCategory = filterCategory.value;
    filterTasks(selectedCategory);
});

function filterTasks(category) {
    const allTasks = document.querySelectorAll(".list-group-item");
    console.log("Počet nalezených úkolů:", allTasks.length);

    allTasks.forEach(task => {
        const taskCategoryElement = task.querySelector(".text-muted.d-block");
        if (taskCategoryElement) {
            const taskCategory = taskCategoryElement.innerText.split(": ")[1];
            console.log("Úkol:", task.innerText.trim(), "Kategorie:", taskCategory);

            // Zobraz nebo skryj úkol podle filtru
            if (category === "Vše" || taskCategory === category) {
                task.style.display = ""; // Zobrazit úkol
                console.log("Zobrazeno úkol:", task.innerText.trim());
            } else {
                task.style.display = "none"; // Skrytí úkolu
                console.log("Skryto úkol:", task.innerText.trim());
            }
        } else {
            console.log("Kategorie nebyla nalezena u úkolu:", task.innerText.trim());
        }
    });
}




    // Funkce pro vykreslení úkolu
    function renderTask(task, listElement) {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        li.innerHTML = `
            <div>
                <strong>${task.text}</strong>
                <small class="text-muted d-block">Kategorie: ${task.category}</small>
                <small class="text-muted d-block">Do: ${task.date}</small>
            </div>
            <div>
                <button class="btn btn-success btn-sm me-2 mark-complete">${task.completed ? "⟲" : "✔"}</button>
                <button class="btn btn-danger btn-sm delete-task">✖</button>
            </div>
        `;
        

        li.querySelector(".mark-complete").addEventListener("click", () => toggleTaskCompletion(li, task));
        li.querySelector(".delete-task").addEventListener("click", () => deleteTask(li, task));

        listElement.appendChild(li);
    }

    // Funkce pro uložení úkolu do LocalStorage
    function saveTaskToLocalStorage(task) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Funkce pro načtení úkolů z LocalStorage
    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            if (task.completed) {
                renderTask(task, completedTasks);
            } else {
                renderTask(task, incompleteTasks);
            }
        });
    }

    // Funkce pro označení úkolu jako dokončený/nedokončený
    function toggleTaskCompletion(taskElement, task) {
        task.completed = !task.completed;
        updateTaskInLocalStorage(task);
        taskElement.remove();
        if (task.completed) {
            renderTask(task, completedTasks);
        } else {
            renderTask(task, incompleteTasks);
        }
    }

    // Funkce pro smazání úkolu
    function deleteTask(taskElement, task) {
        taskElement.remove();
        removeTaskFromLocalStorage(task);
    }

    // Funkce pro aktualizaci úkolu v LocalStorage
    function updateTaskInLocalStorage(task) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const updatedTasks = tasks.map(t => (t.text === task.text && t.date === task.date ? task : t));
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }

    // Funkce pro smazání úkolu z LocalStorage
    function removeTaskFromLocalStorage(task) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const updatedTasks = tasks.filter(t => !(t.text === task.text && t.date === task.date));
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }

    // Načtení úkolů při načtení stránky
    loadTasksFromLocalStorage();

    // Událost pro odeslání formuláře
    todoForm.addEventListener("submit", addTask);
});
