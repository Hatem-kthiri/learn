const router = require("express").Router();
const isAuth = require("../middlewares/isAuth");
const validate = require("../middlewares/validate");
const { makeUploader } = require("../config/cloudinary");

const authController = require("../controllers/admin/authController");
const courseController = require("../controllers/admin/courseController");
const studentController = require("../controllers/admin/studentController");
const instructorController = require("../controllers/admin/instructorController");
const guildController = require("../controllers/admin/guildController");

const authValidators = require("../validators/admin/authValidators");
const courseValidators = require("../validators/admin/courseValidators");
const studentValidators = require("../validators/admin/studentValidators");
const instructorValidators = require("../validators/admin/instructorValidators");
const guildValidators = require("../validators/admin/guildValidators");

const upload = makeUploader("uploads");

// ── Auth (public) ─────────────────────────────────────────────────────────
router.post("/login", validate(authValidators.login), authController.login);

// ─────────────────────────────────────────────────────────────────────────
// SECURITY GAP CARRIED OVER FROM THE ORIGINAL CODE:
// admin.js never applied `isAuth` to any route below — every admin endpoint
// (course/student/instructor/guild CRUD) is publicly reachable by anyone
// with the URL, no login required. This is NOT fixed automatically here,
// because your admin panel's axios calls don't currently send an
// Authorization header (it's commented out in
// admin/src/redux/actions/Actions.js), so flipping this on by default would
// break the admin panel immediately.
//
// To close this gap:
//   1. Update the admin panel to store the JWT from /login and attach it as
//      an `authorization` header on every request (see ENABLE_ADMIN_AUTH
//      note in the admin frontend).
//   2. Set ENABLE_ADMIN_AUTH=true in backend .env once step 1 is deployed.
// ─────────────────────────────────────────────────────────────────────────
if (process.env.ENABLE_ADMIN_AUTH === "true") {
  router.use(isAuth);
}

// ── Courses ───────────────────────────────────────────────────────────────
router.get("/getCourse", courseController.getAllCourses);
router.get(
  "/getCourse/:id",
  validate(courseValidators.courseIdParam),
  courseController.getCourseById
);
router.post(
  "/createCourse",
  upload.single("image"),
  validate(courseValidators.createCourse),
  courseController.createCourse
);
router.put(
  "/updatedCourseName/:id",
  validate(courseValidators.updateCourseName),
  courseController.updateCourseName
);
router.put(
  "/addChapterName/:id",
  validate(courseValidators.addChapterName),
  courseController.addChapterName
);
router.put(
  "/changeSuperSkillsName",
  validate(courseValidators.changeSuperSkillsName),
  courseController.changeSuperSkillsName
);
router.put(
  "/addSkills/:courseId/:chapterId",
  validate(courseValidators.addSkills),
  courseController.addSkills
);
router.put(
  "/changeSkillsName",
  validate(courseValidators.changeSkillsName),
  courseController.changeSkillsName
);
router.put(
  "/addSkillsContent/:courseId/:chapterId/:skillsId",
  validate(courseValidators.addSkillsContent),
  courseController.addSkillsContent
);
router.put(
  "/updateSkillsContent",
  validate(courseValidators.updateSkillsContent),
  courseController.updateSkillsContent
);
router.put(
  "/updateQuizContent",
  validate(courseValidators.updateQuizContent),
  courseController.updateQuizContent
);
router.delete(
  "/courses/:id/superSkills/:superSkillId/skills/:skillId/skillsContent/:skillsContentId",
  validate(courseValidators.deleteSkillContent),
  courseController.deleteSkillContent
);
router.delete(
  "/courses/:id/superSkills/:superSkillId/skills/:skillId/",
  validate(courseValidators.deleteSkill),
  courseController.deleteSkill
);
router.delete(
  "/delete_course/:id",
  validate(courseValidators.courseIdParam),
  courseController.deleteCourse
);

// ── Students ──────────────────────────────────────────────────────────────
router.post(
  "/addStudent",
  validate(studentValidators.quickAddStudent),
  studentController.quickAddStudent
);
router.post(
  "/add-student",
  validate(studentValidators.addStudent),
  studentController.addStudent
);
router.get("/getStudents", studentController.getStudents);
router.get(
  "/getStudentInfo/:id",
  validate(studentValidators.studentIdParam),
  studentController.getStudentInfo
);
router.get("/get-students-payments", studentController.getStudentsPayments);
router.put(
  "/updateStudent/:id",
  validate(studentValidators.updateStudent),
  studentController.updateStudent
);
router.put(
  "/add-payment/:id",
  validate(studentValidators.addPayment),
  studentController.addPayment
);
router.delete(
  "/delete_invoice/user/:id/invoice_index/:invoiceId",
  validate(studentValidators.deleteInvoice),
  studentController.deleteInvoice
);
router.delete(
  "/delete_student/:id",
  validate(studentValidators.studentIdParam),
  studentController.deleteStudent
);

// ── Instructors ───────────────────────────────────────────────────────────
router.post(
  "/addInstructor",
  validate(instructorValidators.quickAddInstructor),
  instructorController.quickAddInstructor
);
router.post(
  "/add-instructor",
  validate(instructorValidators.addInstructor),
  instructorController.addInstructor
);
router.get("/getInstructors", instructorController.getInstructors);
router.get(
  "/getInstructor/:id",
  validate(instructorValidators.instructorIdParam),
  instructorController.getInstructorById
);
router.put(
  "/edit-instructor/:id",
  validate(instructorValidators.editInstructor),
  instructorController.editInstructor
);
router.delete(
  "/delete_instructor/:id",
  validate(instructorValidators.instructorIdParam),
  instructorController.deleteInstructor
);

// ── Guilds ────────────────────────────────────────────────────────────────
router.post(
  "/createGuild",
  validate(guildValidators.createGuild),
  guildController.createGuild
);
router.post(
  "/addGuild",
  validate(guildValidators.createGuild),
  guildController.addGuild
);
router.get("/getGuild", guildController.getGuilds);
router.delete(
  "/delete_guild/:id",
  validate(guildValidators.guildIdParam),
  guildController.deleteGuild
);

module.exports = router;
