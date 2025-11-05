import { useState } from "react";


const VoiceControlInstruction = () => {
  const [showChatBot, setShowInstruction] = useState(false);
  
  return (
    
    <div className={`chat__container ${showChatBot ? "instruction__open" : ""}`}>
    <button onClick={() => setShowInstruction((prev) => !prev)} id="instruction__toggler">
      <i className="fa-solid fa-microphone"></i>
    </button>
    <div className="instruction__popup">
      <div className="instruction__header">
        <div className="instruction__header__info">
          <h2 className="instruction__logo-text">Các lệnh điều khiển giọng nói</h2>
        </div>
      </div>

      <div className="instruction__body">
        <button onClick={() => window.startRecognition()}>DÙNG MIC</button>
        <button onClick={() => window.stopRecognition()}>DỪNG MIC</button>
        <div className="instruction">
          <p>Lên đầu trang: "đầu"</p>
          <p>Xuống cuối trang: "cuối"</p>
          <p>Cuộn lên xuống: "lên", "xuống"</p>
          <p>Cuộn xuống giữa trang: "nửa"</p>
          <p>Đi đến phần nguyên liệu: "1"</p>
          <p>Đi đến phần hướng dẫn: "2"</p>
          <p>Đi đến phần đánh giá: "3"</p>
          <p>Tăng giảm suất ăn: "tăng", "giảm"</p>
        </div>
      </div>

    </div>
  </div>


  )
}

export default VoiceControlInstruction



