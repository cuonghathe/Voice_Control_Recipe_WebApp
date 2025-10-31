import ChatBotIcon from "./ChatBotIcon.js";
import "./chat.scss";

const ChatMessage = ({chat}) => {
  return (
    !chat.hideInChat && (
    <div className={`chat__${chat.role === "model" ? "bot" : "user" }__message ${chat.isError ? "error" : ""}`}>
      {chat.role === "model" && <ChatBotIcon/>}
      <p className="chat__message__text">{chat.text}</p>
  </div>
    )
  );
}

export default ChatMessage
