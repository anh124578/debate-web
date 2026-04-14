import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Timer,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const motions = [
  "Học sinh dưới 15 tuổi không nên dùng ChatGPT.",
  "Gen Z chọn nghề theo đam mê quan trọng hơn là theo xu hướng.",
  "“Flexing” là động lực phát triển hơn là áp lực độc hại.",
  "Gen Z là thế hệ dễ gặp các vấn đề về sức khỏe tinh thần hơn các thế hệ trước.",
  "Thành công phụ thuộc vào nỗ lực cá nhân hơn là hoàn cảnh xuất thân.",
  "Việc học nhóm hiệu quả hơn là học một mình.",
  "Công nghệ đang làm cho con người trở nên ít gắn kết với nhau.",
  "Mạng xã hội gây ra nhiều tổn hại hơn là lợi ích cho giới trẻ hiện nay.",
  "Bạn bè ảnh hưởng đến học sinh nhiều hơn là gia đình.",
  "Có quá nhiều sự lựa chọn trong cuộc sống hiện đại thực chất là một sự giam cầm về tinh thần hơn là tự do.",
];

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function App() {
  const [view, setView] = useState("splash");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(0);

  const initialTotal = minutes * 60 + seconds;
  const [timeLeft, setTimeLeft] = useState(initialTotal);
  const [running, setRunning] = useState(false);

  const selectedQuestion = useMemo(() => {
    if (selectedIndex === null) return null;
    return motions[selectedIndex];
  }, [selectedIndex]);

  useEffect(() => {
    if (!running || timeLeft <= 0) return;

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [running, timeLeft]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        if (view === "arena") {
          setView("menu");
          setRunning(false);
        } else if (view === "menu") {
          setView("splash");
        }
      }

      if (e.code === "Space") {
        e.preventDefault();
        if (view === "splash") {
          setView("menu");
        } else if (view === "arena") {
          setRunning((prev) => !prev);
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view]);

  function syncTimer(nextMinutes, nextSeconds) {
    const total = nextMinutes * 60 + nextSeconds;
    setMinutes(nextMinutes);
    setSeconds(nextSeconds);
    setTimeLeft(total);
    setRunning(false);
  }

  function changeMinutes(delta) {
    const next = Math.max(0, Math.min(59, minutes + delta));
    syncTimer(next, seconds);
  }

  function changeSeconds(delta) {
    let total = minutes * 60 + seconds + delta;
    total = Math.max(0, Math.min(59 * 60 + 59, total));
    const nextMinutes = Math.floor(total / 60);
    const nextSeconds = total % 60;
    syncTimer(nextMinutes, nextSeconds);
  }

  function resetTimer() {
    setTimeLeft(minutes * 60 + seconds);
    setRunning(false);
  }

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {view === "splash" && (
          <motion.div
            key="splash"
            className="view-fullscreen flex-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.45 }}
            onClick={() => setView("menu")}
          >
            <div className="splash-content">
              <div className="badge-glow">Cuộc thi phản biện</div>
              <div className="logo-light-system">
                <div className="logo-ring">
                  <div className="logo-outer-glow"></div>
                  <div className="logo-core">
                    <div className="logo-core-bg"></div>
                    <span className="logo-text-bright">NC1</span>
                    <span className="logo-text-shadow">NC1</span>
                  </div>
                </div>
              </div>

              <div className="title-block">
                <div className="title-school">Trường THPT Nông Cống 1</div>
                <h1 className="title-main">
                  <span className="title-word-1">Bản lĩnh</span>
                  <span className="title-word-2">Teen</span>
                </h1>
                <p className="subtitle-main">Sân chơi tranh biện dành cho học sinh</p>
              </div>

              
            </div>
          </motion.div>
        )}

        {view === "menu" && (
          <motion.div
            key="menu"
            className="view-fullscreen menu-layout"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35 }}
          >
            <div className="menu-header">
              <h2>Chọn câu hỏi thi đấu</h2>
              <p>Ban giám khảo vui lòng chọn một chủ đề cho đội thi</p>
            </div>

            <div className="grid-cards">
              {motions.map((question, index) => (
                <motion.button
                  key={index}
                  className="card-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => {
                    setSelectedIndex(index);
                    setView("arena");
                    setRunning(false);
                    setTimeLeft(minutes * 60 + seconds);
                  }}
                >
                  <div className="card-number">{index + 1}</div>
                  <div className="card-label">Chủ đề</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {view === "arena" && (
          <motion.div
            key="arena"
            className="view-fullscreen arena-layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button
              className="back-btn"
              onClick={() => {
                setView("menu");
                setRunning(false);
              }}
            >
              <ChevronLeft size={22} />
              Trở về Menu
            </button>

            <div className="arena-top">
              <div className="arena-badge">Chủ đề số {selectedIndex + 1}</div>
              <h2 className="arena-question">{selectedQuestion}</h2>
            </div>

            <div className="arena-center">
              <div className={`massive-timer ${timeLeft <= 10 ? "pulse-danger" : ""}`}>
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="arena-bottom">
              <div className="control-deck">
                <div className="time-editor">
                  <div className="time-editor-title">
                    <Timer size={18} />
                    <span>Thiết lập thời gian</span>
                  </div>

                  <div className="time-adjust-wrap">
                    <div className="time-adjust-box">
                      <div className="time-adjust-label">Phút</div>
                      <div className="time-adjust-controls">
                        <button
                          className="mini-btn"
                          onClick={() => changeMinutes(-1)}
                        >
                          <Minus size={16} />
                        </button>
                        <div className="time-value">{String(minutes).padStart(2, "0")}</div>
                        <button
                          className="mini-btn"
                          onClick={() => changeMinutes(1)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    

                    <div className="time-adjust-box">
                      <div className="time-adjust-label">Giây</div>
                      <div className="time-adjust-controls">
                        <button
                          className="mini-btn"
                          onClick={() => changeSeconds(-5)}
                        >
                          <Minus size={16} />
                        </button>
                        <div className="time-value">{String(seconds).padStart(2, "0")}</div>
                        <button
                          className="mini-btn"
                          onClick={() => changeSeconds(5)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="main-controls">
                  <button className="btn-action btn-reset" onClick={resetTimer}>
                    <RotateCcw size={22} />
                  </button>

                  <button
                    className={`btn-action btn-play ${running ? "paused" : ""}`}
                    onClick={() => setRunning((prev) => !prev)}
                  >
                    {running ? <Pause size={30} /> : <Play size={30} className="ml-1" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}