const { body, param } = require("express-validator");

const objectId = (value) => /^[0-9a-fA-F]{24}$/.test(value);

exports.courseIdParam = [
  param("id").custom(objectId).withMessage("Invalid course id"),
];

exports.createCourse = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),
];

exports.updateCourseName = [
  param("id").custom(objectId).withMessage("Invalid course id"),
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),
];

exports.addChapterName = [
  param("id").custom(objectId).withMessage("Invalid course id"),
  body("chapterName.Name")
    .trim()
    .notEmpty()
    .withMessage("Chapter name is required"),
];

exports.changeSuperSkillsName = [
  body("courseId").custom(objectId).withMessage("Invalid course id"),
  body("superSkillsIndex")
    .isInt({ min: 0 })
    .withMessage("superSkillsIndex must be a non-negative integer"),
  body("superSkillsChangeName")
    .trim()
    .notEmpty()
    .withMessage("New name is required"),
];

exports.addSkills = [
  param("courseId").custom(objectId).withMessage("Invalid course id"),
  param("chapterId").custom(objectId).withMessage("Invalid chapter id"),
  body("skills.skillsName")
    .trim()
    .notEmpty()
    .withMessage("Skill name is required"),
];

exports.changeSkillsName = [
  body("courseId").custom(objectId).withMessage("Invalid course id"),
  body("superSkillsIndex")
    .isInt({ min: 0 })
    .withMessage("superSkillsIndex must be a non-negative integer"),
  body("skillsindex")
    .isInt({ min: 0 })
    .withMessage("skillsindex must be a non-negative integer"),
  body("SkillsChangeName")
    .trim()
    .notEmpty()
    .withMessage("New name is required"),
];

exports.addSkillsContent = [
  param("courseId").custom(objectId).withMessage("Invalid course id"),
  param("chapterId").custom(objectId).withMessage("Invalid chapter id"),
  param("skillsId").custom(objectId).withMessage("Invalid skills id"),
  body("content").notEmpty().withMessage("Content is required"),
];

exports.updateSkillsContent = [
  body("courseId").custom(objectId).withMessage("Invalid course id"),
  body("indexZero")
    .isInt({ min: 0 })
    .withMessage("indexZero must be a non-negative integer"),
  body("indexOne")
    .isInt({ min: 0 })
    .withMessage("indexOne must be a non-negative integer"),
  body("indexTwo")
    .isInt({ min: 0 })
    .withMessage("indexTwo must be a non-negative integer"),
  body("content").notEmpty().withMessage("Content is required"),
];

exports.updateQuizContent = [
  body("quizIndexes.courseId").custom(objectId).withMessage("Invalid course id"),
  body("quizIndexes.SuperSkillsIndex")
    .isInt({ min: 0 })
    .withMessage("SuperSkillsIndex must be a non-negative integer"),
  body("quizIndexes.skillsIndex")
    .isInt({ min: 0 })
    .withMessage("skillsIndex must be a non-negative integer"),
  body("QuizContent").notEmpty().withMessage("Quiz content is required"),
];

exports.deleteSkillContent = [
  param("id").custom(objectId).withMessage("Invalid course id"),
  param("superSkillId").custom(objectId).withMessage("Invalid superSkill id"),
  param("skillId").custom(objectId).withMessage("Invalid skill id"),
  param("skillsContentId")
    .custom(objectId)
    .withMessage("Invalid skillsContent id"),
];

exports.deleteSkill = [
  param("id").custom(objectId).withMessage("Invalid course id"),
  param("superSkillId").custom(objectId).withMessage("Invalid superSkill id"),
  param("skillId").custom(objectId).withMessage("Invalid skill id"),
];
