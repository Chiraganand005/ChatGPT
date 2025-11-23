import React, { useContext, useState, useEffect } from 'react'
import './SideBard.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { SidebarContext } from '../../context/SidebarContext';
import { getConversations, deleteConversation } from '../../services/conversationService';

const SideBar = () => {
    const [extended, setExtended] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const { newChat, loadExistingConversation } = useContext(Context);
    const { user, logout, isAuthenticated } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { isOpen, toggleSidebar } = useContext(SidebarContext);

    // Load conversations when user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            loadConversations();
        } else {
            setConversations([]);
        }
    }, [isAuthenticated]);

    // Refresh conversations periodically (every 5 seconds) when authenticated
    useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(() => {
            loadConversations(true);
        }, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const loadConversations = async (silent = false) => {
        if (!silent) setLoadingConversations(true);
        const result = await getConversations();
        if (result.success) {
            setConversations(result.data);
        }
        if (!silent) setLoadingConversations(false);
    };

    const loadConversation = (conversation) => {
        newChat(); // Clear current chat first
        loadExistingConversation(conversation);
    };

    const handleDeleteConversation = async (conversationId, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this conversation?')) {
            const result = await deleteConversation(conversationId);
            if (result.success) {
                setConversations(conversations.filter(c => c._id !== conversationId));
            }
        }
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : 'closed'} ${extended ? '' : 'collapsed'}`}>
                <div className="top">
                    <img className='menu' src={assets.menu_icon} alt="" onClick={() => setExtended(prev => !prev)} />
                    <div onClick={() => newChat()} className="new-chat" style={{ cursor: 'pointer' }}>
                        <img src={assets.plus_icon} alt="" />
                        {extended ? <p>New Chat</p> : null}
                    </div>
                    {extended &&
                        <div className="recent">
                            <p className='recent-title'>Recent</p>
                            {loadingConversations ? (
                                <p style={{ padding: '10px', color: 'var(--text-secondary, #666)', fontSize: '14px' }}>
                                    Loading conversations...
                                </p>
                            ) : conversations.length > 0 ? (
                                conversations.map((conversation) => (
                                    <div
                                        key={conversation._id}
                                        onClick={() => loadConversation(conversation)}
                                        className="recent-entry"
                                    >
                                        <img src={assets.message_icon} alt="" />
                                        <p>{conversation.title.slice(0, 18)}...</p>
                                        <img
                                            src={assets.trash}
                                            onClick={(e) => handleDeleteConversation(conversation._id, e)}
                                            alt="Delete"
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p style={{ padding: '10px', color: 'var(--text-secondary, #666)', fontSize: '14px' }}>
                                    No conversations yet. Start chatting!
                                </p>
                            )}
                        </div>
                    }
                </div>
                <div className="bottom">
                    <div className="bottom-item recent-entry" onClick={() => alert('Help: This is NamasteAI, a Gemini-powered AI assistant. Ask questions or upload images to get started!')} style={{ cursor: 'pointer' }}>
                        <img src={assets.question_icon} alt="" />
                        {extended ? <p>Help</p> : null}
                    </div>
                    <div className="bottom-item recent-entry" onClick={() => {
                        if (isAuthenticated) {
                            loadConversations();
                            alert(`You have ${conversations.length} saved conversation${conversations.length !== 1 ? 's' : ''}`);
                        } else {
                            alert('Please login to save conversations');
                        }
                    }} style={{ cursor: 'pointer' }}>
                        <img src={assets.history_icon} alt="" />
                        {extended ? <p>Activity</p> : null}
                    </div>
                    <div className="bottom-item recent-entry" onClick={() => setShowSettings(true)} style={{ cursor: 'pointer' }}>
                        <img src={assets.setting_icon} alt="" />
                        {extended ? <p>Settings</p> : null}
                    </div>
                </div>
            </div>

            {showSettings && (
                <div className="settings-modal-overlay" onClick={() => setShowSettings(false)}>
                    <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="settings-header">
                            <h3>Settings</h3>
                            <button className="settings-close" onClick={() => setShowSettings(false)}>×</button>
                        </div>

                        <div className="settings-content">
                            <div className="settings-section">
                                <h4>User Profile</h4>
                                <div className="settings-user-info">
                                    <p><strong>Name:</strong> {user?.name}</p>
                                    <p><strong>Email:</strong> {user?.email}</p>
                                </div>
                            </div>

                            <div className="settings-section">
                                <h4>Appearance</h4>
                                <div className="settings-theme-toggle">
                                    <span>Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
                                    <label className="theme-switch">
                                        <input
                                            type="checkbox"
                                            checked={theme === 'dark'}
                                            onChange={toggleTheme}
                                        />
                                        <span className="theme-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="settings-section">
                                <button className="settings-logout" onClick={logout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SideBar;
