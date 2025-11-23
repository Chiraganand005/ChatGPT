import React, { useContext, useRef } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import { SidebarContext } from '../../context/SidebarContext';
import MarkdownRenderer from '../MarkdownRenderer/MarkdownRenderer';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, handleKeyPress, openVoiceSearch, voiceSearch, recordingAnimation, uploadedImage, handleImageUpload, removeImage, chatHistory } = useContext(Context);
    const { isOpen, toggleSidebar } = useContext(SidebarContext);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    React.useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatHistory, loading, resultData]);

    return (
        <div className={`main ${!isOpen ? 'sidebar-closed' : ''}`}>
            <div className="nav">
                {!isOpen && (
                    <img
                        src={assets.menu_icon}
                        alt="Menu"
                        onClick={toggleSidebar}
                        style={{ cursor: 'pointer', width: '24px', marginRight: '10px' }}
                    />
                )}
                <p>NamasteAI</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">

                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Hello, Jee</span></p>
                            <p>How can I help you?</p>
                        </div>
                        <div className="cards">
                            <div className="card" onClick={() => onSent("Suggest Beautiful places to see on an upcoming road trip")}>
                                <p>Suggest Beautiful places to see on an upcoming road trip</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => onSent("Briefly summarize this concept urban planning")}>
                                <p>Briefly summarize this concept urban planning</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => onSent("Brainstorm team bonding activities for our work retreat")}>
                                <p>Brainstorm team bonding activities for our work retreat</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => onSent("Improve the readability of the following code")}>
                                <p>Improve the readability of the following code</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='result'>
                        {chatHistory.map((msg, index) => (
                            <React.Fragment key={index}>
                                {msg.role === 'user' ? (
                                    <div className='result-title'>
                                        <img src={assets.user_icon} alt="" />
                                        <p>{msg.content}</p>
                                    </div>
                                ) : (
                                    <div className='result-data'>
                                        <img src={assets.gemini_icon} alt="" />
                                        {index === chatHistory.length - 1 && loading ? (
                                            <div className='loader'>
                                                <hr />
                                                <hr />
                                                <hr />
                                            </div>
                                        ) : (
                                            <ErrorBoundary>
                                                <MarkdownRenderer content={msg.content} />
                                            </ErrorBoundary>
                                        )}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                        {loading && chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'user' && (
                            <div className='result-data'>
                                <img src={assets.gemini_icon} alt="" />
                                <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                <div className="main-bottom">
                    {uploadedImage && (
                        <div className="uploaded-image-preview">
                            <img src={uploadedImage} alt="Uploaded" />
                            <button onClick={removeImage} className="remove-image-btn">×</button>
                        </div>
                    )}
                    <div className="search-box">
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            type="text"
                            onKeyDown={handleKeyPress}
                            placeholder="Enter a prompt here"
                        />
                        <div>
                            <img
                                src={assets.gallery_icon}
                                alt="Upload Image"
                                onClick={() => fileInputRef.current?.click()}
                                style={{ cursor: 'pointer' }}
                            />
                            <img
                                src={assets.mic_icon}
                                alt="Mic Icon"
                                onClick={openVoiceSearch}
                                className={`mic-icon ${voiceSearch ? "active" : ""} ${recordingAnimation ? "recording" : ""}`}
                            />
                            {(input || uploadedImage) ? <img onClick={() => onSent()} src={assets.send_icon} alt="" style={{ cursor: 'pointer' }} /> : null}
                        </div>
                    </div>
                    <p className="bottom-info">
                        NamasteAI may display inaccurate info including about people so double check its responses.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Main;
