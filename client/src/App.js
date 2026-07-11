import Login from "./Pages/Login/Login";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { PrivateRoute } from "./utils/ProtectedRoute";
import { PublicRoute } from "./utils/PublicRoute";
import DashboardStudent from "./Pages/Student/Dashboard/Dashboard";
import Course from "./Pages/Student/Course/Course";
import Checkpoint from "./Pages/Student/Checkpoint/Checkpoint";
import { useSelector } from "react-redux";
import Profile from "./Pages/Student/Profile/Profile";
import ChangePassword from "./Pages/Student/ChangePassword/ChangePassword";
import DashboardInstuctor from "./Pages/Instructor/Dashboard/DashboardInstuctor";
import CourseInstuctor from "./Pages/Instructor/Course/CourseInstuctor";
import CheckpointI from "./Pages/Instructor/Checkpoint/CheckpointI";
import CheckpointValidate from "./Pages/Instructor/Checkpoint/CheckpointValidate";
import StudentList from "./Pages/Instructor/StudentList/StudentList";
import ProfileI from "./Pages/Instructor/Profile/ProfileI";
import ChangePasswordI from "./Pages/Instructor/ChangePassword/ChangePassword";
import Footer from "./Components/Footer/Footer";
import Meetings from "./Pages/Instructor/Meetings/Meetings";
import { useEffect } from "react";
import NotFound from "./Pages/NotFound/NotFound";
import PasswordRecovery from "./Pages/PasswordRecovery/PasswordRecovery";
import Workshops from "./Pages/Instructor/Workshops/Workshops";
import WorkShopList from "./Pages/Student/WorkshopList/WorkshopList";
import Courses from "./Pages/Student/MyCourse/Courses";
import StudentDetails from "./Pages/Instructor/StudentList/StudentDetails";
import HeaderS from "./Components/Header/HeaderS";
import HeaderI from "./Components/Header/HeaderI";
import Chat from "./Pages/Chat/Chat";
function App() {
  const { night_mode } = useSelector((state) => state.StudentReducer);
  const { user } = useSelector((state) => state.LoginReducer);
  useEffect(() => {
    document.querySelector("html").classList.toggle("dark", night_mode);
  }, [night_mode]);
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isRecoveryPassword = location.pathname === "/recovery-password";
  const isChat = location.pathname === "/chat";
  const isLearnChat = location.pathname === "/learn-chat";
  const isCourse = location.pathname === "/course/";
  return (
    <div className={night_mode ? "dark" : ""}>
      <Routes>
        <Route exact path="/" element={<Navigate to="/login" />} />

        <Route
          path="/login"
          element={
            <PublicRoute user={user}>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/recovery-password"
          element={
            <PublicRoute user={user}>
              <PasswordRecovery />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard-student"
          element={
            <PrivateRoute user="2">
              <DashboardStudent />
            </PrivateRoute>
          }
        />
        <Route
          path="/course/:superSkillsId/:skillsId"
          element={
            <PrivateRoute user="2">
              <Course />
            </PrivateRoute>
          }
        />
        <Route
          path="/workshop-list"
          element={
            <PrivateRoute user="2">
              <WorkShopList />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkpoint"
          element={
            <PrivateRoute user="2">
              <Checkpoint />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkpoint/:id"
          element={
            <PrivateRoute user="2">
              <Checkpoint />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile-student"
          element={
            <PrivateRoute user="2">
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute user="1">
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/learn-chat"
          element={
            <PrivateRoute user="2">
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <PrivateRoute user="2">
              <ChangePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <PrivateRoute user="2">
              <Courses />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard-instructor"
          element={
            <PrivateRoute user="1">
              <DashboardInstuctor />
            </PrivateRoute>
          }
        />
        <Route
          path="/course/:courseId/:superSkillsId/:skillsId"
          element={
            <PrivateRoute user="1">
              <CourseInstuctor />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkpoints"
          element={
            <PrivateRoute user="1">
              <CheckpointI />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkpoint-validate/:id"
          element={
            <PrivateRoute user="1">
              <CheckpointValidate />
            </PrivateRoute>
          }
        />
        <Route
          path="/students-list"
          element={
            <PrivateRoute user="1">
              <StudentList />
            </PrivateRoute>
          }
        />
        <Route
          path="/student-details/:studentId"
          element={
            <PrivateRoute user="1">
              <StudentDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/instructor-profile"
          element={
            <PrivateRoute user="1">
              <ProfileI />
            </PrivateRoute>
          }
        />
        <Route
          path="/change-password-instructor"
          element={
            <PrivateRoute user="1">
              <ChangePasswordI />
            </PrivateRoute>
          }
        />
        <Route
          path="/meetings"
          element={
            <PrivateRoute user="1">
              <Meetings />
            </PrivateRoute>
          }
        />
        <Route
          path="/workshops"
          element={
            <PrivateRoute user="1">
              <Workshops />
            </PrivateRoute>
          }
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      {/* {!isLoginPage &&
        !isRecoveryPassword &&
        !isChat &&
        !isLearnChat &&
        !isCourse && } */}
    </div>
  );
}

export default App;
