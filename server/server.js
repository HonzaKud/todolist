import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";

// ✅ Načtení konfigurace z .env
dotenv.config();

// ✅ Připojení k databázi s ošetřením chyb
const startServer = async () => {
    try {
        await connectDB();
        console.log("✅ Připojeno k databázi MongoDB");

        // ✅ Vytvoření Express aplikace
        const app = express();

        // 📍 Získání __dirname pro práci s cestami
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // 📂 Nastavení složky public jako statické
        app.use(express.static(path.join(__dirname, "public")));

        // ✅ Middleware
        app.use(cors({ 
            origin: "https://honzakud.github.io", 
            methods: ["GET", "POST", "PUT", "DELETE"], 
            credentials: true 
        }));
        app.use(express.json());

        // ✅ Použití API rout
        app.use("/api/tasks", taskRoutes);

        // 🏠 Odpověď na hlavní GET požadavek – vrátí index.html
        app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "index.html"));
        });   

        // ✅ Middleware pro neexistující routy (404)
        app.use((req, res) => {
            res.status(404).json({ message: "Endpoint nenalezen." });
        });

        // ✅ Spuštění serveru
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Server běží na portu ${PORT}`));

    } catch (err) {
        console.error("❌ Chyba při spouštění serveru:", err.message);
        process.exit(1); // Ukončení aplikace při fatální chybě
    }
};

// ✅ Spuštění serveru
startServer();

// ✅ Ošetření fatálních chyb (prevence pádu serveru)
process.on("uncaughtException", (err) => {
    console.error("❌ Nezachycená chyba:", err.message);
    process.exit(1);
});
