document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoCategory = document.getElementById("todo-category");
    const todoDate = document.getElementById("todo-date");
    const incompleteTasks = document.getElementById("incomplete-tasks");
    const completedTasks = document.getElementById("completed-tasks");
    const loginScreen = document.getElementById("login-screen");
    const loginForm = document.getElementById("login-form");
    const todoApp = document.getElementById("todo-app");

    // Zpracování přihlášení
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Zabraň reloadu stránky

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {
            const response = await fetch("https://todolist-x2d9.onrender.com/api/login", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Uložení tokenu a přepnutí na hlavní aplikaci
                localStorage.setItem("token", data.token);
                loginScreen.style.display = "none";
                todoApp.style.display = "block";
                alert("Přihlášení úspěšné!");
                loadTasksFromBackend(); // Načíst úkoly po přihlášení
            } else {
                alert(`Chyba: ${data.message}`);
            }
        } catch (err) {
            console.error("Chyba při přihlášení:", err.message);
            alert("Nelze se připojit k serveru. Zkuste to znovu.");
        }
    });

    async function addTask(event) {
        event.preventDefault(); // Zabraň odeslání formuláře

        const taskText = todoInput.value.trim();
        const taskCategory = todoCategory.value;
        const taskDate = todoDate.value;

        if (!taskText || !taskDate) {
            alert("Prosím, vyplňte všechny údaje.");
            return;
        }

        const newTask = {
            text: taskText,
            category: taskCategory,
            date: taskDate,
            completed: false,
        };

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://todolist-x2d9.onrender.com/api/tasks", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(newTask),
            });

            const savedTask = await response.json();

            if (response.ok) {
                // Přidání úkolu do DOM
                renderTask(savedTask, incompleteTasks);
                alert("Úkol přidán!");
                // Vymazání formuláře
                todoInput.value = "";
                todoDate.value = "";
            } else {
                alert("Chyba při ukládání úkolu.");
            }
        } catch (err) {
            console.error("Chyba při ukládání úkolu:", err.message);
            alert("Nepodařilo se uložit úkol. Zkuste to znovu.");
        }
    }

    async function loadTasksFromBackend() {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://todolist-x2d9.onrender.com/api/tasks", {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                },
            });
            const tasks = await response.json();

            if (response.ok) {
                tasks.forEach(task => {
                    if (task.completed) {
                        renderTask(task, completedTasks); // Vykresli dokončené úkoly
                    } else {
                        renderTask(task, incompleteTasks); // Vykresli nedokončené úkoly
                    }
                });
            } else {
                alert("Nepodařilo se načíst úkoly.");
            }
        } catch (err) {
            console.error("Chyba při načítání úkolů z backendu:", err.message);
        }
    }

    // Událost pro odeslání formuláře
    todoForm.addEventListener("submit", addTask);

    // Další funkce jako renderTask, toggleTaskCompletion, deleteTask zůstávají stejné
});
