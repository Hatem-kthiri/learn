const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuth = require("../middlewares/isAuth");
const Student = require("../models/Student");
const Instructor = require("../models/Instructor");
const Meetings = require("../models/Meetings");
const mongoose = require("mongoose");
require("dotenv").config();
const { makeUploader } = require("../config/cloudinary");
const Checkpoint = require("../models/Checkpoint");
const QuizScore = require("../models/QuizScore");
const learningSchedule = require("../models/learningSchedule");
const Workshop = require("../models/Workshop");
const Course = require("../models/Course");
const validate = require("../middlewares/validate");
const v = require("../validators/userValidators");

const upload = makeUploader("profile");

// router.post("/register", async (req, res) => {
//   try {
//     const { userName, email, password } = req.body;
//     bcrypt.hash(password, 12, async (err, hash) => {
//       if (err) {
//         res.status(500).json({ status: false, message: err });
//       } else if (hash) {
//         const user = await User.create({
//           userName,
//           email,
//           password: hash,
//         });
//         res.status(201).json({
//           status: true,
//           message: "user created",
//           data: user,
//         });
//       }
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ status: false, message: err });
//   }
// });

router.post("/login", validate(v.login), (req, res) => {
  const { email, password } = req.body;
  // Check email in Instructor schema
  Instructor.findOne({ email })
    .then((instructor) => {
      if (instructor) {
        comparePasswordAndLogin(instructor, instructor.role);
      } else {
        Student.findOne({ email }).then((student) => {
          if (student) {
            if (student.expiryDate > Date.now()) {
              comparePasswordAndLogin(student, student.role);
            } else {
              res.status(401).json({
                message:
                  "Your account is desactivated ! Please contact administration",
              });
            }
          } else {
            // Email not found in either schema
            res.status(404).json({
              status: false,
              message: "Email does not exist",
            });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "An error occurred",
      });
    });

  function comparePasswordAndLogin(user, role) {
    bcrypt.compare(password, user.password, (err, passwordMatch) => {
      if (err) throw err;
      if (passwordMatch === true) {
        jwt.sign(
          {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          process.env.SECRETKEY,
          { expiresIn: "7d" }, // Set token expiration to 7 days
          (err, token) => {
            if (err) throw err;
            res.json({
              status: true,
              message: "Logged in successfully",
              data: { token: token, role: role },
            });
          },
        );
      } else {
        res.status(401).json({
          status: false,
          message: "Wrong password",
        });
      }
    });
  }
});

router.get("/current", isAuth, (req, res) => {
  if (req.user) {
    res.send({ status: true, msg: "authorized", user: req.user });
  } else {
    res.send({ status: false, msg: "unauthorised" });
  }
});
router.get("/loggedUser", isAuth, async (req, res) => {
  if (req.user.role == 1) {
    const user = await Instructor.findOne({ email: req.user.email })
      .populate("course")
      .lean();
    res.json({
      status: true,
      msg: "user Details",
      data: user,
    });
  } else if (req.user.role == 2) {
    const user = await Student.findOne({ email: req.user.email })
      .populate("course.course")
      // only needed fields
      .lean();

    res.json({
      status: true,
      msg: "user Details",
      data: user,
    });
  } else {
    res.json({
      status: false,
      msg: "Something wrong",
    });
  }
});

// Create a new checkpoint
router.post("/add-checkpoint", validate(v.addCheckpoint), async (req, res) => {
  try {
    const { checkpointName, checkpointId, student, guild, link } = req.body;

    const findCheckpoint = await Checkpoint.findOne({
      checkpointId: checkpointId,
      student: student,
    });
    if (!findCheckpoint) {
      const newCheckpoint = new Checkpoint({
        checkpointName,
        checkpointId,
        student,
        guild,
        link,
      });

      const createdCheckpoint = await newCheckpoint.save();
      res.status(201).json(createdCheckpoint);
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: "Failed to create checkpoint" });
  }
});
// Update a checkpoint
router.put(
  "/update-checkpoint/:id",
  validate(v.updateCheckpoint),
  async (req, res) => {
    try {
      const checkpointId = req.params.id;
      const { student, guild, score, link, open } = req.body;

      const updatedCheckpoint = await Checkpoint.findByIdAndUpdate(
        checkpointId,
        {
          ...req.body,
        },
        { new: true },
      );

      if (!updatedCheckpoint) {
        return res.status(404).json({ error: "Checkpoint not found" });
      }

      res.json(updatedCheckpoint);
    } catch (error) {
      // console.error(error);
      res.status(500).json({ error: "Failed to update checkpoint" });
    }
  },
);
// Get a checkpoint by student ID and checkpoint ID
router.get(
  "/get-checkpoint/:studentId/:checkpointId",
  validate(v.getCheckpoint),
  async (req, res) => {
    try {
      const { studentId, checkpointId } = req.params;
      if (!mongoose.isValidObjectId(studentId)) {
        return res.status(400).json({ error: "Invalid studentId" });
      }
      const checkpoint = await Checkpoint.findOne({
        checkpointId: checkpointId,
        student: studentId,
      }).exec();

      if (!checkpoint) {
        return res.status(404).json({ error: "Checkpoint not found" });
      }

      res.json(checkpoint);
    } catch (error) {
      // console.error(error);
      res.status(500).json({ error: "Failed to fetch checkpoint" });
    }
  },
);
router.put(
  "/edit-courseId/:userId",
  validate(v.editCourseId),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { chapterId, skillsId } = req.body;
      const student = await Student.findById(userId);
      student.course[0].courseId = [chapterId, skillsId];
      await Student.findByIdAndUpdate(userId, { ...student });
      res.status(200).json({
        message: "courseId  updated successfully",
        data: student,
      });
    } catch (error) {
      // console.error(error);
      res.status(500).json({ error: "Failed to update courseId" });
    }
  },
);

router.put(
  "/update-open-course/:superSkillsIndex/:skillsIndex/:learningScheduleId",
  validate(v.updateOpenCourse),
  async (req, res) => {
    try {
      const { superSkillsIndex, skillsIndex, learningScheduleId } = req.params;
      const learn = await learningSchedule.findById(learningScheduleId);

      if (!learn) {
        return res.status(404).json({ error: "Learning schedule not found" });
      }
      // Get the specific skills object to update
      if (learn.learning[superSkillsIndex].details[skillsIndex].open == true) {
        res.status(200).json({
          message: "Open is already updated !!",
        });
      } else {
        learn.learning[superSkillsIndex].details[skillsIndex].open = true;
        learn.learning[superSkillsIndex].details[skillsIndex].updated =
          new Date();
        const updateLearn = await learningSchedule.findByIdAndUpdate(
          learningScheduleId,
          {
            ...learn,
          },
        );
        res.status(200).json({
          message: "Open updated successfully",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update open skills" });
    }
  },
);

// Unlock and return the next lesson after a student finishes the current one.
// Looks the current lesson up by its real _id (not array index) so it stays
// correct even if the schedule and course docs get out of sync in ordering.
router.put("/open-skill", validate(v.openSkill), async (req, res) => {
  try {
    const { userId, courseId, superSkillsId, skillsId } = req.body;

    const schedule = await learningSchedule.findOne({
      student: userId,
      courseId,
    });
    if (!schedule) {
      return res.status(404).json({ error: "Learning schedule not found" });
    }

    const chapterIndex = schedule.learning.findIndex(
      (chapter) => String(chapter._id) === String(superSkillsId),
    );
    if (chapterIndex === -1) {
      return res.status(404).json({ error: "Chapter not found in learning schedule" });
    }

    const details = schedule.learning[chapterIndex].details;
    const skillIndex = details.findIndex(
      (detail) => String(detail._id) === String(skillsId),
    );
    if (skillIndex === -1) {
      return res.status(404).json({ error: "Skill not found in learning schedule" });
    }

    // Recalculate overall course progress now that this lesson is done.
    // Nothing on the frontend ever called the old updateLearnProgress route,
    // so this is the only place progress actually gets updated.
    const totalSkills = schedule.learning.reduce(
      (sum, ch) => sum + ch.details.length,
      0,
    );
    let completedSkills = 0;
    for (let i = 0; i < chapterIndex; i++) {
      completedSkills += schedule.learning[i].details.length;
    }
    completedSkills += skillIndex + 1;
    const learnProgress =
      totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;
    await Student.updateOne(
      { _id: userId, "course.course": courseId },
      { $set: { "course.$.learnProgress": learnProgress } },
    );

    // Work out where the next lesson lives: same chapter, next slot — or the
    // first lesson of the next chapter if we're at the end of this one.
    let nextChapterIndex = chapterIndex;
    let nextSkillIndex = skillIndex + 1;
    if (nextSkillIndex >= details.length) {
      nextChapterIndex += 1;
      nextSkillIndex = 0;
    }

    if (nextChapterIndex >= schedule.learning.length) {
      return res.status(200).json({ message: "Course completed", nextSkill: null, learnProgress: 100 });
    }

    const nextDetail =
      schedule.learning[nextChapterIndex].details[nextSkillIndex];
    if (!nextDetail.open) {
      nextDetail.open = true;
      nextDetail.updated = new Date();
      // `details` has no explicit schema type (Mixed), so Mongoose can't
      // auto-detect mutations to objects inside it — without this line,
      // save() silently writes nothing for this field.
      schedule.markModified("learning");
      await schedule.save();
    }

    // Pull the actual lesson content from the course document itself —
    // the learning schedule only tracks progress, not the slides/quiz.
    const nextChapterId = schedule.learning[nextChapterIndex]._id;
    const course = await Course.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(courseId) } },
      { $unwind: "$data" },
      { $match: { "data._id": new mongoose.Types.ObjectId(nextChapterId) } },
    ]);

    const chapter = course[0]?.data;
    const skill = chapter?.superSkills?.find(
      (s) => String(s._id) === String(nextDetail._id),
    );
    if (!skill) {
      return res.status(404).json({ error: "Next lesson content not found" });
    }

    res.status(200).json({
      message: "Skill unlocked",
      nextSuperSkillsId: nextChapterId,
      learnProgress,
      nextSkill: {
        _id: skill._id,
        skillsName: skill.skillsName,
        skillsData: skill.skillsData,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to open next skill" });
  }
});

router.get("/get-students-progress", async (req, res) => {
  try {
    const guild = req.query.guild;
    const students = await Student.find({
      course: { $elemMatch: { guild: guild } },
    })
      .select("firstName lastName email profileImg course")
      .populate("course.course", "title image")
      .lean();
    res.status(200).json({
      message: "get Students with same Guild successfully",
      data: students,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get students progress" });
  }
});
router.get(`/get-student-schedule`, async (req, res) => {
  try {
    const studentId = req.query.studentId;
    const courseId = req.query.courseId;
    const schedule = await learningSchedule.findOne({
      student: studentId,
      courseId: courseId,
    });
    console.log(studentId, courseId);
    res.status(200).json({
      message: "get student learning schedule",
      data: schedule,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: "Failed to get student learning schedule " });
  }
});

router.put(
  "/updatePassword/:userId",
  validate(v.updatePassword),
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const { userId } = req.params; // Assuming you have authentication middleware that sets the user ID in req.user

    try {
      // Find the user in the database
      const student = await Student.findById(userId);
      const passwordMatch = await bcrypt.compare(newPassword, student.password);
      if (passwordMatch) {
        return res
          .status(400)
          .json({ message: " new password cannot be the same as current " });
      }
      // Check if the current password provided matches the one stored in the database
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        student.password,
      );
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Incorrect current password" });
      }

      // Generate a new hashed password for the user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await Student.findByIdAndUpdate(userId, { password: hashedPassword });

      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      // console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
);

router.put(
  "/updateLearnProgress/:userId",
  validate(v.updateLearnProgress),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { learnProgress } = req.body;
      const student = await Student.findById(userId);
      student.course[0].learnProgress = learnProgress;
      await student.save();
      await Student.findByIdAndUpdate(userId, { ...student });
      res
        .status(201)
        .json({ message: "learning Progress updated", data: student });
    } catch (error) {
      // console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
);
router.put(
  "/updateLearnScore/:userId",
  validate(v.updateLearnScore),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { learnScore } = req.body;
      const student = await Student.findById(userId);
      student.course[0].learnScore = learnScore;
      await Student.findByIdAndUpdate(userId, { ...student });
      res
        .status(201)
        .json({ message: "learning Score updated", data: student });
    } catch (error) {
      res.status(500).json({ message: "An error occurred" });
    }
  },
);

router.post(
  "/add-Quiz-Score/:userId",
  validate(v.addQuizScore),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { quizScore, quizId, response } = req.body;
      const findQuiz = await QuizScore.findOne({
        quizId: quizId,
        student: userId,
      });
      if (findQuiz) {
        res.status(409).json({ message: "quiz Already Submitted !" });
      } else {
        const quiz = await QuizScore.create({
          quizScore,
          quizId,
          student: userId,
          response,
        });
        res.status(200).json({ message: "quiz Added", data: quiz });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
);
router.get(
  "/get-quiz/:userId/:quizId",
  validate(v.getQuiz),
  async (req, res) => {
    try {
      const { userId, quizId } = req.params;
      const quiz = await QuizScore.findOne({
        quizId: quizId,
        student: userId,
      }).lean();
      if (quiz) {
        res.status(200).json({ message: "quiz Details", data: quiz });
      } else {
        res.status(404).json({ message: "quiz not found " });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
);
router.get(
  "/get-all-Quiz/:userId",
  validate(v.userIdParam),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const quiz = await QuizScore.find({
        student: userId,
      }).lean();
      if (quiz) {
        res.status(200).json({ message: "quiz Details", data: quiz });
      } else {
        res.status(404).json({ message: "quiz not found " });
      }
    } catch (error) {
      // console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
);
router.get(
  "/get-all-checkpoint/:userId",
  validate(v.userIdParam),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const checkpoints = await Checkpoint.find({
        student: userId,
      }).lean();
      if (checkpoints) {
        res
          .status(200)
          .json({ message: "checkpoints Details", data: checkpoints });
      } else {
        res.status(404).json({ message: "checkpoints not found " });
      }
    } catch (error) {
      // console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
);
router.put(
  "/update-student-profile/:userId",
  upload.single("image"),
  validate(v.updateStudentProfile),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { studentUpdate } = req.body;
      const image = req.file;
      if (image) {
        const student = await Student.findByIdAndUpdate(userId, {
          ...JSON.parse(studentUpdate),
          profileImg: req.file.path,
        });
        res.status(201).json({ message: "student updated", student });
      } else {
        const student = await Student.findByIdAndUpdate(userId, {
          ...JSON.parse(studentUpdate),
        });
        res.status(201).json({ message: "student updated", student });
      }
    } catch (error) {
      // console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
);
router.get("/get-meeting/:guild", validate(v.guildParam), async (req, res) => {
  try {
    const { guild } = req.params;
    const meetings = await Meetings.find({ guild: guild }).lean();
    res.status(200).json({ data: meetings });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});
router.get(
  "/get-instructor-name/:guild",
  validate(v.guildParam),
  async (req, res) => {
    try {
      const { guild } = req.params;
      const instructor = await Instructor.findOne({ guild: { $in: [guild] } })
        .select("firstName lastName profileImg")
        .lean();
      if (!instructor) {
        res.status(404).json({ message: "instructor not found !" });
      } else {
        res.status(200).json({
          data: {
            firstName: instructor.firstName,
            lastName: instructor.lastName,
            profileImg: instructor.profileImg,
          },
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
);
router.get(
  "/get-learning-schedule/:userId/:courseId",
  validate(v.learningScheduleParams),
  async (req, res) => {
    try {
      const { userId, courseId } = req.params;
      const learning = await learningSchedule
        .findOne({
          student: userId,
          courseId: courseId,
        })
        .lean();
      if (learning) {
        res.status(200).json({
          message: "learning !",
          data: learning,
        });
      } else {
        res.status(200).json({
          message: "learning does not exist  !",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
);
router.post(
  "/send-email-recovery",
  validate(v.sendEmailRecovery),
  async (req, res) => {
    const { email, code } = req.body;
    try {
      const student = await Student.findOne({ email });
      const instructor = await Instructor.findOne({ email });
      if (!student && !instructor) {
        return res.status(404).json({ message: "Email does not exist !" });
      } else {
        const transporter = require("../config/mailer");

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Password Reset Request",
          html: `<p>Hello ${
            student ? student.firstName : instructor.firstName
          },</p>
               <p>You requested a password reset for your account.</p>
               <p>Enter the following password reset code:</p>
               <span>${code}</span>
                `,
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Email sent successfully" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
);
router.put(
  "/password-recovery/:email",
  validate(v.passwordRecovery),
  async (req, res) => {
    const { newPassword } = req.body;
    const { email } = req.params;
    try {
      // Find the user in the database
      const student = await Student.findOne({ email: email });
      const instructor = await Instructor.findOne({ email: email });
      // Generate a new hashed password for the user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      if (student) {
        await Student.findByIdAndUpdate(student._id, {
          password: hashedPassword,
        });
        res.status(200).json({ message: "Password changed successfully" });
      } else if (instructor) {
        await Instructor.findByIdAndUpdate(instructor._id, {
          password: hashedPassword,
        });
        res.status(200).json({ message: "Password changed successfully" });
      }
    } catch (error) {
      // console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
);
// Get a single workshop by Guild
router.get("/workshops/:guild", validate(v.guildParam), async (req, res) => {
  try {
    const workshop = await Workshop.find({ guild: req.params.guild });
    if (workshop) {
      res.status(200).json(workshop);
    } else {
      res.status(404).json({ message: "Workshop not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving workshop" });
  }
});
module.exports = router;
