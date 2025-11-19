import { useState } from "react";
import DescriptionBox from "./DescriptionBox/DescriptionBox";


const VoiceControlInstruction = () => {
  const [showChatBot, setShowInstruction] = useState(false);
  const [voiceControl, setVoiceControl] = useState(false);
  const [voiceControlIndicator, setVoiceControlIndicator] = useState(false);
  

  const description = `Chế độ Điều khiển bằng giọng nói cho phép bạn thao tác trang mà không cần chạm tay.
  Khi bật lên, hệ thống sẽ lắng nghe giọng nói của bạn và thực hiện các thao tác tương ứng.
  Lưu ý: bạn cần nói đúng theo các câu lệnh được liệt kê bên dưới để hệ thống nhận diện và phản hồi chính xác.`;
  const descriptionHelpLink = `/Info`;


  const toggleVoiceControl = () => {
    if(!voiceControl){
      setVoiceControl(true);
      window.stopRecognition();
      setTimeout(() => {
        window.startRecognitionWithInterimOn()
        setVoiceControlIndicator(true);
      }, 1500);
    } else {
      setVoiceControl(false);
      setTimeout(() => {
        setVoiceControlIndicator(false);
      }, 1500);
      window.stopRecognition();
    }
  }

  return (
    
    <div className={`chat__container ${showChatBot ? "instruction__open" : ""}`}>
    <button onClick={() => setShowInstruction((prev) => !prev)} id="instruction__toggler" className={`instruction__toggler ${voiceControlIndicator ? "on" : ""}`}>
      <i className="fa-solid fa-microphone"></i>
    </button>
    <div className="instruction__popup">
      <div className={`instruction__header ${voiceControlIndicator ? "on" : "" }`}>
        <div className="instruction__header__info">
          <div className="v-controls">
            <button className={`AutoTTS ${voiceControl ? "on" : ""}`} onClick={() => toggleVoiceControl()}>
              <h2 className="instruction__logo-text">Điều khiển bằng giọng nói</h2>
              <i className={`fa-solid ${voiceControl ? "fa-toggle-on" : "fa-toggle-off"}`}></i>
            </button>
            <DescriptionBox description = {description} link = {descriptionHelpLink}/>
          </div>
        </div>  
      </div>

      <div className="instruction__body">
        <h5 className="ms-2">Các câu lệnh điều khiển</h5>
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



