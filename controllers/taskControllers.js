import Task from "../models/Task.js";

// ✅ Získání všech úkolů
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        console.error("❌ Chyba při načítání úkolů:", err.message);
        res.status(500).json({ message: "Chyba při načítání úkolů." });
    }
};

// ✅ Přidání nového úkolu s validací
export const addTask = async (req, res) => {
    try {
        const { text, category, date } = req.body;

        // 🔍 Ověření, že všechny údaje jsou vyplněné
        if (!text || !category || !date) {
            return res.status(400).json({ message: "Všechny údaje jsou povinné." });
        }

        // 🔍 Kontrola délky textu (3-100 znaků)
        if (text.length < 3 || text.length > 100) {
            return res.status(400).json({ message: "Text úkolu musí mít 3 až 100 znaků." });
        }

        // 🔍 Ověření platnosti data
        if (isNaN(Date.parse(date))) {
            return res.status(400).json({ message: "Datum musí být ve správném formátu." });
        }

        const task = new Task({ text, category, date, completed: false });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        console.error("❌ Chyba při ukládání úkolu:", err.message);
        res.status(500).json({ message: "Chyba při ukládání úkolu." });
    }
};

// ✅ Aktualizace úkolu s validací
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;

        // 🔍 Ověření, že completed je boolean
        if (typeof completed !== "boolean") {
            return res.status(400).json({ message: "Pole 'completed' musí být boolean (true/false)." });
        }

        const task = await Task.findByIdAndUpdate(id, { completed }, { new: true });

        if (!task) {
            return res.status(404).json({ message: "Úkol nenalezen." });
        }

        res.status(200).json(task);
    } catch (err) {
        console.error("❌ Chyba při aktualizaci úkolu:", err.message);
        res.status(500).json({ message: "Chyba při aktualizaci úkolu." });
    }
};

// ✅ Smazání úkolu s validací
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ message: "Úkol nenalezen." });
        }

        res.status(200).json({ message: "Úkol úspěšně smazán." });
    } catch (err) {
        console.error("❌ Chyba při mazání úkolu:", err.message);
        res.status(500).json({ message: "Chyba při mazání úkolu." });
    }
};
