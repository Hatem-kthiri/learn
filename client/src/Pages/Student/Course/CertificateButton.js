import React, { useEffect, useState } from "react";
import axios from "axios";
import { url, errorToast, successToast } from "../../../utils";

// Shows nothing while loading, a disabled "Not yet eligible" pill once
// checked, or a working Download button once the student is eligible or
// already has a generated certificate. Generation happens transparently
// on first click (see certificateController.generate) — there's no
// separate "generate" step exposed to the student, matching "automatic".
const CertificateButton = ({ studentId, courseId, dm }) => {
  const [status, setStatus] = useState(null); // "NotEligible" | "Eligible" | "Generated"
  const [reason, setReason] = useState("");
  const [certificateId, setCertificateId] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!studentId || !courseId) return;
    axios
      .get(`${url}/api/v1/certificate/status/${studentId}/${courseId}`)
      .then((r) => {
        setStatus(r.data.data.status);
        setReason(r.data.data.reason || "");
        if (r.data.data.certificate) setCertificateId(r.data.data.certificate._id);
      })
      .catch(() => {});
  }, [studentId, courseId]);

  const handleDownload = async () => {
    setBusy(true);
    try {
      let id = certificateId;
      if (!id) {
        const gen = await axios.post(`${url}/api/v1/certificate/generate/${studentId}/${courseId}`);
        id = gen.data.data._id;
        setCertificateId(id);
        setStatus("Generated");
        successToast("Certificate generated!");
      }
      window.open(`${url}/api/v1/certificate/${id}/download`, "_blank");
    } catch (err) {
      errorToast(err?.response?.data?.message || "Could not generate certificate");
    } finally {
      setBusy(false);
    }
  };

  if (!status || status === "NotEligible") {
    return status === "NotEligible" ? (
      <div
        className={`flex items-center gap-2 text-xs mb-6 px-3 py-2 rounded-xl ${dm ? "bg-gray-800 text-gray-400" : "bg-slate-50 text-slate-400"}`}
      >
        <i className="fas fa-lock"></i>
        Certificate not yet available{reason ? ` — ${reason}` : ""}
      </div>
    ) : null;
  }

  return (
    <button
      onClick={handleDownload}
      disabled={busy}
      className="flex items-center gap-2 text-sm font-semibold mb-6 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
    >
      {busy ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-award"></i>}
      Download Certificate
    </button>
  );
};

export default CertificateButton;
