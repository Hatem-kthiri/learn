import React, { useEffect, useState } from "react";
import HeaderS from "../../../Components/Header/HeaderS";
import { useDispatch, useSelector } from "react-redux";
import { current, updateProfileStudent } from "../../../redux/actions/Actions";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import Footer from "../../../Components/Footer/Footer";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, userLoading } = useSelector((state) => state.LoginReducer);
  const { night_mode } = useSelector((state) => state.StudentReducer);
  const [image, setImage] = useState("");
  const [file, setFile] = useState(undefined);
  const [studentProfile, setStudentProfile] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(current());
  }, []);

  const handleImageUpload = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) {
      const r = new FileReader();
      r.onload = () => setImage(r.result);
      r.readAsDataURL(f);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!user.socialMediaLinks) return;
    const updated = [...user.socialMediaLinks];
    if (name === "githubLink") {
      updated[0] = { githublink: value };
      setStudentProfile({ ...studentProfile, socialMediaLinks: updated });
    } else if (name === "linkedinLink") {
      updated[1] = { linkedinLink: value };
      setStudentProfile({ ...studentProfile, socialMediaLinks: updated });
    } else setStudentProfile({ ...studentProfile, [name]: value });
  };

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("image", file);
    Object.keys(studentProfile).forEach((k) => {
      if (k !== "socialMediaLinks") formData.append(k, studentProfile[k]);
    });
    if (studentProfile.socialMediaLinks)
      formData.append(
        "socialMediaLinks",
        JSON.stringify(studentProfile.socialMediaLinks),
      );
    setLoading(true);
    dispatch(updateProfileStudent({ user, formData, setLoading }));
  };

  const fields = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      val: user.firstName,
    },
    { name: "lastName", label: "Last Name", type: "text", val: user.lastName },
    { name: "phone", label: "Phone", type: "text", val: user.phone },
    { name: "address", label: "Address", type: "text", val: user.address },
    {
      name: "githubLink",
      label: "GitHub URL",
      type: "url",
      val: user.socialMediaLinks?.[0]?.githublink,
    },
    {
      name: "linkedinLink",
      label: "LinkedIn URL",
      type: "url",
      val: user.socialMediaLinks?.[1]?.linkedinLink,
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col ${night_mode ? "bg-gray-900" : "bg-slate-50"}`}
    >
      <HeaderS />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your account settings
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
          {/* Avatar section */}
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-100">
            <div className="relative">
              <img
                src={image || user.profileImg}
                alt=""
                className="w-20 h-20 rounded-2xl object-cover bg-slate-100"
              />
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors">
                <i className="fas fa-camera text-white text-xs"></i>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-slate-500 text-sm">{user.email}</p>
              <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                {user.course?.[0]?.guild}
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  name={f.name}
                  defaultValue={f.val || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            ))}
          </div>

          {/* Course info */}
          {user.course?.map((c, i) => (
            <div
              key={i}
              className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200"
            >
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Course Info
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Course</p>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    {c.course?.title}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Guild</p>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    {c.guild}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Progress</p>
                  <p className="font-semibold text-indigo-600 mt-0.5">
                    {c.learnProgress || 0}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Score</p>
                  <p className="font-semibold text-emerald-600 mt-0.5">
                    {c.learnScore || 0}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleUpdate}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <ClipLoader color="#fff" size={18} />
            ) : (
              <>
                <i className="fas fa-save"></i> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
