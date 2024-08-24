import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./topic.css";
import Header from "../../components/header/header";
import { ArrowRight, LibraryBig, Search } from "lucide-react";
import Loader from "../../components/loader/loader";

const TopicPage = (props) => {
  const suggestionList = [
    "Competitive Programming",
    "Machine Learning",
    "Quantitative Finance",
    "Web Development",
    "Quantum Technology",
  ];
  const colors = [
    "#D14EC4",
    "#AFD14E",
    "#4ED1B1",
    "#D14E4E",
    "#D1854E",
    "#904ED1",
    "#4EAAD1",
  ];
  const [topic, setTopic] = useState("");
  const [timeInput, setTimeInput] = useState(4);
  const [timeUnit, setTimeUnit] = useState("Weeks");
  const [time, setTime] = useState("4 Weeks");
  const [knowledgeLevel, setKnowledgeLevel] = useState("Absolute Beginner");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (topic) {
      console.log("Topic: ", topic);
    }
  }, [topic]);

  useEffect(() => {
    setTime(timeInput + " " + timeUnit);
  }, [timeInput, timeUnit]);

  const Suggestions = ({ list }) => {
    return (
      <div className="flexbox suggestions">
        {list.map((item, i) => (
          <button>
            <div
              className="suggestionPill"
              onClick={() => {
                setTopic(item);
              }}
              style={{ "--clr": colors[i % colors.length] }}
            >
              {item} <ArrowRight className="arrow" size={30} strokeWidth={1} />
            </div>
          </button>
        ))}
      </div>
    );
  };

  const TopicInput = () => {
    const [inputVal, setInputVal] = useState("");
    const searchIcon = <Search size={65} color={"white"} strokeWidth={2} />;
    const arrowIcon = <ArrowRight size={65} color={"white"} strokeWidth={2} />;
    const [icon, setIcon] = useState(searchIcon);

    return (
      <div className="inputContainer TopicInput">
        <LibraryBig
          className="icon"
          size={78}
          color={"#73737D"}
          strokeWidth={1}
        />
        <input
          type="text"
          placeholder="Enter A Topic"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
            if (e.target.value) {
              setIcon(arrowIcon);
            } else {
              setIcon(searchIcon);
            }
          }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            if (inputVal) {
              setTopic(inputVal);
            }
          }}
        >
          {icon}
        </button>
      </div>
    );
  };
  const SetTopic = () => {
    return (
      <div className="flexbox main setTopic">
        <h2>What do you want to learn?</h2>
        <TopicInput />
        <h3>Suggestions:</h3>
        <Suggestions list={suggestionList}></Suggestions>
      </div>
    );
  };

  const TimeInput = () => {
    return (
      <div className="flexbox TimeInput">
        <div className="inputContainer">
          <input
            id="timeInput"
            type="number"
            value={timeInput}
            onChange={(e) => {
              if (e.target.value > 100 || e.target.value < 0) {
                return;
              }
              setTimeInput(e.target.value);
            }}
          />
        </div>
        <div className="inputContainer">
          <select
            name="timeUnit"
            id="timeUnit"
            value={timeUnit}
            onChange={(e) => {
              setTimeUnit(e.target.value);
            }}
          >
            {/* <option value="Days" id="Days">
              Days
            </option>
            <option value="Hours" id="Hours">
              Hours
            </option> */}
            <option value="Weeks" id="Weeks">
              Weeks
            </option>
            <option value="Months" id="Months">
              Months
            </option>
          </select>
        </div>
      </div>
    );
  };
  const KnowledgeLevelInput = () => {
    return (
      <div className="inputContainer">
        <select
          name="knowledgeLevel"
          id="knowledgeLevel"
          style={{ width: "min-content", textAlign: "center" }}
          value={knowledgeLevel}
          onChange={(e) => {
            setKnowledgeLevel(e.target.value);
          }}
        >
          <option value="Absolute Beginner">Absolute Beginner</option>
          <option value="Beginner">Beginner</option>
          <option value="Moderate">Moderate</option>
          <option value="Expert">Expert</option>
        </select>
      </div>
    );
  };
  const SubmitButton = ({ children }) => {
    const navigate = useNavigate();
    return (
      <button
        className="SubmitButton"
        onClick={() => {
          if (time === "0 Weeks" || time === "0 Months") {
            alert("Please enter a valid time period");
            return;
          }
          setLoading(true);
          // check if topic is already present on localstorage
          let topics = JSON.parse(localStorage.getItem("topics")) || {};
          if (!Object.keys(topics).includes(topic)) {
            let data = { topic, time, knowledge_level: knowledgeLevel };
            console.log(data);
            axios.defaults.baseURL = "http://localhost:5000";
            axios({
              method: "POST",
              url: "/api/roadmap",
              data: data,
              withCredentials: false,
              headers: {
                "Access-Control-Allow-Origin": "*",
              },
            })
              .then((res) => {
                topics[topic] = { time, knowledge_level: knowledgeLevel };
                localStorage.setItem("topics", JSON.stringify(topics));
                let roadmaps =
                  JSON.parse(localStorage.getItem("roadmaps")) || {};

                roadmaps[topic] = res.data;
                localStorage.setItem("roadmaps", JSON.stringify(roadmaps));
                navigate("/roadmap?topic=" + encodeURI(topic));
              })
              .catch((error) => {
                console.log(error);
                alert(
                  "An error occured while generating the roadmap. Please try again later."
                );
                navigate("/");
              });
          } else {
            navigate("/roadmap?topic=" + encodeURI(topic));
          }
        }}
      >
        {children}
      </button>
    );
  };
  const SetDetails = () => {
    return (
      <div className="flexbox main setDetails">
        <h2>How much time do you have to learn it?</h2>
        <TimeInput />
        <h2 style={{ marginTop: "1.5em" }}>
          Your Knowledge Level on the Topic
        </h2>
        <KnowledgeLevelInput />
        <SubmitButton>Start Learning</SubmitButton>
      </div>
    );
  };

  return (
    <div className="wrapper">
      <Loader style={{ display: loading ? "block" : "none" }}>
        Generating Roadmap...
      </Loader>
      <Header></Header>
      {!topic ? <SetTopic /> : <SetDetails />}
    </div>
  );
};

export default TopicPage;
