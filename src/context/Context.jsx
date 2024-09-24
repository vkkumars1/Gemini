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

    const newChat = () => {
        setShowResult(false);
        setLoading(false);
    };

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
            setPrevPrompts(prev => [...prev, { prompt: input, response: '' }]);
            response = await run(input);
        }

        if (response) {
            setData(processResponse(response));
            setPrevPrompts(prev => prev.map((item, index) => {
                if (index === prev.length - 1) {
                    return { ...item, response };
                }
                return item;
            }));
        } else {
            setData("Error: Received no response.");
        }
        setLoading(false);
        setInput("");
    };

    const processResponse = (response) => {
        let processedData = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        processedData = processedData.replace(/\*(.*?)\*/g, '<br>$1<br>');
        processedData = processedData.replace(/\*/g, '');
        return processedData;
    };

    const referencePreviousData = (input) => {
        let combinedHistory = prevPrompts.map(item => `${item.prompt}: ${item.response}`).join(' ');
        return run(`${input}. Previous context: ${combinedHistory}`);
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
        newChat,
        referencePreviousData
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
