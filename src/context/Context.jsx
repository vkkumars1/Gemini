import { createContext, useState } from "react";
import run from "../config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState("");


    const newChat = ()=>{
             
        setShowResult(false);
        setLoading(false);
        

    }
    const onSent = async (prompt) => {
        setInput("");
        setData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if (prompt !== undefined) {
            response = await run(prompt);
            setRecentPrompt(prompt);
        } else {
            setRecentPrompt(input);
            setPrevPrompts(prev => [...prev, input]);
            response = await run(input);
        }

        if (response) {
            setData(processResponse(response)); // Process response before setting data
        } else {
            setData("Error: Received no response.");
        }
        setLoading(false);
        setInput("");
    };

    // Function to process the response data
    const processResponse = (response) => {
        // Replace "**" with bold tags
        let processedData = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Replace "*" with line break tags
        processedData = processedData.replace(/\*(.*?)\*/g, '<br>$1<br>');

        // Remove any remaining "*"
        processedData = processedData.replace(/\*/g, '');

        return processedData;
    };

    const contextValue = {
        onSent,
        prevPrompts,
        setPrevPrompts,
        setRecentPrompt,
        recentPrompt,
        loading,
        showResult,
        data,
        input,
        setInput,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
