import { useEffect, useState } from "react";
import { stopTTS } from "./TTS";

const Scrolling = ({ 
  scrollToInstructions, 
  scrollToReviews, 
  scrollToIngredients,
  handleAddServing,
  handleRemoveServing,
  handleSpeakIngredients,
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

    const start = () => {
      try {
        isRecognitionStarted = true;
        recognition.start();
      } catch (error) {
        console.error("Lỗi khi khởi động SpeechRecognition:", error);
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

    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      console.log(".");
    };

    let isRecognitionStarted = false;

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
      const command = event.results[event.results.length - 1][0].transcript.trim();
      userCommand(command);
      const currentTime = Date.now();

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

          "hai": scrollToInstructions,
          "4": scrollToInstructions,
          "hài": scrollToInstructions,

          "ba": scrollToReviews,
          "3": scrollToReviews,

          "một": scrollToIngredients,
          "1": scrollToIngredients,

          "tăng": handleAddServing,
          "giảm": handleRemoveServing,

          "đọc": handleSpeakIngredients,
          "dừng": stopTTS,
          "rừng": stopTTS,
        };

        if (commandMap[command]) {
          commandMap[command]();
          setLastExecuted(currentTime);
        }
      }
    };



    window.startRecognition = start;
    window.stopRecognition = stop;

  }, [
    scrollToInstructions, 
    scrollToReviews, 
    scrollToIngredients,
    handleAddServing,
    handleRemoveServing,
    handleSpeakIngredients,
    userCommand 
  ]);

  return null;
};

export default Scrolling;
