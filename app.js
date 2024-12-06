const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Připojení databáze
const Task = require("./models/Task"); // Importuj model Task

const app = express();

// Připojení k MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: "https://honzakud.github.io", // Povolený origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Povolené metody
    credentials: true // Pokud je potřeba předávat cookies nebo ověřování
}));

// Testovací route
app.get("/", (req, res) => {
    res.send("Aplikace je připojena k databázi!");
});

// Start serveru
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));

// Endpoint pro přidání nového úkolu
app.post("/api/tasks", async (req, res) => {
    console.log("Přijatý požadavek:", req.body);

    const { text, category, date } = req.body;

    if (!text || !category || !date) {
        console.log("Chyba: Nevyplněné údaje.");
        return res.status(400).json({ message: "Všechny údaje jsou povinné." });
    }

    try {
        const task = new Task({
            text,
            category,
            date,
            completed: false,
        });

        await task.save();
        console.log("Úkol uložen:", task);
        res.status(201).json(task);
    } catch (err) {
        console.error("Chyba při ukládání úkolu:", err.message);
        res.status(500).json({ message: "Chyba serveru." });
    }
});

// Endpoint pro získání všech úkolů
app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find(); // Najde všechny úkoly v databázi
        res.status(200).json(tasks); // Vrátí úkoly jako JSON
    } catch (err) {
        console.error("Chyba při načítání úkolů:", err.message);
        res.status(500).json({ message: "Chyba serveru." });
    }
});

// Endpoint pro smazání úkolu
app.delete("/api/tasks/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByIdAndDelete(id); // Najde a smaže úkol podle ID
        if (!task) {
            return res.status(404).json({ message: "Úkol nebyl nalezen." });
        }
        res.status(200).json({ message: "Úkol byl úspěšně smazán." });
    } catch (err) {
        console.error("Chyba při mazání úkolu:", err.message);
        res.status(500).json({ message: "Chyba serveru." });
    }
});

// Endpoint pro aktualizaci úkolu
app.put("/api/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(
            id,
            { completed },
            { new: true } // Vrátí aktualizovaný dokument
        );

        if (!task) {
            return res.status(404).json({ message: "Úkol nenalezen." });
        }

        res.status(200).json(task);
    } catch (err) {
        console.error("Chyba při aktualizaci úkolu:", err.message);
        res.status(500).json({ message: "Chyba serveru." });
    }
});
