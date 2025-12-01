import { useState } from "react";
import DescriptionBox from "./DescriptionBox/DescriptionBox";
import Scrolling from "../api/voiceControl/scrolling";



const VoiceControlInstruction = (
  {
    scrollToInstructions, 
    scrollToReviews, 
    scrollToIngredients,
    scrollToAppendices,
    handleAddServing,
    handleRemoveServing,
    handleSpeakIngredients,
    handleSpeakInstruction,
    handleSpeakAppendices,
 
  }) => {
  const [showChatBot, setShowInstruction] = useState(false);
  const [voiceControl, setVoiceControl] = useState(false);
  const [voiceControlIndicator, setVoiceControlIndicator] = useState(false);
  

  const description = `Chế độ Điều khiển bằng giọng nói cho phép bạn thao tác trang mà không cần chạm tay.
  Khi bật lên, hệ thống sẽ lắng nghe giọng nói của bạn và thực hiện các thao tác tương ứng.
  Lưu ý: bạn cần nói đúng theo các câu lệnh được liệt kê bên dưới để hệ thống nhận diện và phản hồi chính xác.`;
  const descriptionHelpLink = `/Info`;
  const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;


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
              <h2 className="instruction__logo-text">Điều khiển giọng nói</h2>
              <i className={`fa-solid ${voiceControl ? "fa-toggle-on" : "fa-toggle-off"}`}></i>
            </button>
            <DescriptionBox description = {description} link = {descriptionHelpLink}/>
          </div>
        </div>  
      </div>

      <div className="instruction__body">
        <h5 className="ms-2">Các câu lệnh điều khiển</h5>
        <div className="instruction">
          <p  onClick={()=>window.scrollTo(0, 0)}>Lên đầu trang: "đầu"</p>
          <p  onClick={()=>window.scrollTo(0, maxScroll)}>Xuống cuối trang: "cuối"</p>
          <p  onClick={()=>window.scrollBy(0, 150)}>Cuộn lên xuống: "lên", "xuống"</p>
          <p  onClick={()=>window.scrollBy(0, document.body.scrollHeight / 2)}>Cuộn xuống giữa trang: "nửa"</p>
          <p  onClick={()=>scrollToIngredients()}>Đi đến phần nguyên liệu: "nguyên liệu"</p>
          <p  onClick={()=>scrollToInstructions()}>Đi đến phần bước làm: "bước làm", "hướng dẫn"</p>
          <p  onClick={()=>scrollToAppendices()}>Đi đến phần phụ lục: "phụ lục"</p>
          <p  onClick={()=>scrollToReviews()}>Đi đến phần đánh giá: "đánh giá"</p>
          <p  onClick={()=>handleSpeakIngredients()}>Đọc phần nguyên liệu: "đọc nguyên liệu"</p>
          <p  onClick={()=>handleSpeakInstruction()}>Đọc phần bước làm: "đọc bước làm"</p>
          <p  onClick={()=>handleSpeakAppendices()}>Đọc phần phụ lục: "đọc phụ lục"</p>
          <p  onClick={()=>handleAddServing()}>Tăng giảm suất ăn: "tăng", "giảm"</p>
        </div>
      </div>

    </div>
  </div>


  )
}

export default VoiceControlInstruction



