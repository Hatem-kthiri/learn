const Certificate = require("../models/Certificate");
const CertificateTemplate = require("../models/CertificateTemplate");
const {
  computeEligibility,
  getOrCreateCertificate,
  regenerateCertificate,
  resolveTemplate,
  renderCertificatePdf,
} = require("../services/certificateService");

// GET /api/v1/certificate/status/:studentId/:courseId
// Returns "NotEligible" | "Eligible" | "Generated" — computed, never stored,
// so it can never drift out of sync with the underlying checkpoint/progress
// data the way a cached status field could.
exports.getStatus = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    const existing = await Certificate.findOne({ student: studentId, course: courseId });
    if (existing) {
      return res.status(200).json({
        message: "Certificate status",
        data: { status: "Generated", certificate: existing },
      });
    }

    const { eligible, reason } = await computeEligibility(studentId, courseId);
    res.status(200).json({
      message: "Certificate status",
      data: { status: eligible ? "Eligible" : "NotEligible", reason: eligible ? undefined : reason },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while checking certificate status" });
  }
};

// POST /api/v1/certificate/generate/:studentId/:courseId
// The "automatic" generation trigger: called from the student-facing
// Download button. Auto-creates the record if (and only if) eligibility
// rules pass; otherwise returns 403 with the reason. Idempotent.
exports.generate = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const certificate = await getOrCreateCertificate(studentId, courseId);
    res.status(200).json({ message: "Certificate ready", data: certificate });
  } catch (error) {
    if (error.code === "NOT_ELIGIBLE") {
      return res.status(403).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: error.message || "An error occurred while generating the certificate" });
  }
};

// GET /api/v1/certificate/:id/download — streams the PDF.
exports.download = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findById(id);
    if (!certificate) return res.status(404).json({ message: "Certificate not found" });

    const template = await CertificateTemplate.findById(certificate.template);
    if (!template) return res.status(500).json({ message: "Certificate template no longer exists" });

    const verifyBaseUrl = `${req.protocol}://${req.get("host")}/api/v1/certificate/verify`;
    const pdfBuffer = await renderCertificatePdf(certificate, template, verifyBaseUrl);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="certificate-${certificate.certificateNumber}.pdf"`,
    );
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while generating the PDF" });
  }
};

// GET /api/v1/certificate/verify/:code — public verification lookup (no
// auth; this is what the QR code links to).
exports.verify = async (req, res) => {
  try {
    const { code } = req.params;
    const certificate = await Certificate.findOne({ verificationCode: code }).select(
      "certificateNumber studentName courseName trainingCenterName completionDate trainerName",
    );
    if (!certificate) {
      return res.status(404).json({ valid: false, message: "No certificate found for this code" });
    }
    res.status(200).json({ valid: true, data: certificate });
  } catch (error) {
    res.status(500).json({ valid: false, message: "An error occurred during verification" });
  }
};

// POST /api/admin/certificates/:id/regenerate
exports.adminRegenerate = async (req, res) => {
  try {
    const { id } = req.params;
    const { reissueNumber } = req.body;
    const certificate = await regenerateCertificate(id, { reissueNumber: !!reissueNumber });
    res.status(200).json({ message: "Certificate regenerated", data: certificate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An error occurred while regenerating the certificate" });
  }
};

// GET /api/admin/certificates — list all, for an admin overview table.
exports.adminList = async (req, res) => {
  try {
    const certificates = await Certificate.find({})
      .populate("student", "firstName lastName email")
      .populate("course", "title")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "Certificates", data: certificates });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching certificates" });
  }
};
