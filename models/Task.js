const mongoose = require("mongoose"); // Nacteni knihovny Mongoose pro praci s MongoDB

const TaskSchema = new mongoose.Schema({ // Definice schematu pro ukoly (Tasks)
    text: { 
        type: String, 
        required: true,
        trim: true, // Odstranneni mezery na zacatku a na konci
        minlength: 3, // Minimalni delka textu
        maxlength: 100 // Maximalni delka textu
    },
    category: { // Kategorie úkolu (např. "Práce", "Osobní", "Škola")
        type: String, 
        required: true, 
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    date: { 
        type: Date, 
        required: true 
    },
    completed: { 
        type: Boolean, 
        default: false //Vychozi hodnota je false
    },
}, {timestamps: true}); // Automacky prida createAt a updateAt pole

module.exports = mongoose.model("Task", TaskSchema); // Export modelu Task, MongoDB vytvori kolekci tasks