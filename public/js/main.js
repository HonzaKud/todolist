import { addTaskToDB, fetchTasks, updateTask, deleteTaskFromDB } from "./api.js";
import { renderTask, filterTasks, toggleTaskCompletion, deleteTask } from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoCategory = document.getElementById("todo-category");
    const todoDate = document.getElementById("todo-date");
    const incompleteTasks = document.getElementById("incomplete-tasks");
    const completedTasks = document.getElementById("completed-tasks");
    const filterCategory = document.getElementById("filter-category");

    // ✅ Načtení úkolů při načtení stránky
    try {
        const tasks = await fetchTasks();
        tasks.forEach(task => {
            renderTask(task, task.completed ? completedTasks : incompleteTasks);
        });
    } catch (err) {
        console.error("Chyba při načítání úkolů:", err.message);
    }

    // ✅ Přidání nového úkolu
    todoForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const taskText = todoInput.value.trim();
        const taskCategory = todoCategory.value;
        const taskDate = todoDate.value;
        
        if (!taskText || taskText.length < 3 || taskText.length > 100 || !taskDate) {
            alert("Prosím, zadejte platné údaje pro úkol.");
            return;
        }
        
        const newTask = { text: taskText, category: taskCategory, date: taskDate, completed: false };
        
        try {
            const savedTask = await addTaskToDB(newTask);
            renderTask(savedTask, incompleteTasks);
            todoForm.reset();
        } catch (err) {
            console.error("Chyba při ukládání úkolu:", err.message);
        }
    });

    // ✅ Změna filtru kategorií
    filterCategory.addEventListener("change", () => {
        filterTasks(filterCategory.value);
    });
});