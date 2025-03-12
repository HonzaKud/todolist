const mongoose = require("mongoose"); // Nacteni knihovny Mongoose pro praci s MongoDB

require("dotenv").config(); // Nacteni knihovny dovenv, ktera umoznuje cist promenne z .env souboru

//Overeni, ze existuje MONGO_URI v souboru .env
if (!process.env.MONGO_URI) {
    console.error("Chyba: Chybi MONGO_URI v .env souboru!"); //Chybova zprava, pokud promenna neni nastavena
process.exit(1); //Ukonceni aplikace s chybivym kodem 1 (coz znamena chyba)
    
}

// Funkce pro primojeni k MongoDB s 5x opakovanim pro selhani
const connectDB = async (retries = 5, delay = 5000) => {
    // Cyklus pro opakovani pripojeni, pokud se nepovede na prvni pokus
    for (let i = 0; i < retries; i++) {
    try {
        await mongoose.connect(process.env.MONGO_URI);  //Pokus o pripojeni k databazi MongoDB pomoci Mongoose

        console.log(`MongoDB pripojeno: ${mongoose.connection.host}`); // Vypis informace o uspesnem pripojeni pripojeni k MongoDB

        return; // Pokud se pripojeni podari, ukoncime funkci a nezkousime dalsi pokusy

        } catch(err) {
console.error(`Chyba pri pripojeni k MongoDB (pokus ${i+1} z ${retries}):`, err.message); // Vypis chyby, pokud se pripojeni nepodari

if (i < retries-1) { //Pokud to neni posledni pokus, cekame a zkusime to znovu
    console.log(`Opakuji pripojeni za ${delay / 1000} sekund...`);

    await new Promise(resolve=>setTimeout(resolve, delay)); //Pockame stanovenou dobu (delay) a zkusime znovu
} else {
    throw new Error("Nepodarilo se pripojit k MongoDB po vice pokusech"); //Pokud selzou vsechny pokusy, vyhodime fatalni chybu
}
        }
    }
};

process.on("SIGINT", async () => { //Korektni odpojeni od MongoDB pri ukonceni aplikace
    await mongoose.connection.close(); // Zavreni spojeni s databazi
    console.log("MongoDB odpojena. Aplikace ukoncena."); //Informace o odpojeni
    process.exit(0); // Ukonceni aplikace s kodem 0 (coz znamena normalni ukonceni)
});

module.exports = connectDB; // Exportujeme funkci connectDB, aby bylo mozne pouzit v jinych souborech aplikace