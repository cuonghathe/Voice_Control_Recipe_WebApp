import { useEffect, useState } from "react";

const Scrolling = ({ 
  scrollToInstructions, 
  scrollToReviews, 
  scrollToIngredients,
  scrollToAppendices,
  handleAddServing,
  handleRemoveServing,
  handleSpeakIngredients,
  handleSpeakInstruction,
  handleSpeakAppendices,
  userCommand 
}) => {
  const [, setCommandLog] = useState([]);
  const [lastExecuted, setLastExecuted] = useState(0);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (!SpeechRecognition) {
      console.error("Trình duyệt không hỗ trợ SpeechRecognition");
      return;
    }

    let isRecognitionStarted = false;
    const recognition = new SpeechRecognition(); 
    recognition.lang = "vi-VN"; 
    recognition.continuous = true;
    recognition.interimResults = false;


    recognition.onend = () => {
      isRecognitionStarted = false;
    };

    const start = () => {
      try {
        if (!isRecognitionStarted) {
          recognition.start();
          isRecognitionStarted = true;
        }
      } catch (error) {
        console.error("Lỗi khi khởi động SpeechRecognition:", error);
      }
    };
    
    const startWithInteriAttribute = (attribute) => {
      try {
        recognition.interimResults = attribute;
        if (isRecognitionStarted) {
          recognition.stop();
          recognition.onend = () => {
            isRecognitionStarted = false;
            recognition.start();
            isRecognitionStarted = true;
          };
        } else {
          recognition.start();
          isRecognitionStarted = true;
        }
      } catch (error) {
        console.error("Lỗi khi khởi động SpeechRecognition với interimResults:", error);
      }
    };


    const stop = () => {
      try {
        isRecognitionStarted = false;
        recognition.abort();
      } catch (error) {
        console.error("Lỗi khi tắt SpeechRecognition:", error);
      }
    };


    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        setTimeout(() => {
          if (!isRecognitionStarted) {
            try {
              recognition.start();
            } catch (error) {}
          }
        }, 1000);
      }
    };

    recognition.onresult = (event) => {
      console.log(event.results)
      const command = event.results[event.results.length - 1][0].transcript.trim();
      const currentTime = Date.now();
      if(!recognition.interimResults){
        userCommand(command);
      }

      if (currentTime - lastExecuted > 2000) {
        setCommandLog((prevLog) => [...prevLog, command]);

        const commandMap = {
          "kéo lên": () => window.scrollBy(0, -150),
          "lên": () => window.scrollBy(0, -150),
          "cuộn lên": () => window.scrollBy(0, -150),

          "kéo xuống": () => window.scrollBy(0, 150),
          "xuống": () => window.scrollBy(0, 150),
          "cuộn xuống": () => window.scrollBy(0, 150),

          "xuống lửa": () => window.scrollBy(0, document.body.scrollHeight / 2),
          "lửa": () => window.scrollBy(0, document.body.scrollHeight / 2),

          "xuống cuối": () => window.scrollTo(0, maxScroll),
          "cuối": () => window.scrollTo(0, maxScroll),
          "cuối trang": () => window.scrollTo(0, maxScroll),
          
          "lên đầu": () => window.scrollTo(0, 0),
          "đầu": () => window.scrollTo(0, 0),
          "đầu trang": () => window.scrollTo(0, 0),

          "bước": scrollToInstructions,
          "bước làm": scrollToInstructions,
          "cách": scrollToInstructions,
          "cách làm": scrollToInstructions,
          "hướng": scrollToInstructions,
          "hướng dẫn": scrollToInstructions,

          "đánh": scrollToReviews,
          "đánh giá": scrollToReviews,

          "nguyên liệu": scrollToIngredients,
          "nguyên": scrollToIngredients,
          
          "phụ": scrollToAppendices,
          "phụ lục": scrollToAppendices,

          "tăng": handleAddServing,
          "giảm": handleRemoveServing,

          "đọc nguyên liệu": handleSpeakIngredients,
          "đọc nguyên": handleSpeakIngredients,
          
          "đọc bước": handleSpeakInstruction,
          "đọc bước làm": handleSpeakInstruction,

          "đọc phụ lục": handleSpeakAppendices,
          "đọc phụ": handleSpeakAppendices,

          
        };

        if (commandMap[command]) {
          commandMap[command]();
          setLastExecuted(currentTime); 
        }
      }
    };

    window.startRecognition = start;
    window.stopRecognition = stop;
    window.startRecognitionWithInterimOn = () => startWithInteriAttribute(true);
    window.startRecognitionWithInterimOff = () => startWithInteriAttribute(false);    


  }, [
    scrollToInstructions, 
    scrollToReviews, 
    scrollToIngredients,
    scrollToAppendices,
    handleAddServing,
    handleRemoveServing,
    handleSpeakIngredients,
    handleSpeakInstruction,
    handleSpeakAppendices,
    userCommand 
  ]);

  return null;
};

export default Scrolling;
