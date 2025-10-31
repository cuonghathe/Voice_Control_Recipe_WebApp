import {useState, useRef } from "react";


const VoiceControlInstruction = () => {
  const helpRef = useRef(null);
  const [showChatBot, setShowChatbot] = useState(false);
  
  return (
    
    <div className={`chat__container ${showChatBot ? "instruction__open" : ""}`}>
    <button onClick={() => setShowChatbot((prev) => !prev)} id="instruction__toggler">
    </button>
    <div className="instruction__popup">
      <div className="instruction__header">
        <div className="instruction__header__info">
          <h2 className="instruction__logo-text">Các lệnh điều khiển giọng nói</h2>
        </div>
      </div>

      <div className="instruction__body">
      <p className="instruction">Lên đầu trang: "đầu"</p>
      <p className="instruction">Xuống cuối trang: "cuối"</p>
      <p className="instruction">Cuộn lên xuống: "lên", "xuống"</p>
      <p className="instruction">Cuộn xuống giữa trang: "nửa"</p>
      <p className="instruction">Đi đến phần nguyên liệu: "1"</p>
      <p className="instruction">Đi đến phần hướng dẫn: "2"</p>
      <p className="instruction">Đi đến phần đánh giá: "3"</p>
      <p className="instruction">Tăng giảm suất ăn: "tăng", "giảm"</p>
      </div>

    </div>
  </div>


  )
}

export default VoiceControlInstruction



