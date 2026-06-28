import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import JoditEditor from "jodit-react";

const RichtextEditor = () => {
    const editor = useRef(null);
    const [content, setContent] = useState([]);
    const [skillsContent, setSkillsContent] = useState([]);

    const config = {
        readonly: false,
        height: 400,
    };
    const handleUpdate = (newContent, index) => {
        setContent(newContent);
    };

    const addSkillsContent = (e, index) => {
        e.preventDefault();
        skillsContent.find((skills) => skills.id == index)
            ? (skillsContent.find((skills) => skills.id == index).content =
                  content)
            : setSkillsContent([
                  ...skillsContent,
                  { id: index, content: content, type: "Course" },
              ]);
    };

    const [Editor, setEditor] = useState([JoditEditor]);

    const addAnotherSkillsContent = (e) => {
        e.preventDefault();
        setEditor([...Editor, JoditEditor]);
    };

    // console.log(content);

    return (
        <div className="App">
            {/* <JoditEditor
                ref={editor}
                // value={content}
                config={config}
                onChange={handleUpdate}
            /> */}
            {Editor.map((Component, index) => {
                return (
                    <div>
                        {<Component config={config} onBlur={handleUpdate} />}
                        <button onClick={(e) => addSkillsContent(e, index)}>
                            Save
                        </button>
                    </div>
                );
            })}

            <button onClick={addAnotherSkillsContent}>
                Add Skills Content
            </button>

            {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
        </div>
    );
};
export default RichtextEditor;
