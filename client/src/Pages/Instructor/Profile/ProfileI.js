import React, { useEffect, useState } from "react";
import HeaderI from "../../../Components/Header/HeaderI";
import { useDispatch, useSelector } from "react-redux";
import { current, updateProfileInstructor } from "../../../redux/actions/Actions";
import ClipLoader from "react-spinners/ClipLoader";
import Footer from "../../../Components/Footer/Footer";

const ProfileI = () => {
  const dispatch = useDispatch();
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const [image, setImage] = useState("");
  const [file, setFile] = useState(undefined);
  const [instructorProfile, setInstructorProfile] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { dispatch(current()); }, []);

  const handleImageUpload = (e) => {
    const f = e.target.files[0]; setFile(f);
    if (f) { const r = new FileReader(); r.onload = () => setImage(r.result); r.readAsDataURL(f); }
  };
  const handleChange = (e) => setInstructorProfile({ ...instructorProfile, [e.target.name]: e.target.value });

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("image", file);
    ["address","firstName","lastName","phone"].forEach((k) => { if (instructorProfile[k] !== undefined) formData.append(k, instructorProfile[k]); });
    setLoading(true);
    dispatch(updateProfileInstructor({ user, formData, setLoading }));
  };

  const fields = [
    { name: "firstName", label: "First Name", type: "text", val: user.firstName },
    { name: "lastName", label: "Last Name", type: "text", val: user.lastName },
    { name: "phone", label: "Phone", type: "text", val: user.phone },
    { name: "address", label: "Address", type: "text", val: user.address },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderI />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Update your instructor information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-100">
            <div className="relative">
              <img src={image || user.profileImg} alt="" className="w-20 h-20 rounded-2xl object-cover bg-slate-100" />
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors">
                <i className="fas fa-camera text-white text-xs"></i>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg">{user.firstName} {user.lastName}</p>
              <p className="text-slate-500 text-sm">{user.email}</p>
              <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
                <i className="fas fa-chalkboard-teacher mr-1 text-xs"></i> Instructor
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{f.label}</label>
                <input type={f.type} name={f.name} defaultValue={f.val || ""} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>
            ))}
          </div>

          {/* Guild info */}
          {user.guild && (
            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Guild</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700">
                <i className="fas fa-award mr-1.5 text-xs"></i>{user.guild}
              </span>
            </div>
          )}

          <button onClick={handleUpdate} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all flex items-center gap-2">
            {loading ? <ClipLoader color="#fff" size={18} /> : <><i className="fas fa-save"></i> Save Changes</>}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileI;
