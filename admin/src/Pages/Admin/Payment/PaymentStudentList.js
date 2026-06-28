import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../utils/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../Assets/images/dark-logo.png";
import Swal from "sweetalert2";

const PaymentStudentList = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState({});
  const invoiceRef = useRef(null);

  const getStudentInfo = async () => {
    await api.get(`/api/admin/getStudentInfo/${studentId}`).then((r) => setStudentInfo(r.data.data)).catch(() => {});
  };
  useEffect(() => { getStudentInfo(); }, [studentId]);

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")} ${String(date.getHours()-1).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}`;
  };

  const handleDeletePayment = (index) => {
    Swal.fire({ title: "Delete payment?", icon: "warning", showCancelButton: true, confirmButtonColor: "#4f46e5", cancelButtonColor: "#ef4444", confirmButtonText: "Yes, delete" })
      .then((r) => { if (r.isConfirmed) api.delete(`/api/admin/delete_payment/${studentId}/${index}`).then(getStudentInfo); });
  };

  const totalPaid = studentInfo.invoicePayment?.reduce((sum, p) => sum + (+p.price || 0), 0) || 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors">
            <i className="fas fa-arrow-left text-sm"></i>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Payment History</h1>
            <p className="text-slate-500 text-sm mt-0.5">{studentInfo.firstName} {studentInfo.lastName}</p>
          </div>
        </div>
        <Link to={`/add-payment/${studentId}`} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 shadow-sm transition-all">
          <i className="fas fa-plus"></i> Add Payment
        </Link>
      </div>

      {/* Student info card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col items-center text-center">
          <img src={studentInfo.profileImg} alt="" className="w-16 h-16 rounded-2xl object-cover bg-slate-100 mb-3" />
          <p className="font-bold text-slate-900">{studentInfo.firstName} {studentInfo.lastName}</p>
          <p className="text-sm text-slate-500 mt-0.5">{studentInfo.email}</p>
          <span className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
            {studentInfo.course?.[0]?.guild}
          </span>
        </div>

        {[
          { label: "Total Paid", value: `${totalPaid} TND`, icon: "fas fa-money-bill-wave", color: "bg-emerald-50 text-emerald-600" },
          { label: "Payments Count", value: studentInfo.invoicePayment?.length || 0, icon: "fas fa-receipt", color: "bg-indigo-50 text-indigo-600" },
          { label: "Expiry Date", value: studentInfo.expiryDate ? new Date(studentInfo.expiryDate).toLocaleDateString() : "N/A", icon: "fas fa-calendar-alt", color: "bg-amber-50 text-amber-600" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <i className={`${s.icon} text-lg`}></i>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Payments table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["#", "Course", "Months", "Amount", "Payment Date", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {studentInfo.invoicePayment?.map((payment, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-400 text-xs">#{String(i+1).padStart(3,"0")}</td>
                  <td className="px-5 py-4 font-medium text-slate-900">{payment.course}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">{payment.numberOfMonth} mo</span>
                  </td>
                  <td className="px-5 py-4 font-bold text-emerald-600">{payment.price} TND</td>
                  <td className="px-5 py-4 text-slate-500 text-xs">{formatDate(payment.paymentDate)}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => handleDeletePayment(i)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors">
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {(!studentInfo.invoicePayment || studentInfo.invoicePayment.length === 0) && (
                <tr><td colSpan={6} className="text-center py-16 text-slate-400">
                  <i className="fas fa-receipt text-4xl mb-3 block opacity-20"></i>
                  <p className="font-medium">No payments recorded yet</p>
                  <Link to={`/add-payment/${studentId}`} className="inline-flex items-center gap-2 mt-3 text-indigo-600 font-semibold text-sm hover:underline">
                    <i className="fas fa-plus text-xs"></i> Add first payment
                  </Link>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentStudentList;
