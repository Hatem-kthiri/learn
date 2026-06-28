const bcrypt = require("bcryptjs");
const Student = require("../../models/Student");
const Instructor = require("../../models/Instructor");
const Course = require("../../models/Course");
const learningSchedule = require("../../models/learningSchedule");
const Checkpoint = require("../../models/Checkpoint");
const QuizScore = require("../../models/QuizScore");
const transporter = require("../../config/mailer");
const studentWelcomeEmail = require("../../emails/studentWelcomeEmail");
const { extractedSkills } = require("./courseController");

// ── Quick-add (legacy, minimal fields) ──────────────────────────────────
exports.quickAddStudent = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    await Student.create({
      firstName,
      lastName,
      email,
      password: "123456",
      track: [{ trackId: "" }],
    });
    res.json({ status: true, msg: "Student Added" });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, message: err });
  }
};

// ── Full add (with course enrollment, random password, welcome email) ──
exports.addStudent = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    course,
    address,
    phone,
    gender,
    dateOfBirth,
  } = req.body.student;

  try {
    // Existence checks — lean() since we only need a truthy result
    const findInstructor = await Instructor.findOne({ email }).select("_id").lean();
    const findStudent = await Student.findOne({ email }).select("_id").lean();

    if (findInstructor || findStudent) {
      return res.status(400).json({ message: "Email already Registred !" });
    }

    // Full course doc needed here (we call extractedSkills which traverses data[])
    const findCourse = await Course.findById(course[0].course);

    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      course: {
        course: findCourse,
        guild: "",
        learnProgress: "0",
        courseId: [findCourse.data[0]._id, findCourse.data[0].superSkills[0]._id],
      },
      address,
      phone,
      gender,
      dateOfBirth,
      createdAt: new Date(),
    });

    const savedStudent = await newStudent.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login Details",
      html: studentWelcomeEmail({
        firstName,
        lastName,
        email,
        password,
        courseTitle: findCourse.title,
      }),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log({ message: "Probleme with nodeMailer", error });
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    await learningSchedule.create({
      student: savedStudent._id,
      courseId: findCourse._id,
      learning: extractedSkills(findCourse),
    });

    res
      .status(200)
      .json({ message: "Student added successfully!", student: savedStudent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while adding the student." });
  }
};

// ── Read ──────────────────────────────────────────────────────────────────

// Student LIST — select only the fields the admin list page needs
exports.getStudents = async (req, res) => {
  try {
    const StudentsList = await Student.find()
      .select("firstName lastName email phone profileImg course expiryDate createdAt")
      .populate("course.course", "title image")
      .lean();
    res.status(200).json({ message: "Students List !", data: StudentsList });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while get students List." });
  }
};

// Student DETAIL — full doc for the edit modal
exports.getStudentInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id)
      .populate("course.course", "title image status")
      .lean();
    res.status(200).json({ message: "Student Info !", data: student });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while get student" });
  }
};

// Payments list — only payment-relevant fields
exports.getStudentsPayments = async (req, res) => {
  try {
    const StudentsList = await Student.find({})
      .select("firstName lastName email invoicePayment course")
      .lean();
    res.status(200).json({ message: "Students List !", data: StudentsList });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while get students List." });
  }
};

// ── Update ────────────────────────────────────────────────────────────────
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndUpdate(id, { ...req.body });
    res.status(200).json({ message: "Student Info updated !", data: student });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while update student" });
  }
};

exports.addPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndUpdate(
      id,
      { $push: { invoicePayment: req.body } },
      { new: true }
    );
    res.status(200).json({ message: "invoice payment added  .. ! ", data: student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const { id, invoiceId } = req.params;
    await Student.findByIdAndUpdate(
      id,
      { $pull: { invoicePayment: { _id: invoiceId } } },
      { new: true }
    );
    res.status(200).json({ message: "Invoice payment removed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

// ── Delete ────────────────────────────────────────────────────────────────
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndRemove(id);

    // Use deleteOne instead of findOne + findByIdAndRemove (saves a round-trip)
    await learningSchedule.deleteOne({ student: id });
    await Checkpoint.deleteMany({ student: id });
    await QuizScore.deleteMany({ student: id });

    res.json({ message: "student deleted " });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
