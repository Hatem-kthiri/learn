const router = require("express").Router();
const Post = require("../models/Post");
const path = require("path");
const isAuth = require("../middlewares/isAuth");
const multer = require("multer");
const jwt = require("jsonwebtoken");

///////////////////////////

const fileUploadPaths = {
    FILE_UPLOAD_PATH: path.join(__dirname, "..", "client/public/uploads"),
};

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, fileUploadPaths.FILE_UPLOAD_PATH);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.toLowerCase().replace(/ /g, "_"));
    },
});

const postFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

let uploadPost = multer({
    storage: storage,
    fileFilter: postFilter,
});

router.post("/addPost", isAuth, uploadPost.single("img"), async (req, res) => {
    let newPost = {
        ...req.body,
        postAuthor: req.user._id,
        type: "text",
    };

    if (req.file) {
        const fileName = req.file.filename;
        newPost = {
            ...newPost,
            img: `${fileName}`,
        };
    }

    const savedPost = await new Post(newPost).save();

    return res.json({ status: 201, post: savedPost });
});

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find({});
        res.json({
            status: true,
            msg: "Ok",
            posts,
        });
    } catch (err) {
        console.log(err);
        res.json({ status: 500, message: err });
    }
});

router.get("/getCurrentPosts", isAuth, async (req, res) => {
    try {
        const currentPosts = await Post.find({ postAuthor: req.user._id });
        res.json({
            status: true,
            msg: "posts imported successfully",
            currentPosts,
        });
    } catch (err) {
        console.log(err);
        res.json({ status: 500, message: err });
    }
});

router.put("/updateCurrentPosts/:id", isAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const updatePost = await Post.findByIdAndUpdate(id, {
            ...req.body,
        });
        res.json({
            status: true,
            msg: "post updated successfully",
            updatePost,
        });
    } catch (err) {
        console.log(err);
        res.json({ status: 500, message: err });
    }
});

router.delete("/deleteCurrentPosts/:id", isAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const deletePost = await Post.findByIdAndDelete(id);
        res.json({
            status: true,
            msg: "post deleted successfully",
            deletePost,
        });
    } catch (err) {
        console.log(err);
        res.json({ status: 500, message: err });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findOne({
            _id: id,
        }).populate("postAuthor", "userName  -_id");
        res.json({ status: 200, msg: "Ok", post });
    } catch (err) {
        console.log(err);
        res.json({ status: 500, message: err });
    }
});

module.exports = router;
