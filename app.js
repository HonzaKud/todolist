const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Připojení databáze
const User = require("./models/User"); // Import modelu uživatele
const jwt = require("jsonwebtoken"); // Pro práci s JSON Web Tokeny
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


app.use((req, res, next) => {
    console.log("CORS Middleware - origin:", req.headers.origin); //v
    next();
});

app.use(express.json()); // Přidání middleware pro zpracování JSON dat

// Endpoint pro registraci uživatele
app.post("/api/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Vyplňte všechna pole" });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Uživatel již existuje" });
        }

        const user = await User.create({ name, email, password });
        const token = jwt.sign({ id: user._id }, "tajny_klic", { expiresIn: "30d" });

        res.status(201).json({ token });
    } catch (error) {
        console.error("Chyba při registraci uživatele:", error.message);
        res.status(500).json({ message: "Chyba serveru" });
    }
});

// Endpoint pro přihlášení uživatele
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Vyplňte všechna pole" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Uživatel neexistuje" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Špatné heslo" });
        }

        const token = jwt.sign({ id: user._id }, "tajny_klic", { expiresIn: "30d" });
        res.status(200).json({ token });
    } catch (error) {
        console.error("Chyba při přihlášení uživatele:", error.message);
        res.status(500).json({ message: "Chyba serveru" });
    }
});

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Přístup odmítnut, není poskytnut žádný token" });
    }

    try {
        const decoded = jwt.verify(token, "tajny_klic");
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Neplatný token" });
    }
};


// Testovací route
app.get("/", (req, res) => {
    res.send("Aplikace je připojena k databázi!");
});

// Start serveru
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));


async function login(email, password) {
    try {
        const response = await fetch("https://todolist-x2d9.onrender.com/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Uložení tokenu do localStorage
            localStorage.setItem("token", data.token);
            alert("Přihlášení bylo úspěšné!");
        } else {
            alert(`Chyba při přihlášení: ${data.message}`);
        }
    } catch (err) {
        console.error("Chyba při přihlášení:", err.message);
        alert("Došlo k chybě. Zkontrolujte své připojení a zkuste to znovu.");
    }
}


// Endpoint pro přidání nového úkolu
app.post("/api/tasks", authenticate, async (req, res) => {
    const { text, category, date } = req.body;

    if (!text || !category || !date) {
        return res.status(400).json({ message: "Všechny údaje jsou povinné." });
    }

    try {
        const task = new Task({
            text,
            category,
            date,
            completed: false,
            userId: req.user.id, // Spojení úkolu s uživatelem
        });

        await task.save();
        res.status(201).json(task);
    } catch (err) {
        console.error("Chyba při ukládání úkolu:", err.message);
        res.status(500).json({ message: "Chyba serveru." });
    }
});


// Endpoint pro získání všech úkolů
app.get("/api/tasks", authenticate, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }); // Najde úkoly přihlášeného uživatele
        res.status(200).json(tasks); // Vrátí úkoly jako JSON
    } catch (err) {
        console.error("Chyba při načítání úkolů:", err.message);
        res.status(500).json({ message: "Chyba serveru." });
    }
});


// Endpoint pro smazání úkolu
app.delete("/api/tasks/:id", authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!task) {
            return res.status(404).json({ message: "Úkol nebyl nalezen nebo nemáte oprávnění." });
        }
        res.status(200).json({ message: "Úkol byl úspěšně smazán." });
    } catch (err) {
        console.error("Chyba při mazání úkolu:", err.message);
        res.status(500).json({ message: "Chyba serveru." });
    }
});

// Endpoint pro aktualizaci úkolu
app.put("/api/tasks/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    try {
        const task = await Task.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { completed },
            { new: true } // Vrátí aktualizovaný dokument
        );

        if (!task) {
            return res.status(404).json({ message: "Úkol nebyl nalezen nebo nemáte oprávnění." });
        }

        res.status(200).json(task);
    } catch (err) {
        console.error("Chyba při aktualizaci úkolu:", err.message);
        res.status(500).json({ message: "Chyba serveru." });
    }
});
