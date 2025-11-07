import { useRef } from "react";
import "./chat.scss";


const ChatBotForm = ({setChatHistory, chatHistory, generateBotResponse}) => {

  const inputRef = useRef();

  const handleFormSummit = (e) =>{
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if(!userMessage) return;
    inputRef.current.value = "";
    setChatHistory((history) => [...history, {role: "user", text: userMessage}]);

    setTimeout(()=> {
      setChatHistory((history) => [...history, {role: "model", text: "..."}]);
      generateBotResponse([...chatHistory, {role: "user", text: `Use the info provided above, please address this
      query in VietNammese, only response with the info when asked else DONT. Exclude all IDs and metadata like _id, 
      userId, createdAt, updatedAt, recipeImg, and any other MongoDB-specific fields and the JSON syntax. give short and to the point
      response: ${userMessage}`}]);
    },600);
  
  }


  return (
  <form action="#" className="chat__form" onSubmit={handleFormSummit}>
    <input ref={inputRef} type="text" placeholder="Hỏi CookBot..." className="chat__message__input" required></input>
    <button>
      <i className="fa-solid fa-arrow-up"></i>
    </button>
  </form>
  )
}

export default ChatBotForm
