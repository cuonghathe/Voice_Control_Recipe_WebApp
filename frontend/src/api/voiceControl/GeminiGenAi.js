
// const GeminiGenAi = () => {
  
//     const generateBotResponse = async (history) => {
//       const upadatedHistory = (text) => {
//         setChatHistory((prev) => [
//           ...prev.filter((message) => message.text !== "Thinking..."),
//           { role: "model", text },
//         ]);
//       };
//       history = history.map(({ role, text }) => ({
//         role,
//         parts: [{ text }],
//       }));
  
//       const requestOptions = {
//         method: "POST",
//         headers: {
//           "x-goog-api-key": process.env.REACT_APP_API_FILTERAIKEY,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ contents: history }),
//       };
  
//       try {
//         const response = await fetch(process.env.REACT_APP_API_FILTERAIKEY, requestOptions);
//         const data = await response.json();
  
//         if (!response.ok) {
//           throw new Error(data.error?.message || "Something went wrong!");
//         }
  
//         const formatBotResponse = data.candidates[0].content.parts[0].text
//           .replace(/\*\*(.*?)\*\*/g, "s1")
//           .trim();
//         upadatedHistory(formatBotResponse);
//       } catch (error) {
//         console.error("Error:", error);
//       }
//     };
  
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default GeminiGenAi
