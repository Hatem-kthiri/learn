import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import Swal from "sweetalert2";

const emptyForm = () => ({
  _id: null,
  scopeGuild: "",
  trainingCenterName: "",
  title: "Certificate of Completion",
  descriptionText:
    "This certifies that {{studentName}} has successfully completed {{courseName}} on {{completionDate}}.",
  footerText: "",
  numberingFormat: "CERT-{YEAR}-{SEQ}",
  logoUrl: "",
  signatureImageUrl: "",
  backgroundImageUrl: "",
});

const CertificateTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [logoFile, setLogoFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  const getTemplates = () => {
    api.get("/api/admin/certificate-templates").then((r) => setTemplates(r.data.data)).catch(() => {});
  };

  useEffect(() => {
    getTemplates();
  }, []);

  const buildFormData = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "_id" && value !== null && value !== undefined) fd.append(key, value);
    });
    if (logoFile) fd.append("logo", logoFile);
    if (signatureFile) fd.append("signatureImage", signatureFile);
    if (backgroundFile) fd.append("backgroundImage", backgroundFile);
    return fd;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.trainingCenterName.trim()) {
      Swal.fire({ icon: "warning", title: "Training center name is required" });
      return;
    }
    setSaving(true);
    try {
      const fd = buildFormData();
      if (form._id) {
        await api.put(`/api/admin/certificate-templates/${form._id}`, fd);
      } else {
        await api.post("/api/admin/certificate-templates", fd);
      }
      Swal.fire({ icon: "success", title: "Template saved" });
      setForm(emptyForm());
      setLogoFile(null);
      setSignatureFile(null);
      setBackgroundFile(null);
      getTemplates();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Could not save template",
        text: err?.response?.data?.message || "Please check the form",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    setPreviewing(true);
    try {
      const fd = buildFormData();
      const res = await api.post("/api/admin/certificate-templates/preview", fd, {
        responseType: "blob",
      });
      const blobUrl = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      window.open(blobUrl, "_blank");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Could not generate preview" });
    } finally {
      setPreviewing(false);
    }
  };

  const handleEdit = (t) => {
    setForm({
      _id: t._id,
      scopeGuild: t.scopeGuild || "",
      trainingCenterName: t.trainingCenterName || "",
      title: t.title || "",
      descriptionText: t.descriptionText || "",
      footerText: t.footerText || "",
      numberingFormat: t.numberingFormat || "CERT-{YEAR}-{SEQ}",
      logoUrl: t.logoUrl || "",
      signatureImageUrl: t.signatureImageUrl || "",
      backgroundImageUrl: t.backgroundImageUrl || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleActivate = (id) => {
    api.patch(`/api/admin/certificate-templates/${id}/activate`).then(() => {
      Swal.fire({ icon: "success", title: "Template activated", timer: 1200, showConfirmButton: false });
      getTemplates();
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete this template?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
    }).then((r) => {
      if (r.isConfirmed) {
        api.delete(`/api/admin/certificate-templates/${id}`).then(getTemplates);
      }
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Certificate Templates</h1>
      <p className="text-slate-500 text-sm mb-6">
        Editable branding and content used when certificates are generated. Changes apply to all
        certificates issued after activation — already-issued certificates are unaffected.
      </p>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 space-y-5"
      >
        <h2 className="font-bold text-slate-900">{form._id ? "Edit Template" : "New Template"}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Training Center Name
            </label>
            <input
              type="text"
              required
              value={form.trainingCenterName}
              onChange={(e) => setForm({ ...form, trainingCenterName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Scope (guild name, optional)
            </label>
            <input
              type="text"
              placeholder="Leave blank for the default template"
              value={form.scopeGuild}
              onChange={(e) => setForm({ ...form, scopeGuild: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Certificate Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Numbering Format
            </label>
            <input
              type="text"
              value={form.numberingFormat}
              onChange={(e) => setForm({ ...form, numberingFormat: e.target.value })}
              placeholder="CERT-{YEAR}-{SEQ}"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Description Text
          </label>
          <p className="text-xs text-slate-400 mb-1.5">
            Placeholders: {"{{studentName}}"}, {"{{courseName}}"}, {"{{completionDate}}"},{" "}
            {"{{trainingCenterName}}"}
          </p>
          <textarea
            rows={3}
            value={form.descriptionText}
            onChange={(e) => setForm({ ...form, descriptionText: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Footer Text</label>
          <input
            type="text"
            value={form.footerText}
            onChange={(e) => setForm({ ...form, footerText: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files[0])}
              className="w-full text-xs"
            />
            {form.logoUrl && !logoFile && (
              <img src={form.logoUrl} alt="" className="mt-2 h-10 object-contain" />
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Signature Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSignatureFile(e.target.files[0])}
              className="w-full text-xs"
            />
            {form.signatureImageUrl && !signatureFile && (
              <img src={form.signatureImageUrl} alt="" className="mt-2 h-10 object-contain" />
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Background / Template Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBackgroundFile(e.target.files[0])}
              className="w-full text-xs"
            />
            {form.backgroundImageUrl && !backgroundFile && (
              <img src={form.backgroundImageUrl} alt="" className="mt-2 h-10 object-contain" />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
          {form._id && (
            <button
              type="button"
              onClick={() => {
                setForm(emptyForm());
                setLogoFile(null);
                setSignatureFile(null);
                setBackgroundFile(null);
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel Edit
            </button>
          )}
          <button
            type="button"
            onClick={handlePreview}
            disabled={previewing}
            className="bg-violet-100 hover:bg-violet-200 text-violet-700 font-semibold px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 transition-colors"
          >
            {previewing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-eye"></i>}
            Preview
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 transition-colors"
          >
            {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
            {form._id ? "Save Changes" : "Create Template"}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div
            key={t._id}
            className={`bg-white rounded-2xl shadow-sm border p-5 ${t.isActive ? "border-indigo-300 ring-2 ring-indigo-100" : "border-slate-100"}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-900">{t.trainingCenterName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t.scopeGuild || "Default template"}</p>
              </div>
              {t.isActive && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-4 line-clamp-2">{t.title}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(t)}
                className="flex-1 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                Edit
              </button>
              {!t.isActive && (
                <button
                  onClick={() => handleActivate(t._id)}
                  className="flex-1 text-xs font-semibold px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  Activate
                </button>
              )}
              <button
                onClick={() => handleDelete(t._id)}
                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
              >
                <i className="fas fa-trash-alt text-xs"></i>
              </button>
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="col-span-3 text-center py-16 text-slate-400">
            <i className="fas fa-certificate text-5xl mb-4 block opacity-20"></i>
            <p className="font-semibold">No templates yet. Create one above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateTemplates;
