import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";

// ✅ Vytvoření Express aplikace
const app = express();

// ✅ Middleware
app.use(cors({ origin: "https://honzakud.github.io", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
app.use(express.json());

// ✅ Testovací route
app.get("/", (req, res) => {
    res.send("✅ API běží a je připojeno k databázi!");
});

// ✅ Použití rout
app.use("/api/tasks", taskRoutes);

// ✅ Middleware pro neexistující routy (404)
app.use((req, res) => {
    res.status(404).json({ message: "Endpoint nenalezen." });
});

// ✅ Export aplikace
export default app;