const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CertificateTemplate",
      required: true,
    },
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
    },
    // Random opaque code embedded in the QR/verification link — kept
    // separate from certificateNumber so the human-readable number can
    // follow a predictable format without making the verification link
    // guessable.
    verificationCode: {
      type: String,
      required: true,
      unique: true,
    },
    // Snapshots: what the certificate actually says, frozen at issue time.
    studentName: { type: String, required: true },
    courseName: { type: String, required: true },
    guild: { type: String },
    trainerName: { type: String },
    trainingCenterName: { type: String, required: true },
    completionDate: { type: Date, required: true },
    regeneratedAt: { type: Date },
  },
  { timestamps: true },
);

certificateSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Certificate", certificateSchema);
