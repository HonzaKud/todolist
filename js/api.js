// api.js zpracovava komunikaci s backendem

const API_URL = "https://todolist-x2d9.onrender.com/api/tasks";


// Funkce pro pridani ukolu do databaze
async function addTaskToDB(task) {
    try{
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
        });
        return await response.json();
    } catch (err) {
        console.error("Chzba pro ukladani ukolu:", err.message);
        throw new Error("Nepodarilo se ulozit ukol.");
    }
}

// Funkce pro nacteni ukolu z databaze
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        return await response.json();
    } catch (err) {
        console.error("Chyba pri nacitani ukolu:", err.message);
        throw new Error("Nepodarilo se nacist ukoly.");
    }
}

//Funkce pro aktualizace ukolu (oznaceni za hotovy)
async function updateTask(taskId, completed) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed }),
        });
        return await response.json();
        } catch (err) {
            console.error("Chyba pri aktualizaci ukolu:", err.message);
            throw new Error("Nepodarilo se aktualizovat ukol.");
        }
}

// Funkce pro smazani ukolu
async function deleteTaskFromDB(taskId) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: "DELETE",
    });
    if(!response.ok) throw new Error("Chyba pri mazani ukolu");
    } catch (err) {
        console.error("Chyba pri mazani ukolu:", err.message);
        throw new Error("Nepodarilo se smazat ukol.");
    }
}

// Export funkci
export {addTaskToDB, fetchTasks, updateTask, deleteTaskFromDB};