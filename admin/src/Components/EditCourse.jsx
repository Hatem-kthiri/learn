import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
const EditCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState();
  useEffect(() => {
    api
      .get(`/api/admin/getCourse/${id}`)
      .then((res) => setCourse(res.data.course))
      .catch((err) => console.log(err));
  }, []);
  console.log(course);
  const [chapter, setChapter] = useState();
  const handleChange = (e) => {
    setChapter({ chapterName: e.target.value, superSkills: [] });
  };
  const handleClick = () => {
    api
      .put(`/api/admin/updateCourse/${id}`, { chapter })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  return (
    <>
      <label>chapitre Name</label>
      <input onChange={handleChange} />
      <button onClick={handleClick}>save</button>
    </>
  );
};

export default EditCourse;
