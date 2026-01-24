import React, { useEffect, useState } from 'react';
import api from '../api';
import useAuth from '../hooks/useAuth';
import ConfirmModal from '../components/ConfirmModal';
import styles from './Admin.module.css';
import commonStyles from '../styles/common.module.css';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [actionUserId, setActionUserId] = useState(null);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [expandedChats, setExpandedChats] = useState(new Set());
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  const { user: currentUser } = useAuth();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data } = await api.get('/api/users');
        setUsers(data.users);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load users');
      } finally {
        setLoadingUsers(false);
      }
    }
    fetchUsers();
  }, []);

  const handleToggleRole = async (u) => {
    if (u.id === currentUser?.id) {
      setActionError('You cannot change your own role.');
      setActionSuccess('');
      return;
    }
    
    if (!u.id) {
      setActionError('Invalid user ID');
      return;
    }
    
    setActionError('');
    setActionSuccess('');
    setActionUserId(u.id);
    const nextRole = u.role === 'admin' ? 'user' : 'admin';
    const userId = String(u.id).trim();
    
    try {
      console.log('Updating role:', { userId, userIdType: typeof userId, currentRole: u.role, nextRole });
      
      const { data } = await api.patch(`/api/users/${userId}/role`, { role: nextRole });
      console.log('Role update response:', data);
      
      if (data.success && data.user) {
        setUsers((prev) => prev.map((item) => (item.id === u.id ? data.user : item)));
        setActionSuccess(`Successfully changed ${u.name}'s role to ${nextRole}`);
        setActionError('');
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        setActionError('Unexpected response from server');
      }
    } catch (err) {
      console.error('=== ROLE UPDATE ERROR ===');
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      console.error('Has response:', !!err.response);
      console.error('Response status:', err.response?.status);
      console.error('Response data:', err.response?.data);
      console.error('Request URL:', `/api/users/${userId}/role`);
      console.error('Request payload:', { role: nextRole });
      console.error('User ID:', userId, 'Type:', typeof userId);
      console.error('Full error:', err);
      
      let errorMsg = 'Could not update role';
      
      // Only show network error if there's truly no response
      if (!err.response && (err.code === 'ECONNREFUSED' || err.message === 'Network Error' || err.code === 'ERR_NETWORK')) {
        const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
        errorMsg = `Network error: Cannot connect to ${baseURL}. 
        
Please check:
1. Backend server is running (check terminal)
2. Backend is on port 5000 (or check your .env file)
3. CORS is configured (CLIENT_ORIGIN in backend/.env should match frontend URL)
4. Try opening ${baseURL}/api/health in your browser`;
      } else if (err.response) {
        // Server responded, so it's not a network error
        if (err.response.status === 401) {
          errorMsg = 'Authentication failed. Please log in again.';
        } else if (err.response.status === 403) {
          errorMsg = 'You do not have permission to perform this action. Make sure you are logged in as admin.';
        } else if (err.response.status === 404) {
          errorMsg = 'User not found.';
        } else if (err.response.status === 400) {
          if (err.response.data.message) {
            errorMsg = err.response.data.message;
          } else if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
            errorMsg = err.response.data.errors.map(e => e.msg || e.message).join(', ');
          } else {
            errorMsg = 'Invalid request. Please check the user ID and role value.';
          }
        } else if (err.response.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.response.data?.errors && Array.isArray(err.response.data.errors)) {
          errorMsg = err.response.data.errors.map(e => e.msg || e.message).join(', ');
        } else {
          errorMsg = `Server error (${err.response.status}). Check console for details.`;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setActionError(errorMsg);
      setActionSuccess('');
    } finally {
      setActionUserId(null);
    }
  };

  const handleDeleteClick = (u) => {
    if (u.id === currentUser?.id) {
      setActionError('You cannot delete your own account.');
      setActionSuccess('');
      return;
    }
    setDeleteModal({ isOpen: true, user: u });
  };

  const handleDeleteConfirm = async () => {
    const u = deleteModal.user;
    if (!u) return;
    
    setDeleteModal({ isOpen: false, user: null });
    setActionError('');
    setActionSuccess('');
    setActionUserId(u.id);
    
    try {
      const { data } = await api.delete(`/api/users/${u.id}`);
      if (data.success) {
        setUsers((prev) => prev.filter((item) => item.id !== u.id));
        setActionSuccess(`Successfully deleted ${u.name}`);
        setActionError('');
        setTimeout(() => setActionSuccess(''), 3000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Could not delete user';
      setActionError(errorMsg);
      setActionSuccess('');
      console.error('Delete error:', err.response?.data || err.message);
    } finally {
      setActionUserId(null);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setAiLoading(true);
    setAnswer('');
    setError('');
    
    const currentPrompt = prompt.trim();
    
    try {
      const { data } = await api.post('/api/ai/ask', { prompt: currentPrompt });
      const aiAnswer = data.answer;
      setAnswer(aiAnswer);
      setPrompt(''); // Clear input after successful submission
      
      // Add to chat history (keep only last 5)
      setChatHistory((prev) => {
        const newHistory = [
          {
            prompt: currentPrompt,
            answer: aiAnswer,
            timestamp: new Date().toLocaleString()
          },
          ...prev
        ];
        return newHistory.slice(0, 5); // Keep only last 5 chats
      });
    } catch (err) {
      setError(err.response?.data?.message || 'AI request failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleClearAnswer = () => {
    setAnswer('');
    setError('');
  };

  const toggleChat = (index) => {
    setExpandedChats((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className={styles.adminGrid}>
      <div className={commonStyles.card}>
        <h2 className={commonStyles.cardTitle}>Users</h2>
        {loadingUsers ? (
          <div className={commonStyles.loadingContainer}>
            <div className={commonStyles.loadingSpinner}></div>
            <p className={commonStyles.loadingText}>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <p className={commonStyles.emptyState}>No users found.</p>
        ) : (
          <ul className={styles.userList}>
            {users.map((u) => (
              <li key={u.id} className={styles.userListItem}>
                <span className={styles.userName} title={u.name}>{u.name}</span>
                <span className={styles.userEmail} title={u.email}>{u.email}</span>
                <span className={`${styles.roleTag} ${u.role === 'admin' ? styles.roleTagAdmin : styles.roleTagUser}`}>
                  {u.role}
                </span>
                <div className={styles.userActions}>
                  <button
                    type="button"
                    className={`${styles.roleButton} ${u.id === currentUser?.id ? styles.buttonLocked : ''}`}
                    disabled={actionUserId === u.id || u.id === currentUser?.id}
                    onClick={() => handleToggleRole(u)}
                    title={u.id === currentUser?.id ? 'Cannot change your own role' : `Change ${u.name}'s role to ${u.role === 'admin' ? 'User' : 'Admin'}`}
                  >
                    {u.id === currentUser?.id
                      ? '🔒 Locked'
                      : actionUserId === u.id
                        ? <span className={styles.buttonLoading}>⏳</span>
                        : u.role === 'admin'
                          ? '⬇️ Make User'
                          : '⬆️ Make Admin'}
                  </button>
                  <button
                    type="button"
                    className={`${styles.deleteButton} ${u.id === currentUser?.id ? styles.buttonLocked : ''}`}
                    disabled={actionUserId === u.id || u.id === currentUser?.id}
                    onClick={() => handleDeleteClick(u)}
                    title={u.id === currentUser?.id ? 'Cannot delete your own account' : `Delete ${u.name}`}
                  >
                    {u.id === currentUser?.id
                      ? '🔒 Locked'
                      : actionUserId === u.id
                        ? <span className={styles.buttonLoading}>⏳</span>
                        : '🗑️ Delete'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {actionSuccess && (
          <div className={styles.successContainer}>
            <p className={styles.successMessage}>
              <strong>✅ Success:</strong> {actionSuccess}
            </p>
            <button 
              className={styles.successDismiss}
              onClick={() => setActionSuccess('')}
              title="Dismiss message"
            >
              ✕
            </button>
          </div>
        )}
        {actionError && (
          <div className={styles.errorContainer}>
            <p className={commonStyles.errorMessage}>
              <strong>⚠️ Error:</strong> {actionError}
            </p>
            <button 
              className={styles.errorDismiss}
              onClick={() => setActionError('')}
              title="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className={commonStyles.card}>
        <div className={styles.aiHeader}>
          <h2 className={commonStyles.cardTitle}>
            <span className={styles.aiIcon}>🤖</span>
            Ask AI Assistant
          </h2>
          <p className={styles.aiSubtitle}>Get instant answers powered by Gemini AI</p>
        </div>
        <form onSubmit={handleAsk} className={commonStyles.form}>
          <label className={commonStyles.formLabel}>
            <span className={styles.labelIcon}>💬</span>
            Your Question
          </label>
          <textarea 
            className={commonStyles.formTextarea}
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)} 
            rows={5}
            placeholder="Ask me anything! For example: 'What is React?', 'Explain MongoDB', 'How to deploy a MERN app?'..."
            required 
            disabled={aiLoading}
          />
          <div className={styles.aiFormActions}>
            <button 
              type="submit" 
              className={`${commonStyles.button} ${styles.askButton}`} 
              disabled={aiLoading || !prompt.trim()}
            >
              {aiLoading ? (
                <>
                  <span className={commonStyles.loadingSpinner}></span>
                  Asking AI...
                </>
              ) : (
                <>
                  <span className={styles.buttonIcon}>✨</span>
                  Ask AI
                </>
              )}
            </button>
            {answer && (
              <button
                type="button"
                onClick={handleClearAnswer}
                className={styles.clearButton}
                title="Clear response"
              >
                🗑️ Clear
              </button>
            )}
          </div>
        </form>
        {answer && (
          <div className={styles.aiAnswer}>
            <div className={styles.aiAnswerHeader}>
              <strong className={styles.aiAnswerLabel}>
                <span className={styles.responseIcon}>💡</span>
                AI Response:
              </strong>
              <button
                onClick={handleClearAnswer}
                className={styles.closeButton}
                title="Clear response"
                aria-label="Clear response"
              >
                ✕
              </button>
            </div>
            <div className={styles.aiAnswerContent}>
              <p className={styles.aiAnswerText}>{answer}</p>
            </div>
          </div>
        )}
        {error && (
          <div className={styles.aiError}>
            <p className={commonStyles.errorMessage}>
              <strong>⚠️ Error:</strong> {error}
            </p>
            <button
              onClick={() => setError('')}
              className={styles.errorCloseButton}
              title="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}
        
        {chatHistory.length > 0 && (
          <div className={styles.chatHistory}>
            <div className={styles.chatHistoryHeader}>
              <h3 className={styles.chatHistoryTitle}>
                <span className={styles.historyIcon}>📚</span>
                Recent Chats ({chatHistory.length}/5)
              </h3>
              <button
                onClick={() => {
                  setChatHistory([]);
                  setExpandedChats(new Set());
                }}
                className={styles.clearHistoryButton}
                title="Clear all chat history"
              >
                🗑️ Clear All
              </button>
            </div>
            <div className={styles.chatHistoryList}>
              {chatHistory.map((chat, index) => {
                const isExpanded = expandedChats.has(index);
                return (
                  <div key={index} className={styles.accordionItem}>
                    <button
                      className={styles.accordionHeader}
                      onClick={() => toggleChat(index)}
                      aria-expanded={isExpanded}
                    >
                      <div className={styles.accordionHeaderContent}>
                        <span className={styles.accordionIcon}>❓</span>
                        <span className={styles.accordionQuestion}>{chat.prompt}</span>
                      </div>
                      <div className={styles.accordionHeaderMeta}>
                        <span className={styles.accordionTimestamp}>{chat.timestamp}</span>
                        <span className={`${styles.accordionArrow} ${isExpanded ? styles.accordionArrowOpen : ''}`}>
                          ▼
                        </span>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className={styles.accordionContent}>
                        <div className={styles.accordionAnswer}>
                          <span className={styles.accordionAnswerIcon}>💡</span>
                          <p className={styles.accordionAnswerText}>{chat.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${deleteModal.user?.name} (${deleteModal.user?.email})? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
