const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    postAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    postDate: {
        type: Date,
        default: Date.now(),
    },
    postDescription: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
});

module.exports = mongoose.model("post", postSchema);
