import mongoose from "mongoose"; 

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
        required: true,
        validate: {
            validator: function(value) {
                return !isNaN(Date.parse(value)); // Ověří, zda je datum platné
            },
            message: "Neplatný formát data."
        }
    },
    completed: { 
        type: Boolean, 
        default: false //Vychozi hodnota je false
    },
}, {timestamps: true}); // Automacky prida createAt a updateAt pole

export default mongoose.model("Task", TaskSchema);