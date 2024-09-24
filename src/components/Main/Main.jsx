import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import { UserButton, useUser } from '@clerk/clerk-react';
import './Main.css';

const Main = () => {
    const {
        newChat,
        onSent,
        recentPrompt,
        loading,
        showResult,
        data,
        input,
        setInput,
        prevPrompts,
        setRecentPrompt,
        referencePreviousData // Ensure this is imported from Context
    } = useContext(Context);
    
    const { user } = useUser();
    const [typedData, setTypedData] = useState("");
    const [isStopped, setIsStopped] = useState(false);

    useEffect(() => {
        if (!loading && showResult && !isStopped) {
            setTypedData("");
            animateTyping(data);
        }
    }, [data, loading, showResult, isStopped]);

    const animateTyping = (text) => {
        let index = 0;
        const interval = setInterval(() => {
            setTypedData((prevData) => {
                const char = text[index];
                if (char === '<') {
                    index = text.indexOf('>', index) + 1;
                } else {
                    index++;
                }
                return text.substring(0, index);
            });
            if (index >= text.length || isStopped) {
                clearInterval(interval);
                setIsStopped(false);
            }
        }, 5);
    };

    const handleCardClick = async (text) => {
        setRecentPrompt(text);
        await onSent(text);
    };

    const handleStopClick = () => {
        setIsStopped(true);
        setTypedData(data);
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim() !== '') {
            onSent();
        }
    };

    const handleReferencePrompt = async () => {
        const response = await referencePreviousData(input);
        setTypedData(response);
    };

    return (
        <div className="main">
            <div className="nav">
                <p onClick={()=>newChat()} style={{cursor:'pointer'}}>Gemini</p>
                <UserButton />
            </div>
            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span> Hello, {user?.firstName || "Dev"}</span></p>
                            <p>How can I help you today?</p>
                        </div>
                        <div className="cards">
                            <div className="card" onClick={() => handleCardClick("Text inviting neighbors to barbecue")}>
                                <p>Text inviting neighbors to barbecue</p>
                                <img src={assets.pencil_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick("Explain nostalgia to a kindergartener")}>
                                <p>Explain nostalgia to a kindergartener</p>
                                <img src={assets.graduation_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick("Make me a personal webpage")}>
                                <p>Make me a personal webpage</p>
                                <img src={assets.square_code} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick("Write a story in my favorite genre")}>
                                <p>Write a story in my favorite genre</p>
                                <img src={assets.light_bulb} alt="" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="result">
                        <div className="result-title">
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <div className='gemini-icon'>
                                <img src={assets.gemini_icon} alt="" />
                            </div>
                            {loading ? (
                                <div className="loader">
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            ) : (
                                <p className="typed-text" dangerouslySetInnerHTML={{ __html: typedData }}></p>
                            )}
                        </div>
                    </div>
                )}
                <div className="main-bottom">
                    <div className="search-box">
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleInputKeyDown}
                            value={input}
                            type="text"
                            placeholder="Enter a prompt here..."
                        />
                        <div>
                            {input ? (
                                <img onClick={() => onSent()} src={assets.send_icon} alt="" />
                            ) : (
                                !loading && !data ? null : (
                                    isStopped || typedData === data ? (
                                        <img src={assets.send_icon} alt="" onClick={() => onSent()} />
                                    ) : (
                                        <img src={assets.circle_stop} alt="" onClick={handleStopClick} />
                                    )
                                )
                            )}
                        </div>
                    </div>
                    <p className='bottom-info'>Gemini AI can make mistakes. Check important info.</p>
                </div>
               
            </div>
        </div>
    );
};

export default Main;
