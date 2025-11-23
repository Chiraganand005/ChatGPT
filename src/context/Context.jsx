import { createContext, useState, useEffect, useContext } from "react";
import runChat from "../config/gemini";
import { AuthContext } from "./AuthContext";
import { createConversation, updateConversation } from "../services/conversationService";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState('');
    const [prevPrompt, setPrevprompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState('');
    const [voiceSearch, setVoiceSearch] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [recordingAnimation, setRecordingAnimation] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const { isAuthenticated } = useContext(AuthContext);

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord)
        }, 75 * index)
    }

    useEffect(() => {
        if (typeof window !== 'undefined' && window.webkitSpeechRecognition) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setVoiceSearch(false);
                setInput(transcript);
                onSent(transcript); // Call onSent function with the voice input

                setInput("")
                setRecordingAnimation(false);
            };

            recognition.onend = () => {
                setVoiceSearch(false);
                setRecordingAnimation(false);
            };

            setRecognition(recognition);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openVoiceSearch = () => {
        if (recognition && !voiceSearch) {
            recognition.start();
            setVoiceSearch(true);
            setRecordingAnimation(true);
        } else if (!recognition) {
            alert("Speech recognition is not supported in this browser.");
        }
    };

    const newChat = async () => {
        setLoading(false)
        setShowResult(false)
        setInput("")
        setResultData("")
        setUploadedImage(null)
        setImageFile(null)
        setCurrentConversationId(null)
        setRecentPrompt('')
        setChatHistory([])
    }

    const onSent = async (prompt, image = null) => {
        if (loading) return; // Prevent multiple calls if already loading

        setLoading(true);
        setShowResult(true);
        setResultData("");

        const promptToUse = prompt !== undefined ? prompt : input;
        const imageToUse = image !== null ? image : imageFile;

        try {
            let response;
            if (promptToUse || imageToUse) {
                // Prepare history for API
                // For text-only requests, we send the history.
                // Note: Gemini API might handle history differently for vision models, 
                // but passing it for text models is standard.
                const currentHistory = [...chatHistory];
                const historyToSend = imageToUse ? [] : currentHistory.map(msg => ({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                }));

                response = await runChat(promptToUse || "What's in this image?", imageToUse, historyToSend);

                setRecentPrompt(promptToUse || (imageToUse ? "Image analysis" : ""));
                if (!prompt) {
                    setPrevprompt(prev => [...prev, promptToUse || "Image analysis"]);
                }

                // Update local chat history
                const newMessages = [
                    { role: 'user', content: promptToUse || (imageToUse ? "Image analysis" : "") },
                    { role: 'assistant', content: response }
                ];
                setChatHistory(prev => [...prev, ...newMessages]);

            } else {
                setLoading(false);
                return; // No prompt or image
            }

            // Store raw markdown response
            setResultData(response);
            setInput("");
            setImageFile(null);
            setUploadedImage(null);

            // Save conversation to backend if user is authenticated
            if (isAuthenticated) {
                // We send the FULL updated history to the backend
                const updatedMessages = [...chatHistory,
                { role: 'user', content: promptToUse || (imageToUse ? "Image analysis" : "") },
                { role: 'assistant', content: response }
                ];

                if (currentConversationId) {
                    // Update existing conversation
                    await updateConversation(currentConversationId, recentPrompt || promptToUse, updatedMessages);
                } else {
                    // Create new conversation
                    const result = await createConversation(
                        promptToUse || (imageToUse ? "Image analysis" : "New Conversation"),
                        updatedMessages
                    );
                    if (result.success) {
                        setCurrentConversationId(result.data._id);
                    }
                }
            }
        } catch (error) {
            console.error("Error:", error);
            setResultData(`## Error\n\n${error.message || "Failed to get response. Please check your API key and try again."}`);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setImageFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setUploadedImage(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please upload an image file');
            }
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setUploadedImage(null);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            onSent();
        }
    };

    const loadExistingConversation = (conversation) => {
        if (conversation.messages && conversation.messages.length > 0) {
            setChatHistory(conversation.messages);

            // Find the last message pair for display
            const lastUserMessage = conversation.messages[conversation.messages.length - 2];
            const lastAssistantMessage = conversation.messages[conversation.messages.length - 1];

            if (lastUserMessage && lastAssistantMessage) {
                setCurrentConversationId(conversation._id);
                setRecentPrompt(lastUserMessage.content);
                setResultData(lastAssistantMessage.content);
                setShowResult(true);
            } else if (conversation.messages.length > 0) {
                // Fallback
                const lastMsg = conversation.messages[conversation.messages.length - 1];
                setCurrentConversationId(conversation._id);
                if (lastMsg.role === 'assistant') {
                    setResultData(lastMsg.content);
                    setShowResult(true);
                }
            }
        }
    };

    const contextValue = {
        prevPrompt,
        setPrevprompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        handleKeyPress,
        voiceSearch,
        openVoiceSearch,
        recordingAnimation,
        setRecordingAnimation,
        uploadedImage,
        imageFile,
        handleImageUpload,
        removeImage,
        currentConversationId,
        setCurrentConversationId,
        loadExistingConversation,
        chatHistory
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;