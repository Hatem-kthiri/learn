import "../App.css";
import { useState, useEffect } from "react";
import "./style.css";

// import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import RichtextEditor from "./RichtextEditor";
import { Link } from "react-router-dom";
import api from "../utils/api";
function CourseCreate() {
  const [allCourses, setAllCourses] = useState([]);
  useEffect(() => {
    api
      .get(`/api/admin/getCourse`)
      .then((res) => setAllCourses(res.data.courses))
      .catch((err) => console.log(err));
  }, []);

  const [course, setCourse] = useState({});
  const handleChange = (e) => {
    e.preventDefault();
    setCourse({ ...course, [e.target.name]: e.target.value });
  };
  const [courseCreated, setCourseCreated] = useState();
  const CreateCourse = async (Course) => {
    try {
      let result = await api.post("/api/admin/createCourse", Course);
      setCourseCreated(result.data.course);
      if (result.statusText == "OK") {
        var form_1 = document.querySelector(".form_1");
        var form_2 = document.querySelector(".form_2");
        var form_2_progessbar = document.querySelector(".form_2_progessbar");
        var form_1_btns = document.querySelector(".form_1_btns");
        var form_2_btns = document.querySelector(".form_2_btns");
        form_1.style.display = "none";
        form_2.style.display = "block";
        form_1_btns.style.display = "none";
        form_2_btns.style.display = "flex";
        form_2_progessbar.classList.add("active");
      }
    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  };
  const form1NextBtn = () => {
    CreateCourse(course);
  };
  const form2BackBtn = () => {
    var form_1 = document.querySelector(".form_1");
    var form_2 = document.querySelector(".form_2");
    var form_1_btns = document.querySelector(".form_1_btns");
    var form_2_btns = document.querySelector(".form_2_btns");
    form_1.style.display = "block";
    form_2.style.display = "none";

    form_1_btns.style.display = "flex";
    form_2_btns.style.display = "none";
    var form_2_progessbar = document.querySelector(".form_2_progessbar");

    form_2_progessbar.classList.remove("active");
  };
  const form2NextBtn = () => {
    var form_2 = document.querySelector(".form_2");
    var form_3 = document.querySelector(".form_3");
    var form_2_btns = document.querySelector(".form_2_btns");
    var form_3_btns = document.querySelector(".form_3_btns");
    form_2.style.display = "none";
    form_3.style.display = "block";

    form_3_btns.style.display = "flex";
    form_2_btns.style.display = "none";
    var form_3_progessbar = document.querySelector(".form_3_progessbar");

    form_3_progessbar.classList.add("active");
  };
  const form3BackBtn = () => {
    var form_2 = document.querySelector(".form_2");
    var form_3 = document.querySelector(".form_3");
    var form_2_btns = document.querySelector(".form_2_btns");
    var form_3_btns = document.querySelector(".form_3_btns");
    form_2.style.display = "block";
    form_3.style.display = "none";

    form_3_btns.style.display = "none";
    form_2_btns.style.display = "flex";
    var form_3_progessbar = document.querySelector(".form_3_progessbar");

    form_3_progessbar.classList.remove("active");
  };
  return (
    <div className="wrapper">
      {allCourses
        .filter((course) => course.status == "draft")
        .map((course) => {
          return (
            <Link to={`/editCourse/${course._id}`}>
              <div>
                <h5>Course title : {course.title}</h5>
                <p>Course Description : {course.description}</p>
                <span>Status : {course.status}</span>
              </div>
            </Link>
          );
        })}
      <div className="header">
        <ul>
          <li className="active form_1_progessbar">
            <div>
              <p>1</p>
            </div>
          </li>
          <li className="form_2_progessbar">
            <div>
              <p>2</p>
            </div>
          </li>
          <li className="form_3_progessbar">
            <div>
              <p>3</p>
            </div>
          </li>
        </ul>
      </div>
      <div className="form_wrap">
        <div className="form_1 data_info">
          <h2>Create New Track</h2>
          <form>
            <div className="form_container">
              <div className="input_wrap">
                <label htmlFor="track">Track Name</label>
                <input
                  type="text"
                  name="title"
                  className="input"
                  placeholder="Course title here"
                  id="track"
                  onChange={handleChange}
                />
                <textarea
                  name="description"
                  placeholder="item description here"
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </form>
        </div>
        <div className="form_2 data_info" style={{ display: "none" }}>
          <h2>Add Super Skills</h2>
          <form>
            <div className="form_container">
              <div className="input_wrap">
                <label htmlFor="super_skills_name">Super Skills Name</label>
                <input
                  type="text"
                  name="SuperSkillsName"
                  className="input"
                  id="super_skills_name"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="form_3 data_info" style={{ display: "none" }}>
          <h2>Skills</h2>
          <form>
            <div className="form_container">
              <div className="input_wrap">
                <label htmlFor="company">skills Name</label>
                <input
                  type="text"
                  name="skills_Name"
                  className="input"
                  id="company"
                />
              </div>
              <div className="input_wrap">
                <label htmlFor="experience">Skills Content</label>
                <div>
                  <RichtextEditor />
                  {/* <textarea
                                        disabled
                                        value={draftToHtml(
                                            convertToRaw(
                                                editorState2.getCurrentContent()
                                            )
                                        )}
                                    /> */}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="btns_wrap">
        <div className="common_btns form_1_btns">
          <button type="button" className="btn_next" onClick={form1NextBtn}>
            Next{" "}
          </button>
        </div>
        <div className="common_btns form_2_btns" style={{ display: "none" }}>
          <button type="button" className="btn_back" onClick={form2BackBtn}>
            Back
          </button>
          <button type="button" className="btn_next" onClick={form2NextBtn}>
            Next{" "}
          </button>
        </div>
        <div className="common_btns form_3_btns" style={{ display: "none" }}>
          <button type="button" className="btn_back" onClick={form3BackBtn}>
            Back
          </button>
          <button type="button" className="btn_done">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseCreate;
