const mongoose = require("mongoose");
require("dotenv").config();
const mongoURI = process.env.MONGO_URI;

const connectDB = () =>
    mongoose
        .connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("connected to DB"))
        .catch((err) => console.log(err));

module.exports = connectDB;
