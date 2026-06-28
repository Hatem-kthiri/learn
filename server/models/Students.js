const mongoose = require("mongoose");

const studentsSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },
    track: [],
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
        default: "hd_dp.jpg",
    },
    score: {
        type: String,
    },
});

module.exports = mongoose.model("student", studentsSchema);
