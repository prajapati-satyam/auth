const mongoose = require("mongoose");

async function connectDB(params) {
    try {
        const connect = await mongoose.connect(process.env.DATABASE_URL)
        if (connect) {
            console.log("DB Connection DONE");
        } else {
            console.log("DB Connection failed");
        }
    } catch (err) {
        throw new Error("unable to connect DB", err)
    }
}

module.exports = connectDB;