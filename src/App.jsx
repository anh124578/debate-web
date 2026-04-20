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

const semifinalQuestions = [
  "Hạnh phúc là kết quả của hoàn cảnh thay vì là cách con người nhìn nhận hoàn cảnh?",
  "Trong những quyết định quan trọng, con người nên nghe theo lý trí thay vì là cảm xúc?",
];

const finalQuestions = [
  {
    
    videoSrc: "/videos/ck1.mp4",
    caption:
      "Bi kịch sau tay lái: Lỗi lầm thuộc về 'Chiếc chìa khóa trao sai tay' của cha mẹ hay 'Tay lái bất chấp' của người trẻ?",
  },
  {
    videoSrc: "/videos/ck2.mp4",
    caption:
      "Giữa một bên là ý định cứu giúp và một bên là quyền bất khả xâm phạm về đời tư, hành động của Bình là tình thế cấp thiết hay là vượt qua lằn ranh pháp luật?",
  },
];

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function App() {
  const [view, setView] = useState("splash");
  const [menuRound, setMenuRound] = useState(null); // null | semifinal | final
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(0);

  const initialTotal = minutes * 60 + seconds;
  const [timeLeft, setTimeLeft] = useState(initialTotal);
  const [running, setRunning] = useState(false);

  const selectedLabel = useMemo(() => {
    if (!selectedQuestion) return "";

    return selectedQuestion.round === "semifinal"
      ? `Bán kết • Câu hỏi ${selectedQuestion.order}`
      : `Chung kết • Video ${selectedQuestion.order}`;
  }, [selectedQuestion]);

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
          if (menuRound) {
            setMenuRound(null);
          } else {
            setView("splash");
          }
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
  }, [view, menuRound]);

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
  function openSemifinalQuestion(question, order) {
    setSelectedQuestion({
      round: "semifinal",
      order,
      text: question,
      isVideo: false,
    });
    setView("arena");
    setRunning(false);
    setTimeLeft(minutes * 60 + seconds);
  }

  function openFinalQuestion(question, order) {
    setSelectedQuestion({
      round: "final",
      order,
      title: question.title,
      videoSrc: question.videoSrc,
      caption: question.caption,
      isVideo: true,
    });
    setView("arena");
    setRunning(false);
    setTimeLeft(minutes * 60 + seconds);
  }

  function renderMenuContent() {
    if (menuRound === null) {
      return (
        <div className="rounds-board single-level-board">
          <motion.button
            className="round-select-card semifinal-select"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            onClick={() => setMenuRound("semifinal")}
          >
            <div className="round-select-pill">Bán kết</div>
            <h3>Chủ đề tranh biện</h3>
            <p>Bấm để mở danh sách câu hỏi vòng bán kết</p>
          </motion.button>

          <motion.button
            className="round-select-card final-select"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 }}
            onClick={() => setMenuRound("final")}
          >
            <div className="round-select-pill final-select-pill">Chung kết</div>
            <h3>Câu hỏi video</h3>
            <p>Bấm để mở danh sách câu hỏi vòng chung kết</p>
          </motion.button>
        </div>
      );
    }

    if (menuRound === "semifinal") {
      return (
        <div className="round-detail-wrap">
          <div className="round-detail-head">
            <button className="sub-back-btn" onClick={() => setMenuRound(null)}>
              <ChevronLeft size={18} />
              Quay lại
            </button>
            <div className="round-pill">Bán kết</div>
            <h3>Chủ đề tranh biện</h3>
            <p></p>
          </div>

          <div className="round-question-list detail-list">
            {semifinalQuestions.map((question, index) => (
              <motion.button
                key={index}
                className="question-card semifinal-card hidden-question-card"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.06 }}
                onClick={() => openSemifinalQuestion(question, index + 1)}
              >
                <div className="question-index">{index + 1}</div>
                <div className="question-content">
                  <div className="question-tag">Bán kết</div>
                  <div className="question-title-only">Câu hỏi số {index + 1}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="round-detail-wrap">
        <div className="round-detail-head">
          <button className="sub-back-btn" onClick={() => setMenuRound(null)}>
            <ChevronLeft size={18} />
            Quay lại
          </button>
          <div className="round-pill final-pill">Chung kết</div>
          <h3>Câu hỏi video</h3>
          <p></p>
        </div>

        <div className="round-question-list detail-list final-list">
          {finalQuestions.map((question, index) => (
            <motion.button
              key={index}
              className="question-card final-card hidden-question-card"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => openFinalQuestion(question, index + 1)}
            >
              <div className="question-index final-index">{index + 1}</div>
              <div className="question-content">
                <div className="question-tag">Chung kết</div>
                <div className="question-title-only">Video số {index + 1}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
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
              <div className="badge-glow">VÒNG CHUNG KẾT</div>

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
                <div className="title-school">Cuộc thi phản biện</div>
                <h1 className="title-main">
                  <span className="title-word-1">Bản lĩnh </span>
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
              <h2>Chọn vòng thi đấu</h2>
              <p>
                {menuRound === null
                  ? "Vui lòng chọn Bán kết hoặc Chung kết"
                  : "Chọn câu hỏi trong vòng thi đã mở"}
              </p>
            </div>

            {renderMenuContent()}
          </motion.div>
        )}

        {view === "arena" && selectedQuestion && (
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
              <div
                className={`arena-badge ${
                  selectedQuestion.round === "final" ? "arena-badge-final" : ""
                }`}
              >
                {selectedLabel}
              </div>

              {selectedQuestion.isVideo ? (
                <>
                  <div className="final-video-wrap">
                    {selectedQuestion.title && (
                      <div className="final-video-title">
                        {selectedQuestion.title}
                      </div>
                    )}

                    <video controls className="final-video-player">
                      <source src={selectedQuestion.videoSrc} type="video/mp4" />
                      Trình duyệt không hỗ trợ video.
                    </video>
                  </div>

                  {selectedQuestion.caption && (
                    <p className="video-caption wide-caption">
                      {selectedQuestion.caption}
                    </p>
                  )}
                </>
              ) : (
                <h2 className="arena-question">{selectedQuestion.text}</h2>
              )}
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
                        <button className="mini-btn" onClick={() => changeMinutes(-1)}>
                          <Minus size={16} />
                        </button>
                        <div className="time-value">
                          {String(minutes).padStart(2, "0")}
                        </div>
                        <button className="mini-btn" onClick={() => changeMinutes(1)}>
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="time-adjust-box">
                      <div className="time-adjust-label">Giây</div>
                      <div className="time-adjust-controls">
                        <button className="mini-btn" onClick={() => changeSeconds(-5)}>
                          <Minus size={16} />
                        </button>
                        <div className="time-value">
                          {String(seconds).padStart(2, "0")}
                        </div>
                        <button className="mini-btn" onClick={() => changeSeconds(5)}>
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