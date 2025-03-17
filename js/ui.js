// 📂 js/ui.js - Manipulace s DOM

import { updateTask, deleteTaskFromDB } from "./api.js";

// ✅ Funkce pro vykreslení úkolu v seznamu
function renderTask(task, listElement) {
    const li = document.createElement("li"); // Vytvoření <li> elementu
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

// ✅ Funkce pro filtrování úkolů podle kategorie
function filterTasks(category) {
    const allTasks = document.querySelectorAll(".list-group-item");
    allTasks.forEach(task => {
        const taskCategoryElement = task.querySelector(".text-muted.d-block");
        if (taskCategoryElement) {
            const taskCategory = taskCategoryElement.innerText.split(": ")[1];
            task.style.display = category === "Vše" || taskCategory === category ? "" : "none";
        }
    });
}

// ✅ Přepnutí stavu úkolu (dokončený/nedokončený)
function toggleTaskCompletion(taskElement, task) {
    task.completed = !task.completed;
    updateTask(task._id, task.completed)
        .then(() => {
            taskElement.remove();
            renderTask(task, task.completed ? completedTasks : incompleteTasks);
        })
        .catch(err => console.error("Chyba při aktualizaci úkolu:", err.message));
}

// ✅ Smazání úkolu
function deleteTask(taskElement, task) {
    deleteTaskFromDB(task._id)
        .then(() => taskElement.remove())
        .catch(err => console.error("Chyba při mazání úkolu:", err.message));
}

// 📤 Export funkcí
export { renderTask, filterTasks, toggleTaskCompletion, deleteTask };
