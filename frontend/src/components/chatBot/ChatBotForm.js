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
      query in VietNammese, only response with the info when asked else DONT, response in a human readable format. Exclude all IDs and metadata like _id, 
      userId, createdAt, updatedAt, recipeImg, and any other MongoDB-specific fields and the JSON syntax. give short and to the point
      response, dont use symbol (like s1, s2,... or anything execpt line break) to separate different parts of the information: ${userMessage}`}]);
    },600);
  
  }


  return (
  <form action="#" className="chat__form" onSubmit={handleFormSummit}>
    <input ref={inputRef} type="text" placeholder="Message..." className="chat__message__input" required></input>
    <button></button>
  </form>
  )
}

export default ChatBotForm
