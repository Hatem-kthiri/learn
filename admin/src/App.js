import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Routes, Route } from "react-router-dom";
import EditCourse from "./Pages/Admin/EditCourse/EditCourse";
import Admin from "./Pages/Admin/Admin";
import CreateCourse from "./Pages/Admin/CreateCourse/CreateCourse";
import MyCourse from "./Pages/Admin/MyCourse/MyCourse";
import AddStudent from "./Pages/Admin/AddStudent/AddStudent";
import StudentList from "./Pages/Admin/StudentList/StudentList";
import AddInstructor from "./Pages/Admin/AddInstructor/AddInstructor";
import InstructorList from "./Pages/Admin/InstructorList/InstructorList";
import Guild from "./Pages/Admin/Guild/Guild";
import CertificateTemplates from "./Pages/Admin/CertificateTemplates/CertificateTemplates";
import EditInstructor from "./Pages/Admin/EditInstructor/EditInstructor";
import PaymentStudentList from "./Pages/Admin/Payment/PaymentStudentList";
import PaymentForm from "./Pages/Admin/Payment/addPayment";
import Dashboard from "./Pages/Admin/Dashboard/Dashboard";
import Login from "./Pages/Login/Login";
import { PublicRoute } from "./utils/PublicRoute";
import { PrivateRoute } from "./utils/ProtectedRoute";
import NotFound from "./Components/NotFound/NotFound";
function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-student" element={<AddStudent />} />
          <Route path="add-instructor" element={<AddInstructor />} />
          <Route path="edit-instructor/:id" element={<EditInstructor />} />
          <Route path="createCourse" element={<CreateCourse />} />
          <Route path="editCourse/:id" element={<EditCourse />} />
          <Route path="mycourse" element={<MyCourse />} />
          <Route path="students-list" element={<StudentList />} />
          <Route path="instructors-list" element={<InstructorList />} />
          <Route path="guild" element={<Guild />} />
          <Route path="certificate-templates" element={<CertificateTemplates />} />
          <Route
            path="student-payment/:studentId"
            element={<PaymentStudentList />}
          />
          <Route
            path="add-student-payment/:studentId"
            element={<PaymentForm />}
          />
        </Route>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
