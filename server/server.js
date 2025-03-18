import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

        // ✅ Middleware
        app.use(cors({ origin: "https://honzakud.github.io", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
        app.use(express.json());

        // ✅ Základní testovací route
        app.get("/", (req, res) => {
            res.send("✅ API běží a je připojeno k databázi!");
        });

        // ✅ Použití rout
        app.use("/api/tasks", taskRoutes);

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
