import { useEffect, useRef, useState } from "react";
import TTS, { stopTTS } from "../../api/voiceControl/TTS.js";
import "./chat.scss";
import ChatBotForm from "./ChatBotForm.js";
import ChatBotIcon from "./ChatBotIcon";
import ChatMessage from "./ChatMessage";
import formatData from "./formatData.js";



const ChatBotBox = ({ command, recipeInfo }) => {
  const [showChatBot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();
  const [vocalCommunication, setVocalCommunication] = useState(false);

  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: formatData(recipeInfo),
    },
  ]);

  useEffect(() => {
    if (recipeInfo) {
        setChatHistory(prev => {
            const newHistory = [...prev]; 
            newHistory[0] = {
                ...newHistory[0],               
                text: JSON.stringify(recipeInfo)
            };
            return newHistory;
        });
    }
  }, [recipeInfo]);

  

  const generateBotResponse = async (history) => {
    const upadatedHistory = (text) => {
      setChatHistory((prev) => [
        ...prev.filter((message) => message.text !== "..."),
        { role: "model", text },
      ]);
    };
    history = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const requestOptions = {
      method: "POST",
      headers: {
        "x-goog-api-key": process.env.REACT_APP_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(process.env.REACT_APP_API_URL, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Something went wrong!");
      }

      const formatBotResponse = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "s1")
        .trim();
      upadatedHistory(formatBotResponse);
      if (vocalCommunication) {
        TTS(formatBotResponse);
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Thêm command vào chatHistory và gọi generateBotResponse khi command thay đổi
  useEffect(() => {
    if (command) {
      const newHistory = [...chatHistory, { role: "user", text: command }];
      setChatHistory(newHistory);
      generateBotResponse(newHistory);
    }
  }, [command]); // Lắng nghe sự thay đổi của command

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  const toggleVocalCommunication = () => {
    if(!vocalCommunication){
      setVocalCommunication(true);
      stopTTS();
      window.stopRecognition();
      setTimeout(() => {
        window.startRecognitionWithInterimOff();
      }, 3000);
    } else {
      setVocalCommunication(false);
      stopTTS();
      window.stopRecognition();
    }
  }

  return (
    <div className={`chat__container ${showChatBot ? "chat__open" : ""}`}>
      <button onClick={() => setShowChatbot((prev) => !prev)} id="chat__toggler">
        <ChatBotIcon />
      </button>
      <div className="chat__popup">
        <div className="chat__header">
          <div className="chat__header__info">
            <ChatBotIcon />
            <h2 className="chat__logo-text">CookBot</h2>
          </div>
          <div className="tts-controls">
            <button className={`AutoTTS ${vocalCommunication ? "on" : ""}`} onClick={() => toggleVocalCommunication()}>
              <span className="ms-2">Đối thoại</span>
              <i className={`fa-solid ${vocalCommunication ? "fa-toggle-on" : "fa-toggle-off"}`}></i>
            </button>

          </div>
        </div>

        <div ref={chatBodyRef} className="chat__body">
          <div className="chat__bot__message">
            <ChatBotIcon />
            <p className="chat__message__text">Xin chào, tôi có thể giúp gì bạn?</p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat}></ChatMessage>
          ))}
        </div>

        <div className="chat__footer">
          <ChatBotForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />

        </div>
      </div>
    </div>
  );
};

export default ChatBotBox;