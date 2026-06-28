const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  phone: {
    type: Number,
  },
  bio: {
    type: String,
  },
  gender: { type: String },
  dateOfBirth: { type: Date },
  course: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: true,
      },
      guild: { type: String },
      learnProgress: { type: String },
      learnScore: { type: String },
      courseId: [],
    },
  ],
  invoicePayment: [
    {
      numberOfMonth: String,
      course: String,
      price: String,
      paymentDate: Date,
    },
  ],
  profileImg: {
    type: String,
    default: "https://i.ibb.co/HTyRShH/Default-pfp.png",
  },
  socialMediaLinks: [],
  role: {
    type: String,
    default: 2,
  },
  expiryDate: {
    type: Date,
    default: function () {
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + 5);
      return currentDate;
    },
  },
  createdAt: {
    type: Date,
  },
});

// email already has unique: true which creates an index automatically
// Additional indexes for common queries
StudentSchema.index({ expiryDate: 1 });                  // expiry checks on login
StudentSchema.index({ "course.course": 1 });             // lookups by enrolled course

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
