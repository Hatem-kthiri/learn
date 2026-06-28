const ObjectID = require("bson").ObjectID;
const Course = require("../../models/Course");

// ── Read ──────────────────────────────────────────────────────────────────

// Course LIST — only metadata, no nested skills/quizzes.
// The data[] array can be hundreds of KB per course; the list page never uses it.
// .lean() returns plain JS objects (no Mongoose overhead) for read-only queries.
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
      .select("title description image status")
      .lean();
    res.json({ status: true, courses });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, message: err });
  }
};

// Course DETAIL — full document including data[] for the editor/player.
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).lean();
    res.json({ status: true, msg: "course", course });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, message: err });
  }
};

// ── Create ────────────────────────────────────────────────────────────────
exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    const course = await Course.create({
      title,
      description,
      image: req.file.path, // Cloudinary secure URL
    });

    res.json({ status: true, msg: "course Added", course });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, message: err });
  }
};

// ── Update: course-level ─────────────────────────────────────────────────
exports.updateCourseName = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const updateCourse = await Course.findByIdAndUpdate(id, {
      title,
      description,
    });
    res.json({ status: true, msg: "Chapter  Edited", course: updateCourse });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, message: err });
  }
};

// ── Update: chapters ──────────────────────────────────────────────────────
exports.addChapterName = async (req, res) => {
  try {
    const { id } = req.params;
    const { chapterName } = req.body;

    const course = await Course.findById(id);
    const _id = new ObjectID();

    await Course.findByIdAndUpdate(id, {
      data: [...course.data, { ...chapterName, _id }],
    });
    const AfterUpdateCourse = await Course.findById(id);

    res.json({
      status: true,
      msg: "Chapter Name added",
      data: AfterUpdateCourse,
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, message: err });
  }
};

exports.changeSuperSkillsName = async (req, res) => {
  try {
    const { courseId, superSkillsIndex, superSkillsChangeName } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    course.data[superSkillsIndex].Name = superSkillsChangeName;

    await Course.findByIdAndUpdate(courseId, { ...course });
    res
      .status(200)
      .json({ message: "SuperSkills Name updated successfully", data: course });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── Update: skills ────────────────────────────────────────────────────────
exports.addSkills = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    const { skills } = req.body;
    const course = await Course.findById(chapterId);

    const chapterUpdate = course.data.map((el) =>
      el._id == courseId
        ? {
            ...el,
            superSkills: [...el.superSkills, { ...skills, _id: new ObjectID() }],
          }
        : el
    );

    await Course.findByIdAndUpdate(chapterId, { data: chapterUpdate });
    const courseAfterUpdate = await Course.findById(chapterId);

    res.json({ status: true, msg: "skills added", course: courseAfterUpdate });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, message: err });
  }
};

exports.changeSkillsName = async (req, res) => {
  try {
    const { courseId, superSkillsIndex, skillsindex, SkillsChangeName } =
      req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    course.data[superSkillsIndex].superSkills[skillsindex].skillsName =
      SkillsChangeName;

    await Course.findByIdAndUpdate(courseId, { ...course });
    res
      .status(200)
      .json({ message: "SuperSkills Name updated successfully", data: course });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── Update: skills content (lessons) ────────────────────────────────────
exports.addSkillsContent = async (req, res) => {
  try {
    const { courseId, chapterId, skillsId } = req.params;
    const { content } = req.body;
    const course = await Course.findById(courseId);

    const chapterUpdate = course.data.map((el) =>
      el._id == chapterId
        ? {
            ...el,
            superSkills: el.superSkills.map((skills) =>
              skills._id == skillsId
                ? {
                    ...skills,
                    skillsData: [
                      ...skills.skillsData,
                      { content, type: 0, _id: new ObjectID() },
                    ],
                  }
                : skills
            ),
          }
        : el
    );

    await Course.findByIdAndUpdate(courseId, { data: chapterUpdate });
    const courseAfterUpdate = await Course.findById(courseId);

    res.json({
      status: true,
      msg: "skills Content added",
      course: courseAfterUpdate,
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 500, message: err });
  }
};

exports.updateSkillsContent = async (req, res) => {
  try {
    const { content, indexZero, indexOne, indexTwo, courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.data[indexZero].superSkills[indexOne].skillsData[indexTwo].content =
      content;

    await Course.findByIdAndUpdate(courseId, { ...course });

    res
      .status(200)
      .json({ message: "Skills content updated successfully", data: course });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── Update: quizzes ───────────────────────────────────────────────────────
exports.updateQuizContent = async (req, res) => {
  try {
    const { QuizContent, quizIndexes } = req.body;
    const { SuperSkillsIndex, skillsIndex } = quizIndexes;
    const courseId = quizIndexes.courseId;
    const _id = new ObjectID();

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      {
        $push: {
          [`data.${SuperSkillsIndex}.superSkills.${skillsIndex}.skillsData`]: {
            ...QuizContent,
            _id,
          },
        },
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res
      .status(200)
      .json({ message: "Quiz content updated successfully", data: updatedCourse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── Delete: skill / skill content (nested) ──────────────────────────────
exports.deleteSkillContent = async (req, res) => {
  const { id: courseId, superSkillId, skillId, skillsContentId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const superSkill = course.data.find(
      (s) => s._id.toString() === superSkillId
    );
    if (!superSkill)
      return res.status(404).json({ error: "SuperSkill not found" });

    const skills = superSkill.superSkills.find(
      (s) => s._id.toString() === skillId
    );
    if (!skills) return res.status(404).json({ error: "Skill not found" });

    const skillsDataIndex = skills.skillsData.findIndex(
      (s) => s._id == skillsContentId
    );
    if (skillsDataIndex === -1)
      return res.status(404).json({ error: "SkillsContent not found" });

    skills.skillsData.splice(skillsDataIndex, 1);
    await Course.findByIdAndUpdate(courseId, { ...course });

    res.json({ message: "Skill removed successfully", data: course });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteSkill = async (req, res) => {
  const { id: courseId, superSkillId, skillId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const superSkill = course.data.find(
      (s) => s._id.toString() === superSkillId
    );
    if (!superSkill)
      return res.status(404).json({ error: "SuperSkill not found" });

    const skillsIndex = superSkill.superSkills.findIndex(
      (s) => s._id.toString() === skillId
    );
    if (skillsIndex === -1)
      return res.status(404).json({ error: "skills not found" });

    superSkill.superSkills.splice(skillsIndex, 1);
    await Course.findByIdAndUpdate(courseId, { ...course });

    res.json({ message: "Skills removed successfully", data: course });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndRemove(id);
    res.json({ message: "Course deleted " });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Used by studentController when enrolling a student in a course
exports.extractedSkills = (data) => {
  return data.data.map((item) => ({
    Name: item.Name,
    _id: item._id,
    details: item.superSkills.map(({ open, type, skillsName, _id }) => ({
      open,
      type,
      skillsName,
      _id,
    })),
  }));
};
