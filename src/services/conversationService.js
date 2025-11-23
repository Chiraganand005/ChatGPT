import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get all conversations for the current user
export const getConversations = async () => {
  try {
    const response = await axios.get(`${API_URL}/conversations`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load conversations',
    };
  }
};

// Create a new conversation
export const createConversation = async (title, messages) => {
  try {
    const response = await axios.post(`${API_URL}/conversations`, {
      title,
      messages,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create conversation',
    };
  }
};

// Update an existing conversation
export const updateConversation = async (id, title, messages) => {
  try {
    const response = await axios.put(`${API_URL}/conversations/${id}`, {
      title,
      messages,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update conversation',
    };
  }
};

// Delete a conversation
export const deleteConversation = async (id) => {
  try {
    await axios.delete(`${API_URL}/conversations/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete conversation',
    };
  }
};

