import express from "express";
import { getTasks, addTask, updateTask, deleteTask } from "../controllers/taskController.js";
import { validateTaskId } from "../middleware/validation.js"; // (Volitelný middleware pro validaci ID)

const router = express.Router({ mergeParams: true });

// ✅ Definice endpointů
router.get("/", getTasks); // Získání všech úkolů
router.post("/", addTask); // Přidání nového úkolu
router.put("/:id", validateTaskId, updateTask); // Aktualizace úkolu s validací ID
router.delete("/:id", validateTaskId, deleteTask); // Smazání úkolu s validací ID

export default router;
