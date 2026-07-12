const CertificateTemplate = require("../../models/CertificateTemplate");
const { renderCertificatePdf } = require("../../services/certificateService");

exports.list = async (req, res) => {
  try {
    const templates = await CertificateTemplate.find({}).sort({ createdAt: -1 });
    res.status(200).json({ message: "Certificate templates", data: templates });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching templates" });
  }
};

exports.getById = async (req, res) => {
  try {
    const template = await CertificateTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ message: "Template not found" });
    res.status(200).json({ message: "Template", data: template });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

function pickUploadedUrl(files, field) {
  return files?.[field]?.[0]?.path || undefined;
}

exports.create = async (req, res) => {
  try {
    const {
      scopeGuild,
      trainingCenterName,
      title,
      descriptionText,
      footerText,
      numberingFormat,
      logoUrl,
      signatureImageUrl,
      backgroundImageUrl,
    } = req.body;

    if (!trainingCenterName) {
      return res.status(400).json({ message: "trainingCenterName is required" });
    }

    const template = await CertificateTemplate.create({
      scopeGuild: scopeGuild || null,
      trainingCenterName,
      title,
      descriptionText,
      footerText,
      numberingFormat,
      // Prefer an uploaded file (from multer/Cloudinary), fall back to a
      // pasted URL if no file was uploaded in that field.
      logoUrl: pickUploadedUrl(req.files, "logo") || logoUrl,
      signatureImageUrl: pickUploadedUrl(req.files, "signatureImage") || signatureImageUrl,
      backgroundImageUrl: pickUploadedUrl(req.files, "backgroundImage") || backgroundImageUrl,
    });

    res.status(201).json({ message: "Template created", data: template });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An error occurred while creating the template" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await CertificateTemplate.findById(id);
    if (!template) return res.status(404).json({ message: "Template not found" });

    const fields = [
      "scopeGuild",
      "trainingCenterName",
      "title",
      "descriptionText",
      "footerText",
      "numberingFormat",
      "logoUrl",
      "signatureImageUrl",
      "backgroundImageUrl",
    ];
    for (const field of fields) {
      if (req.body[field] !== undefined) template[field] = req.body[field];
    }
    const uploadedLogo = pickUploadedUrl(req.files, "logo");
    const uploadedSignature = pickUploadedUrl(req.files, "signatureImage");
    const uploadedBackground = pickUploadedUrl(req.files, "backgroundImage");
    if (uploadedLogo) template.logoUrl = uploadedLogo;
    if (uploadedSignature) template.signatureImageUrl = uploadedSignature;
    if (uploadedBackground) template.backgroundImageUrl = uploadedBackground;

    await template.save();
    res.status(200).json({ message: "Template updated", data: template });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An error occurred while updating the template" });
  }
};

// Activating a template deactivates any other template in the same scope
// (scopeGuild), so exactly one template is active per training center at
// a time — this is what "currently active template" means for generation.
exports.activate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await CertificateTemplate.findById(id);
    if (!template) return res.status(404).json({ message: "Template not found" });

    await CertificateTemplate.updateMany(
      { scopeGuild: template.scopeGuild, _id: { $ne: template._id } },
      { $set: { isActive: false } },
    );
    template.isActive = true;
    await template.save();

    res.status(200).json({ message: "Template activated", data: template });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while activating the template" });
  }
};

exports.remove = async (req, res) => {
  try {
    await CertificateTemplate.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Template deleted" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while deleting the template" });
  }
};

// POST /api/admin/certificate-templates/preview
// Renders a PDF from whatever field values are in the request body —
// including ones not yet saved — so the admin can see the result before
// committing changes. Uses placeholder sample data for the student/course
// fields since no real certificate exists yet.
exports.preview = async (req, res) => {
  try {
    const {
      trainingCenterName,
      title,
      descriptionText,
      footerText,
      logoUrl,
      signatureImageUrl,
      backgroundImageUrl,
    } = req.body;

    const sampleCertificate = {
      studentName: "Jane Sample",
      courseName: "Sample Training Program",
      trainingCenterName: trainingCenterName || "Your Training Center",
      completionDate: new Date(),
      certificateNumber: "PREVIEW-0000",
      verificationCode: "preview",
    };
    const previewTemplate = {
      trainingCenterName: trainingCenterName || "Your Training Center",
      title: title || "Certificate of Completion",
      descriptionText:
        descriptionText ||
        "This certifies that {{studentName}} has successfully completed {{courseName}} on {{completionDate}}.",
      footerText,
      logoUrl: pickUploadedUrl(req.files, "logo") || logoUrl,
      signatureImageUrl: pickUploadedUrl(req.files, "signatureImage") || signatureImageUrl,
      backgroundImageUrl: pickUploadedUrl(req.files, "backgroundImage") || backgroundImageUrl,
    };

    const verifyBaseUrl = `${req.protocol}://${req.get("host")}/api/v1/certificate/verify`;
    const pdfBuffer = await renderCertificatePdf(sampleCertificate, previewTemplate, verifyBaseUrl);

    res.setHeader("Content-Type", "application/pdf");
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while generating the preview" });
  }
};
