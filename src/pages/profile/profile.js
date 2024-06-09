import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import "./profile.css";
import Header from "../../components/header/header";
import Loader from "../../components/loader/loader";
import { ArrowRight, Plus } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

const getStats = (roadmaps, quizStats) => {
  const stats = {};
  stats.progress = {};
  for (let topic in quizStats) {
    let numWeightage = 0;
    let completedWeightage = 0;
    Object.keys(roadmaps[topic]).forEach((week, i) => {
      roadmaps[topic][week].subtopics.forEach((subtopic, j) => {
        numWeightage += parseInt(subtopic.time.replace(/^\D+/g, ""));
        if (
          quizStats[topic] &&
          quizStats[topic][i + 1] &&
          quizStats[topic][i + 1][j + 1]
        ) {
          completedWeightage += parseInt(subtopic.time.replace(/^\D+/g, ""));
        }
      });
    });
    stats.progress[topic] = {
      total: numWeightage,
      completed: completedWeightage,
    };
  }
  console.log(stats);
  return stats;
};
const TopicButton = ({ children }) => {
  const navigate = useNavigate();
  return (
    <button
      className="SubmitButton"
      onClick={() => {
        navigate("/topic");
      }}
    >
      {children}
    </button>
  );
};
const ProfilePage = (props) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  const topics = JSON.parse(localStorage.getItem("topics")) || {};
  const colors = [
    "#D14EC4",
    "#AFD14E",
    "#4ED1B1",
    "#D14E4E",
    "#D1854E",
    "#904ED1",
    "#4EAAD1",
  ];
  const [stats, setStats] = useState({});
  const [percentCompletedData, setPercentCompletedData] = useState({});

  useEffect(() => {
    const roadmaps = JSON.parse(localStorage.getItem("roadmaps")) || {};
    const quizStats = JSON.parse(localStorage.getItem("quizStats")) || {};
    setStats(getStats(roadmaps, quizStats));
  }, []);
  useEffect(() => {
    let progress = stats.progress || {};
    let labels = Object.keys(progress);
    let data = Object.values(progress).map(
      (topicProgress) => (topicProgress.completed * 100) / topicProgress.total
    );
    let backgroundColors = Object.values(progress).map(
      (topicProgress, index) => colors[index % colors.length]
    );
    setPercentCompletedData({
      labels: labels,
      datasets: [
        {
          label: "% Completed",
          data: data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    });
  }, [stats]);
  return (
    <div className="profile_wrapper">
      <Header></Header>
      <div className="flexbox content">
        <div className="flexbox info">
          <img src="/avatar.jpg" alt="Avatar" className="avatar" />
          <div className="flexbox text">
            <h1>Hemant Kumar</h1>
            <h3>
              Ongoing Courses: <b>{Object.keys(topics).length}</b>
            </h3>
            <h3>
              Hardness Index:{" "}
              <b>
                {(
                  parseFloat(localStorage.getItem("hardnessIndex")) || 1
                ).toFixed(3)}
              </b>
            </h3>
          </div>
        </div>
        <div className="newTopic">
          <TopicButton>
            <h2>
              <Plus
                size={25}
                strokeWidth={2}
                style={{ marginRight: "1ch", scale: "1.2" }}
              ></Plus>
              Learn Something New
            </h2>
          </TopicButton>
        </div>

        <div className="courses">
          <h2 className="heading">Continue Learning</h2>
          <div className="flexbox">
            {Object.keys(topics).map((course, i) => {
              return (
                <NavLink
                  className="link"
                  to={"/roadmap?topic=" + encodeURI(course)}
                >
                  <div
                    className="card"
                    style={{ "--clr": colors[i % colors.length] }}
                  >
                    <div className="title">{course}</div>

                    <div className="time">{topics[course].time}</div>

                    <div className="knowledge_level">
                      {topics[course].knowledge_level}
                    </div>
                    {/* <div className="progressContainer flexbox">
                      <label htmlFor="progresspercent">32% Completed</label>
                      <progress
                        id="progresspercent"
                        value="32"
                        max="100"
                      ></progress>
                    </div> */}
                    <ArrowRight
                      size={50}
                      strokeWidth={2}
                      className="arrow"
                    ></ArrowRight>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
        <div className="progress">
          <h2 className="heading">Progress</h2>
          <div className="charts">
            {Object.keys(percentCompletedData).length ? (
              <div
                className="bar"
                style={{
                  maxWidth: "700px",
                  minHeight: "500px",
                  filter: "brightness(1.5)",
                  background: "black",
                  borderRadius: "30px",
                  padding: "20px",
                  margin: "auto",
                }}
              >
                <Bar
                  data={percentCompletedData}
                  options={{ maintainAspectRatio: false, indexAxis: "y" }}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
