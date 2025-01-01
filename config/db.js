const mongoose = require("mongoose");
require("dotenv").config(); // Načtení proměnných z .env souboru

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB připojeno!");
    } catch (err) {
        console.error("Chyba při připojení k MongoDB:", err.message);
        process.exit(1); // Ukončí aplikaci při selhání připojení
    }
};

module.exports = connectDB;
