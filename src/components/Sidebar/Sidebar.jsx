import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets.js";
import "./Sidebar.css";
import { Context } from "../../context/Context.jsx";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  return (
    <div className={`sidebar ${extended ? 'extended' : ''}`}>
      <div className="top">
        <img className="menu" onClick={() => setExtended((prev) => !prev)} src={assets.menu_icon} alt="menu icon" />
        <div onClick={() => newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="plus icon" />
          {extended && <p>New Chat</p>}
        </div>
        {extended && (
          <div className="recent">
            <p className="recent-title">Recent</p>
            <div className="recent-list">
              {prevPrompts.map((prompt, index) => (
                <div onClick={() => loadPrompt(prompt)} className="recent-entry" key={index}>
                  <img src={assets.message_icon} alt="message icon" />
                  <p>{prompt.slice(0, 18)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="question icon" />
          {extended && <p>Help</p>}
        </div>

        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="history icon" />
          {extended && <p>Activity</p>}
        </div>

        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="setting icon" />
          {extended && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
