const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificateController");

router.get("/status/:studentId/:courseId", certificateController.getStatus);
router.post("/generate/:studentId/:courseId", certificateController.generate);
router.get("/:id/download", certificateController.download);
router.get("/verify/:code", certificateController.verify); // public, no auth

module.exports = router;
