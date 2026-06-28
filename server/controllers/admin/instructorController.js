const bcrypt = require("bcryptjs");
const Instructor = require("../../models/Instructor");
const Student = require("../../models/Student");
const transporter = require("../../config/mailer");
const instructorWelcomeEmail = require("../../emails/instructorWelcomeEmail");

// ── Quick-add (legacy, minimal fields) ──────────────────────────────────
exports.quickAddInstructor = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    await Instructor.create({
      firstName,
      lastName,
      email,
      password: "123456",
      track: [{ trackId: "" }],
      student: [{ studentId: "" }],
    });
    res.json({ status: true, msg: "instructor Added" });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, message: err });
  }
};

// ── Full add (random password + welcome email) ─────────────────────────
exports.addInstructor = async (req, res) => {
  const { firstName, lastName, email, course, address, phone, guild } =
    req.body.instructor;

  try {
    const findInstructor = await Instructor.findOne({ email }).select("_id").lean();
    const findStudent = await Student.findOne({ email }).select("_id").lean();

    if (findInstructor || findStudent) {
      return res.status(400).json({ message: "Email already Registred !" });
    }

    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newInstructor = new Instructor({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      course,
      address,
      phone,
      guild,
    });

    const savedInstructor = await newInstructor.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login Details",
      text: instructorWelcomeEmail({ firstName, lastName, email, password }),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log({ message: "Probleme with nodeMailer", error });
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res
      .status(200)
      .json({ message: "Instructor added successfully!", data: savedInstructor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while adding the student." });
  }
};

// ── Read ──────────────────────────────────────────────────────────────────
exports.getInstructors = async (req, res) => {
  try {
    const InstructorList = await Instructor.find({})
      .select("firstName lastName email phone profileImg guild course")
      .populate("course", "title image status")
      .lean();
    res.status(200).json({ message: "Instructor List !", data: InstructorList });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while get  Instructor List." });
  }
};

exports.getInstructorById = async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await Instructor.findById(id)
      .populate("course", "title image status")
      .lean();
    if (!instructor) {
      return res.status(404).json({ message: "instructor not found !" });
    }
    res.status(200).json({ data: instructor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

// ── Update ────────────────────────────────────────────────────────────────
exports.editInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await Instructor.findByIdAndUpdate(id, { ...req.body });
    if (!instructor) {
      return res.status(404).json({ message: "instructor not found !" });
    }
    res.status(200).json({ message: "instructor edited .. ! ", data: instructor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

// ── Delete ────────────────────────────────────────────────────────────────
exports.deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    await Instructor.findByIdAndRemove(id);
    res.json({ message: "instructor deleted " });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
