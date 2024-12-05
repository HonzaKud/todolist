const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://jankudrnatt:Eurotel1477@cluster0.4lnoi.mongodb.net/todolist?retryWrites=true&w=majority", 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("MongoDB připojeno!");
    } catch (err) {
        console.error("Chyba při připojení k MongoDB:", err.message);
        process.exit(1); // Ukončí aplikaci při selhání připojení
    }
};

module.exports = connectDB;
