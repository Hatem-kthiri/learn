const crypto = require("crypto");
const https = require("https");
const http = require("http");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

const Student = require("../models/Student");
const Course = require("../models/Course");
const Checkpoint = require("../models/Checkpoint");
const Guild = require("../models/Guild");
const Instructor = require("../models/Instructor");
const Certificate = require("../models/Certificate");
const CertificateTemplate = require("../models/CertificateTemplate");

// pdfkit's doc.image() only accepts a local file path or a Buffer — not a
// URL string — so template image fields (hosted on Cloudinary etc.) need
// to be downloaded into a buffer first. Failures resolve to null rather
// than throwing, so a broken image URL never blocks certificate rendering.
function fetchImageBuffer(imageUrl) {
  return new Promise((resolve) => {
    if (!imageUrl) return resolve(null);
    const client = imageUrl.startsWith("https") ? https : http;
    client
      .get(imageUrl, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          return resolve(null);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", () => resolve(null))
      .setTimeout(8000, function () {
        this.destroy();
        resolve(null);
      });
  });
}

/**
 * Eligibility rules (all must hold):
 *   1. The student's progress on this course is 100%.
 *   2. The student has at least one checkpoint on record for this guild
 *      (i.e. checkpoints have actually been submitted).
 *   3. None of those checkpoints are Pending or Rejected — every single
 *      one must be Approved.
 *
 * Returns { eligible: boolean, reason?: string, courseEntry, guild }
 */
async function computeEligibility(studentId, courseId) {
  const student = await Student.findById(studentId);
  if (!student) return { eligible: false, reason: "Student not found" };

  const courseEntry = student.course.find((c) => String(c.course) === String(courseId));
  if (!courseEntry) return { eligible: false, reason: "Student is not enrolled in this course" };

  const progress = Number(courseEntry.learnProgress || 0);
  if (progress < 100) {
    return { eligible: false, reason: `Progress is ${progress}%, must be 100%`, courseEntry };
  }

  const checkpoints = await Checkpoint.find({
    student: studentId,
    guild: courseEntry.guild,
  });

  if (checkpoints.length === 0) {
    return { eligible: false, reason: "No checkpoints submitted yet", courseEntry };
  }

  const notApproved = checkpoints.filter((c) => c.status !== "Approved");
  if (notApproved.length > 0) {
    const pendingCount = notApproved.filter((c) => c.status === "Pending").length;
    const rejectedCount = notApproved.filter((c) => c.status === "Rejected").length;
    return {
      eligible: false,
      reason: `${pendingCount} checkpoint(s) pending, ${rejectedCount} rejected`,
      courseEntry,
    };
  }

  return { eligible: true, courseEntry, guild: courseEntry.guild };
}

async function resolveTemplate(guildName) {
  let template = null;
  if (guildName) {
    template = await CertificateTemplate.findOne({ scopeGuild: guildName, isActive: true });
  }
  if (!template) {
    template = await CertificateTemplate.findOne({ scopeGuild: null, isActive: true });
  }
  if (!template) {
    throw new Error(
      "No active certificate template found. An administrator must create and activate one first.",
    );
  }
  return template;
}

async function resolveTrainerName(guildName) {
  if (!guildName) return "";
  const guildDoc = await Guild.findOne({ name: guildName }).populate("instructor", "firstName lastName");
  if (guildDoc?.instructor) {
    return `${guildDoc.instructor.firstName} ${guildDoc.instructor.lastName}`;
  }
  // Fall back to the legacy Instructor.guild string-array association.
  const instructor = await Instructor.findOne({ guild: guildName });
  return instructor ? `${instructor.firstName} ${instructor.lastName}` : "";
}

function applyNumberingFormat(format, sequence) {
  const year = new Date().getFullYear();
  const seq = String(sequence).padStart(4, "0");
  return format.replace(/\{YEAR\}/g, year).replace(/\{SEQ\}/g, seq);
}

async function nextCertificateNumber(template) {
  // Atomic increment so two simultaneous generations never collide.
  const updated = await CertificateTemplate.findByIdAndUpdate(
    template._id,
    { $inc: { lastSequence: 1 } },
    { new: true },
  );
  return applyNumberingFormat(updated.numberingFormat, updated.lastSequence);
}

/**
 * Idempotent: if a Certificate already exists for this student+course,
 * returns it unchanged rather than creating a duplicate (the unique
 * (student, course) index would reject a duplicate insert anyway).
 */
async function getOrCreateCertificate(studentId, courseId) {
  const existing = await Certificate.findOne({ student: studentId, course: courseId });
  if (existing) return existing;

  const { eligible, reason, courseEntry, guild } = await computeEligibility(studentId, courseId);
  if (!eligible) {
    const err = new Error(reason || "Not eligible for a certificate");
    err.code = "NOT_ELIGIBLE";
    throw err;
  }

  const [student, course, template, trainerName] = await Promise.all([
    Student.findById(studentId),
    Course.findById(courseId),
    resolveTemplate(guild),
    resolveTrainerName(guild),
  ]);

  const certificateNumber = await nextCertificateNumber(template);
  const verificationCode = crypto.randomBytes(12).toString("hex");

  const certificate = await Certificate.create({
    student: studentId,
    course: courseId,
    template: template._id,
    certificateNumber,
    verificationCode,
    studentName: `${student.firstName} ${student.lastName}`,
    courseName: course.title,
    guild,
    trainerName,
    trainingCenterName: template.trainingCenterName,
    completionDate: new Date(),
  });

  return certificate;
}

// Re-snapshots trainer/training-center/template against whatever is
// currently active — used by the admin "regenerate" action. Keeps the
// same certificateNumber and verificationCode (it's the same certificate,
// just refreshed), unless the caller explicitly asks for a new number.
async function regenerateCertificate(certificateId, { reissueNumber = false } = {}) {
  const certificate = await Certificate.findById(certificateId);
  if (!certificate) throw new Error("Certificate not found");

  const template = await resolveTemplate(certificate.guild);
  const trainerName = await resolveTrainerName(certificate.guild);

  certificate.template = template._id;
  certificate.trainerName = trainerName;
  certificate.trainingCenterName = template.trainingCenterName;
  certificate.regeneratedAt = new Date();

  if (reissueNumber) {
    certificate.certificateNumber = await nextCertificateNumber(template);
  }

  await certificate.save();
  return certificate;
}

function fillPlaceholders(text, certificate) {
  return (text || "")
    .replace(/\{\{studentName\}\}/g, certificate.studentName)
    .replace(/\{\{courseName\}\}/g, certificate.courseName)
    .replace(/\{\{trainingCenterName\}\}/g, certificate.trainingCenterName)
    .replace(
      /\{\{completionDate\}\}/g,
      new Date(certificate.completionDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
}

/**
 * Renders a certificate to a PDF buffer. `verifyBaseUrl` is the public URL
 * prefix the QR code should point to, e.g. "https://yourapp.com/verify".
 */
async function renderCertificatePdf(certificate, template, verifyBaseUrl) {
  const qrDataUrl = await QRCode.toDataURL(`${verifyBaseUrl}/${certificate.verificationCode}`);
  const qrBuffer = Buffer.from(qrDataUrl.split(",")[1], "base64");

  const [backgroundBuffer, logoBuffer, signatureBuffer] = await Promise.all([
    fetchImageBuffer(template.backgroundImageUrl),
    fetchImageBuffer(template.logoUrl),
    fetchImageBuffer(template.signatureImageUrl),
  ]);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 0 });
    const chunks = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Background (falls back to a plain border if no template image, or if
    // it couldn't be fetched, so rendering never fails just because of a
    // bad/unreachable template image).
    if (backgroundBuffer) {
      doc.image(backgroundBuffer, 0, 0, { width: pageWidth, height: pageHeight });
    } else {
      doc.rect(20, 20, pageWidth - 40, pageHeight - 40).lineWidth(3).stroke("#4f46e5");
    }

    if (logoBuffer) {
      doc.image(logoBuffer, pageWidth / 2 - 40, 50, { width: 80 });
    }

    doc
      .fontSize(14)
      .fillColor("#64748b")
      .text(template.trainingCenterName, 0, 140, { align: "center" });

    doc
      .fontSize(34)
      .fillColor("#1e293b")
      .font("Helvetica-Bold")
      .text(template.title, 0, 170, { align: "center" });

    doc
      .fontSize(16)
      .fillColor("#334155")
      .font("Helvetica")
      .text(fillPlaceholders(template.descriptionText, certificate), 100, 240, {
        align: "center",
        width: pageWidth - 200,
      });

    if (signatureBuffer) {
      doc.image(signatureBuffer, pageWidth - 220, pageHeight - 160, { width: 120 });
    }
    doc
      .fontSize(10)
      .fillColor("#94a3b8")
      .text("Authorized Signature", pageWidth - 220, pageHeight - 40, { width: 120, align: "center" });

    doc.image(qrBuffer, 60, pageHeight - 160, { width: 90 });
    doc
      .fontSize(9)
      .fillColor("#94a3b8")
      .text(`Certificate No: ${certificate.certificateNumber}`, 60, pageHeight - 60);
    doc.text(`Verify: ${certificate.verificationCode}`, 60, pageHeight - 46);

    if (template.footerText) {
      doc
        .fontSize(9)
        .fillColor("#94a3b8")
        .text(template.footerText, 0, pageHeight - 25, { align: "center" });
    }

    doc.end();
  });
}

module.exports = {
  computeEligibility,
  resolveTemplate,
  resolveTrainerName,
  applyNumberingFormat,
  getOrCreateCertificate,
  regenerateCertificate,
  renderCertificatePdf,
  fillPlaceholders,
};
