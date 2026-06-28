import React, { useState, useEffect } from "react";
import "./style.css";
const CreateCourse = () => {
    const data = [
        {
            chapterName: "Algo",
            skils: [
                {
                    id: "1",
                    Name: "introduction to algo",
                    skilsContent: [
                        "text algo 1 ",
                        " text algo 1-2",
                        "text algo 1-3",
                    ],
                },
                {
                    id: "2",
                    Name: "introduction procedure",
                    skilsContent: [
                        "text algo 2-1 ",
                        " text algo 2-2",
                        "text algo 3-3",
                    ],
                },
            ],
        },
        {
            chapterName: "ES6",
            skils: [
                {
                    id: "3",
                    Name: "introduction to ES6",
                    skilsContent: [
                        "text Es6 1 ",
                        " text ES6 1-2",
                        "text ES6 1-3",
                    ],
                },
                {
                    id: "4",
                    Name: "introduction to react",
                    skilsContent: [
                        "text Es6 2 ",
                        " text ES6 2-2",
                        "text ES6 3-3",
                    ],
                },
                {
                    id: "5",
                    Name: "introduction to hooks",
                    skilsContent: [
                        "text Es6 2 ",
                        " text ES6 2-2",
                        "text ES6 3-3",
                    ],
                },
            ],
        },
    ];

    const [content, setContent] = useState({ skilsContent: [] });
    const [ChapterIndex, setChapterIndex] = useState(0);
    const [dataLength, setDataLength] = useState(data.length);
    const [skilsLength, setSkilsLength] = useState();
    const [skilsIndex, setSkilsIndex] = useState(0);
    const handleClick = (id) => {
        data.map((el) =>
            el.skils.find((item) => (item.id === id ? setContent(item) : null))
        );

        data.map((el, Findex) => {
            el.skils.find((item, Sindex) => {
                return item.id === id
                    ? (setSkilsIndex(Sindex),
                      setChapterIndex(Findex),
                      setSkilsLength(el.skils.length))
                    : null;
            });
        });
    };

    const nextChapter = () => {
        if (skilsIndex < skilsLength - 1) {
            setContent(data[ChapterIndex].skils[skilsIndex + 1]);
            setSkilsIndex(skilsIndex + 1);
        } else {
            setContent(data[ChapterIndex + 1].skils[0]);
            setSkilsLength(data[ChapterIndex + 1].skils.length);
            setSkilsIndex(0);
            setChapterIndex(ChapterIndex + 1);
        }
    };
    const prevChapter = () => {
        if (skilsIndex > 0) {
            setSkilsIndex(skilsIndex - 1);
            setContent(data[ChapterIndex].skils[skilsIndex - 1]);
        } else if (skilsIndex === 0 && ChapterIndex !== 0) {
            setChapterIndex(ChapterIndex - 1);
            setSkilsIndex(data[ChapterIndex - 1].skils.length - 1);
            setSkilsLength(data[ChapterIndex - 1].skils.length);
            setContent(
                data[ChapterIndex - 1].skils[
                    data[ChapterIndex - 1].skils.length - 1
                ]
            );
        } else if (skilsIndex === 0 && ChapterIndex === 0) {
            alert("you can't return more ...");
        }
    };
    useEffect(() => {
        document
            .querySelectorAll("#list li")
            .forEach((el) => el.classList.remove("active"));
        if (content.id) {
            document.getElementById(`${content.id}`).classList.add("active");
        }
    }, [content]);

    /* */
    const [track, setTrack] = useState([]);
    const [trackName, setTrackName] = useState([]);
    const [chapterName, setChapterName] = useState();
    const getTrackName = (e) => {
        setTrackName(e.target.value);
    };
    const handleTrackName = () => {
        setTrack([
            ...track,
            { id: Math.random(), trackName: trackName, Data: [] },
        ]);
    };
    const [skils, setSkils] = useState({ Name: "", skilsContent: [] });
    const handleChange = (e) => {
        if (e.target.name === "chapterName") {
            setChapterName(e.target.value);
        }
        if (e.target.name === "skils-name") {
            setSkils({ ...skils, id: Math.random(), Name: e.target.value });
        } else if (e.target.name === "skils-content") {
            setSkils({
                ...skils,
                skilsContent: [...skils.skilsContent, e.target.value],
            });
        }
    };
    const [addChapter, setAddChapter] = useState(false);
    const [chapterNameShow, setChapterNameShow] = useState(false);

    const [skilsShow, setSkilsShow] = useState(false);
    const [chapter, setChapter] = useState();
    const [chapterID, setChapterID] = useState();
    const [trackId, setTrackId] = useState();
    const showChapterName = (e) => {
        setChapterNameShow(true);
        setChapter(track.find((el) => el.id == e.target.value));
        setTrackId(e.target.value);
    };
    // console.log(track, chapter);
    const showSkils = () => {
        setSkilsShow(true);
    };
    const addSkilsContent = () => {
        let div = document.createElement("div");
        let input = document.createElement("input");
        input.addEventListener("change", (e) => {
            setSkils({
                ...skils,
                skilsContent: [...skils.skilsContent, e.target.value],
            });
        });
        input.name = "skils-content";
        input.onChange = "handleChange";
        let label = document.createElement("label");
        label.innerHTML = "SkilsContent";
        div.appendChild(label);
        div.appendChild(input);
        document.getElementById("skils-content").appendChild(div);
    };
    return (
        <div className="">
            <>
                <ul>
                    {data.map((el) => {
                        return (
                            <li>
                                {el.chapterName}
                                <ul id="list">
                                    {el.skils.map((el) => {
                                        return (
                                            <li id={el.id}>
                                                <a
                                                    onClick={() =>
                                                        handleClick(el.id)
                                                    }
                                                >
                                                    {el.Name}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        );
                    })}
                </ul>
            </>
            <>
                <button onClick={prevChapter} id="btn-prev">
                    Prev
                </button>
                <h1>{content.Name}</h1>
                {content.skilsContent.map((el) => {
                    return <p>{el}</p>;
                })}
            </>
            <button onClick={nextChapter}>Next</button>

            <h1>Add New Track</h1>
            <inp ut type="text" onChange={getTrackName} />
            <button onClick={handleTrackName}>Save</button>

            <h1>Add Chapters To Track</h1>
            <select onChange={showChapterName}>
                <option>Select Track</option>
                {track &&
                    track.map((el) => {
                        return <option value={el.id}>{el.trackName}</option>;
                    })}
            </select>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%",
                }}
            >
                {chapterNameShow ? (
                    addChapter ? (
                        <>
                            <label>C apter Name</label>

                            <input onChange={handleChange} name="chapterName" />
                            <button
                                onClick={() => {
                                    setTrack(
                                        track.map((el) =>
                                            el.id == trackId
                                                ? {
                                                      ...el,
                                                      Data: [
                                                          ...el.Data,
                                                          {
                                                              id: Math.random(),
                                                              chapterName,
                                                              skils: [],
                                                          },
                                                      ],
                                                  }
                                                : el
                                        )
                                    );
                                    setChapter(
                                        track.find((el) => el.id == trackId)
                                    );
                                    showSkils();
                                }}
                            >
                                Add Chapter
                            </button>
                            <select
                                onChange={(e) => {
                                    setChapterID(e.target.value);
                                }}
                            >
                                {chapter &&
                                    chapter.Data.map((el) => {
                                        return (
                                            <option value={el.id}>
                                                {el.chapterName}
                                            </option>
                                        );
                                    })}
                            </select>
                        </>
                    ) : (
                        <>
                            <select>
                                {chapter &&
                                    chapter.Data.map((el) => {
                                        return (
                                            <option>{el.chapterName}</option>
                                        );
                                    })}
                            </select>
                            <button onClick={() => setAddChapter(true)}>
                                add new Chapter To Track{" "}
                            </button>
                        </>
                    )
                ) : null}

                {skilsShow ? (
                    <>
                        <label>Skils Name</label>
                        <input onChange={handleChange} name="skils-name" />
                        <div id="skils-content">
                            <label>skilsContent</label>
                            <input
                                onChange={handleChange}
                                name="skils-content"
                            />
                        </div>

                        <button onClick={addSkilsContent}>
                            Add skilsContent
                        </button>

                        <button
                            onClick={() => {
                                setTrack(
                                    track.map((el) =>
                                        el.id == trackId
                                            ? {
                                                  ...el,
                                                  Data: el.Data.map((ele) =>
                                                      ele.id == chapterID
                                                          ? {
                                                                ...ele,
                                                                skils: [
                                                                    ...ele.skils,
                                                                    skils,
                                                                ],
                                                            }
                                                          : ele
                                                  ),
                                              }
                                            : el
                                    )
                                );
                            }}
                        >
                            Save
                        </button>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default CreateCourse;
