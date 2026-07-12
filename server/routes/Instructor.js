const express = require("express");
const router = express.Router();
const Checkpoint = require("../models/Checkpoint");
const Guild = require("../models/Guild");
const Student = require("../models/Student");
const Instructor = require("../models/Instructor");
const { makeUploader } = require("../config/cloudinary");
const upload = makeUploader("profile");
const validate = require("../middlewares/validate");
const v = require("../validators/instructorValidators");
router.get("/get-guild-students", validate(v.guildQuery), async (req, res) => {
  try {
    const guild = req.query.guild;

    const students = await Student.find({
      course: { $elemMatch: { guild: { $in: guild } } },
    });
    res.status(200).json({
      message: "get Students with same Guild successfully",
      data: students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "an error occured" });
  }
});
router.get(`/get-checkpoints`, validate(v.guildQuery), async (req, res) => {
  try {
    const guild = req.query.guild;
    const checkpoints = await Checkpoint.find({
      guild: { $in: guild },
    }).populate("student");
    res.status(200).json({
      message: "get Students checkpoint successfully",
      data: checkpoints,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "an error occured" });
  }
});
router.get(`/get-checkpoint-details/:id`, validate(v.idParam), async (req, res) => {
  try {
    const { id } = req.params;
    const checkpoint = await Checkpoint.findById(id)
      .populate("student")
      .populate("student.course.course");
    if (!checkpoint) {
      res.status(404).json({
        message: "checkpoint Not Found",
      });
    }
    res.status(200).json({
      message: "get Student checkpoint successfully",
      data: checkpoint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "an error occured" });
  }
});
router.put(`/submit-checkpoint-score/:id`, validate(v.submitCheckpointScore), async (req, res) => {
  try {
    const { id } = req.params;
    const { score, status } = req.body;
    const checkpoint = await Checkpoint.findByIdAndUpdate(id, {
      score: score,
      open: false,
      // Submitting a score has always meant "this checkpoint passed" in
      // the existing UI, so default to Approved to preserve that behavior;
      // callers that want to record a rejection-with-score pass status
      // explicitly instead.
      status: status || "Approved",
    });
    if (!checkpoint) {
      res.status(404).json({
        message: "checkpoint Not Found",
      });
    }
    res.status(200).json({
      message: "close checkpoint successfully",
      data: checkpoint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "an error occured" });
  }
});
router.put(`/reject-checkpoint/:id`, validate(v.idParam), async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewNotes } = req.body;
    // Reopened (open: true) so the student can see it needs resubmission,
    // rather than leaving it in a dead "closed but rejected" state.
    const checkpoint = await Checkpoint.findByIdAndUpdate(
      id,
      { status: "Rejected", open: true, reviewNotes: reviewNotes || "" },
      { new: true },
    );
    if (!checkpoint) {
      return res.status(404).json({ message: "checkpoint Not Found" });
    }
    res.status(200).json({ message: "checkpoint rejected", data: checkpoint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "an error occured" });
  }
});
router.put(
  "/update-instructor-profile/:userId",
  upload.single("image"),
  validate(v.updateInstructorProfile),
  async (req, res) => {
    try {
      const { userId } = req.params;
      //   const { address, phone, firstName, lastName } = req.body;

      const image = req.file;
      if (image) {
        const instructor = await Instructor.findByIdAndUpdate(userId, {
          ...req.body,
          profileImg: req.file.path,
        });
        res.status(201).json({ message: "instructor updated", instructor });
      } else {
        const instructor = await Instructor.findByIdAndUpdate(userId, {
          ...req.body,
        });
        res.status(201).json({ message: "instructor updated", instructor });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  }
);
const bcrypt = require("bcryptjs");
const Meetings = require("../models/Meetings");

router.put("/updatePassword/:userId", validate(v.updatePassword), async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { userId } = req.params; // Assuming you have authentication middleware that sets the user ID in req.user

  try {
    // Find the user in the database
    const instructor = await Instructor.findById(userId);
    const passwordMatch = await bcrypt.compare(
      newPassword,
      instructor.password
    );
    if (passwordMatch) {
      return res
        .status(400)
        .json({ message: " new password cannot be the same as current " });
    }
    // Check if the current password provided matches the one stored in the database
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      instructor.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    // Generate a new hashed password for the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await Instructor.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

router.post("/add-meeting/:id", validate(v.addMeeting), async (req, res) => {
  try {
    const { name, link, time, guild } = req.body;
    const meeting = await Meetings.create({
      name,
      link,
      time,
      guild,
      instructor: req.params.id,
    });
    res.status(201).json(meeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Get all meetings
router.get("/meetings", async (req, res) => {
  try {
    const meetings = await Meetings.find();
    res.json(meetings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Get a single meeting
router.get("/get-meetings/:id", validate(v.idParam), async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meetings.find({ instructor: id });
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.json(meeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Update a meeting
router.put("/update-meeting/:id", validate(v.idParam), async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await Meetings.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.json(meeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Delete a meeting
router.delete("/delete-meeting/:id", validate(v.idParam), async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await Meetings.findByIdAndDelete(id);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.json({ message: "Meeting deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

const Workshop = require("../models/Workshop"); // Make sure the path is correct

// Create a workshop
router.post("/workshops", validate(v.createWorkshop), async (req, res) => {
  try {
    const workshop = await Workshop.create(req.body);
    res.status(201).json(workshop);
  } catch (error) {
    res.status(500).json({ error: "Error creating workshop" });
  }
});

// Get all workshops
router.get("/workshops", async (req, res) => {
  try {
    const workshops = await Workshop.find();
    res.status(200).json(workshops);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving workshops" });
  }
});

// Get a single workshop by ID
router.get("/workshops/:id", validate(v.idParam), async (req, res) => {
  try {
    const workshop = await Workshop.find({ instructor: req.params.id });
    if (workshop) {
      res.status(200).json(workshop);
    } else {
      res.status(404).json({ message: "Workshop not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving workshop" });
  }
});

// Update a workshop by ID
router.put("/workshops/:id", validate(v.idParam), async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (workshop) {
      res.status(200).json(workshop);
    } else {
      res.status(404).json({ message: "Workshop not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating workshop" });
  }
});

// Delete a workshop by ID
router.delete("/workshops/:id", validate(v.idParam), async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndRemove(req.params.id);
    if (workshop) {
      res.status(200).json({ message: "Workshop deleted" });
    } else {
      res.status(404).json({ message: "Workshop not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting workshop" });
  }
});

module.exports = router;
