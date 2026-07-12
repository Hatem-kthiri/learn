const mongoose = require("mongoose");

const certificateTemplateSchema = new mongoose.Schema(
  {
    // Optional: ties this template to one training center/guild. Null means
    // "default template" used when no center-specific template is active.
    scopeGuild: {
      type: String,
      default: null,
    },
    trainingCenterName: {
      type: String,
      required: true,
      trim: true,
    },
    logoUrl: { type: String },
    title: {
      type: String,
      default: "Certificate of Completion",
    },
    // May contain {{studentName}}, {{courseName}}, {{completionDate}},
    // {{trainingCenterName}} placeholders, substituted at render time.
    descriptionText: {
      type: String,
      default:
        "This certifies that {{studentName}} has successfully completed {{courseName}} on {{completionDate}}.",
    },
    signatureImageUrl: { type: String },
    footerText: { type: String, default: "" },
    backgroundImageUrl: { type: String },
    // e.g. "CERT-{YEAR}-{SEQ}" — {YEAR} and {SEQ} (zero-padded 4-digit,
    // scoped per template) get substituted when a certificate is issued.
    numberingFormat: {
      type: String,
      default: "CERT-{YEAR}-{SEQ}",
    },
    // Running counter for {SEQ} in numberingFormat, scoped to this template.
    lastSequence: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

certificateTemplateSchema.index({ scopeGuild: 1, isActive: 1 });

module.exports = mongoose.model("CertificateTemplate", certificateTemplateSchema);
