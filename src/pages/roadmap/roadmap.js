import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./roadmap.css";
import Header from "../../components/header/header";
import Loader from "../../components/loader/loader";
import Modal from "../../components/modal/modal";
import {
  CirclePlus,
  ChevronDown,
  ChevronRight,
  LoaderPinwheel,
  FolderSearch,
  Bot,
} from "lucide-react";
import { translateLocalStorage, translateObj } from "../../translate/translate";
import Markdown from "react-markdown";
import ConfettiExplosion from "react-confetti-explosion";

const RoadmapPage = (props) => {
  const [resources, setResources] = useState(null);
  const [resourceParam, setResourceParam] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [roadmap, setRoadmap] = useState({});
  const [topicDetails, setTopicDetails] = useState({
    time: "-",
    knowledge_level: "-",
  });
  const [quizStats, setQuizStats] = useState({});
  const [confettiExplode, setConfettiExplode] = useState(false);
  const navigate = useNavigate();
  const topic = searchParams.get("topic");
  if (!topic) {
    navigate("/");
  }
  useEffect(() => {
    const topics = JSON.parse(localStorage.getItem("topics")) || {};

    setTopicDetails(topics[topic]);

    const roadmaps = JSON.parse(localStorage.getItem("roadmaps")) || {};
    setRoadmap(roadmaps[topic]);
    // setLoading(true);
    // translateObj(roadmaps[topic], "hi").then((translatedObj) => {
    // setRoadmap(translatedObj);
    // setLoading(false);
    //   console.log(translatedObj);
    // });

    const stats = JSON.parse(localStorage.getItem("quizStats")) || {};
    setQuizStats(stats[topic] || {});

    if (
      !Object.keys(roadmaps).includes(topic) ||
      !Object.keys(topics).includes(topic)
    ) {
      //   alert(`Roadmap for ${topic} not found. Please generate it first.`);
      navigate("/");
    }
    console.log(roadmap);
    console.log(topicDetails);
  }, [topic]);

  const colors = [
    "#D14EC4",
    "#4ED1B1",
    "#D14E4E",
    "#4EAAD1",
    "#D1854E",
    "#904ED1",
    "#AFD14E",
  ];

  const Subtopic = ({ subtopic, number, style, weekNum, quizStats }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const topic = searchParams.get("topic");
    return (
      <div
        className="flexbox subtopic"
        style={{ ...style, justifyContent: "space-between" }}
      >
        <h1 className="number">{number}</h1>
        <div className="detail">
          <h3
            style={{
              fontWeight: "600",
              textTransform: "capitalize",
            }}
          >
            {subtopic.subtopic}
          </h3>
          <p className="time">
            {(
              parseFloat(subtopic.time.replace(/^\D+/g, "")) *
              (parseFloat(localStorage.getItem("hardnessIndex")) || 1)
            ).toFixed(1)}{" "}
            {subtopic.time.replace(/[0-9]/g, "")}
          </p>
          <p style={{ fontWeight: "300", opacity: "61%", marginTop: "1em" }}>
            {subtopic.description}
          </p>
        </div>
        <div
          className="hardness"
          onClick={() => {
            let hardness = prompt(
              "Rate Hardness on a rating of 1-10 (where 5 means perfect)"
            );
            if (hardness) {
              let hardnessIndex =
                parseFloat(localStorage.getItem("hardnessIndex")) || 1;
              hardnessIndex = hardnessIndex + (hardness - 5) / 10;
              localStorage.setItem("hardnessIndex", hardnessIndex);
              window.location.reload();
            }
          }}
        >
          Rate Hardness
        </div>

        <div className="flexbox buttons" style={{ flexDirection: "column" }}>
          <button
            className="resourcesButton"
            onClick={() => {
              setModalOpen(true);
              setResourceParam({
                subtopic: subtopic.subtopic,
                description: subtopic.description,
                time: subtopic.time,
                course: topic,
                knowledge_level: topicDetails.knowledge_level,
              });
            }}
          >
            Resources
          </button>
          {quizStats.timeTaken ? (
            <div className="quiz_completed">
              {((quizStats.numCorrect * 100) / quizStats.numQues).toFixed(1) +
                "% Correct in " +
                (quizStats.timeTaken / 1000).toFixed(0) +
                "s"}
            </div>
          ) : (
            <button
              className="quizButton"
              onClick={() => {
                navigate(
                  `/quiz?topic=${topic}&week=${weekNum}&subtopic=${number}`
                );
              }}
            >
              Start Quiz
            </button>
          )}
        </div>
      </div>
    );
  };

  const TopicBar = ({
    week,
    topic,
    color,
    subtopics,
    style,
    children,
    weekNum,
    quizStats,
  }) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={style}>
        <div className="topic-bar" style={{ "--clr": color }}>
          <div className="topic-bar-title">
            <h3
              className="week"
              style={{ fontWeight: "400", textTransform: "capitalize" }}
            >
              {week}
            </h3>
            <h2
              style={{
                fontWeight: "400",
                textTransform: "capitalize",
                color: "white",
              }}
            >
              {topic}
            </h2>
          </div>
          <button
            className="plus"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <ChevronRight
              size={50}
              strokeWidth={2}
              color={color}
            ></ChevronRight>
          </button>
          <div
            className="subtopics"
            style={{ display: open ? "block" : "none" }}
          >
            {subtopics?.map((subtopic, i) => (
              <Subtopic
                subtopic={subtopic}
                number={i + 1}
                weekNum={weekNum}
                quizStats={quizStats[i + 1] || {}}
              ></Subtopic>
            ))}
          </div>
        </div>

        {children}
      </div>
    );
  };
  const ResourcesSection = ({ children }) => {
    return (
      <div className="flexbox resources">
        <div className="generativeFill">
          <button
            className="primary"
            onClick={() => {
              setLoading(true);
              axios.defaults.baseURL = "http://localhost:5000";

              axios({
                method: "POST",
                url: "/api/generate-resource",
                data: resourceParam,
                withCredentials: false,
                headers: {
                  "Access-Control-Allow-Origin": "*",
                },
              })
                .then((res) => {
                  setLoading(false);
                  setResources(
                    <div className="res">
                      <h2 className="res-heading">{resourceParam.subtopic}</h2>
                      <Markdown>{res.data}</Markdown>
                    </div>
                  );
                  setTimeout(() => {
                    setConfettiExplode(true);
                    console.log("exploding confetti...");
                  }, 500);
                })
                .catch((err) => {
                  setLoading(false);
                  alert("error generating resources");
                  navigate("/roadmap?topic=" + encodeURI(topic));
                });
            }}
          >
            <Bot size={70} strokeWidth={1} className="icon"></Bot> AI Generated
            Resources
          </button>
        </div>
        {/* OR */}
        <div className="databaseFill">
          <button className="primary" id="searchWidgetTrigger">
            <FolderSearch
              size={70}
              strokeWidth={1}
              className="icon"
            ></FolderSearch>
            Browse Online Courses
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="roadmap_wrapper">
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setResources(null);
        }}
      >
        {!resources ? (
          <ResourcesSection></ResourcesSection>
        ) : (
          <>
            {confettiExplode && (
              <ConfettiExplosion zIndex={10000} style={{ margin: "auto" }} />
            )}

            {resources}
          </>
        )}
      </Modal>
      <Header></Header>

      <Loader style={{ display: loading ? "block" : "none" }}>
        Generating Resource...
      </Loader>
      <div className="content">
        <div className="flexbox topic">
          <h1 style={{ display: "inline-block", marginRight: "2ch" }}>
            {topic}
          </h1>
          <h2 style={{ display: "inline-block", color: "#B6B6B6" }}>
            {topicDetails.time}
          </h2>
        </div>
        <div className="roadmap">
          {Object.keys(roadmap)
            .sort(
              (a, b) => parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1])
            )
            .map((week, i) => {
              return (
                <TopicBar
                  weekNum={i + 1}
                  week={week}
                  topic={roadmap[week].topic}
                  subtopics={roadmap[week].subtopics}
                  color={colors[i % colors.length]}
                  quizStats={quizStats[i + 1] || {}}
                ></TopicBar>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
