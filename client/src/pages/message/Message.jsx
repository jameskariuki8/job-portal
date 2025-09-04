import React, { useState, useEffect, useRef } from "react";
import './message.scss';
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import moment from 'moment';

const Message = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const messagesEndRef = useRef(null);
  const [messageText, setMessageText] = useState("");

  // Fetch conversation details
  const { data: conversation, isLoading: conversationLoading } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () =>
      newRequest.get(`/conversations/single/${id}`).then((res) => res.data),
  });

  // Fetch messages
  const { isLoading: messagesLoading, error, data: messages } = useQuery({
    queryKey: ["messages", id],
    queryFn: () =>
      newRequest.get(`/messages/${id}`).then((res) => res.data),
    refetchInterval: 3000, // Auto-refresh every 3 seconds
    enabled: !!conversation, // Only fetch messages when conversation is loaded
  });

  // Fetch other user's data (buyer or seller)
  const otherUserId = conversation ? 
    (currentUser.isSeller ? conversation.buyerId : conversation.sellerId) : null;

  const { data: otherUser, isLoading: otherUserLoading } = useQuery({
    queryKey: ["otherUser", otherUserId],
    queryFn: () =>
      newRequest.get(`/users/${otherUserId}`).then((res) => res.data),
    enabled: !!otherUserId,
  });

  // Fetch current user's data
  const { data: currentUserData, isLoading: currentUserLoading } = useQuery({
    queryKey: ["currentUser", currentUser._id],
    queryFn: () =>
      newRequest.get(`/users/${currentUser._id}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", id]);
      queryClient.invalidateQueries(["conversations"]);
      setMessageText("");
    },
    onError: (err) => {
      const msg = err?.response?.data || 'Failed to send message';
      alert(typeof msg === 'string' ? msg : 'You cannot message this user');
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    mutation.mutate({
      conversationId: id,
      desc: messageText.trim(),
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Show loading if any of the required data is still loading
  if (conversationLoading || otherUserLoading || currentUserLoading) {
    return (
      <div className="message-loading">
        <div className="loader"></div>
        <p>Loading conversation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="message-error">
        <h3>Something went wrong</h3>
        <p>Unable to load the conversation</p>
        <button onClick={() => navigate('/messages')}>Back to Messages</button>
      </div>
    );
  }

  // Check if we have the required data
  if (!conversation || !otherUser) {
    return (
      <div className="message-error">
        <h3>Conversation not found</h3>
        <p>This conversation doesn't exist or you don't have access to it.</p>
        <button onClick={() => navigate('/messages')}>Back to Messages</button>
      </div>
    );
  }

  return (
    <div className="message">
      <div className="chat-frame">
      {/* WhatsApp-style header */}
      <div className="chat-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/messages')}>
            <span className="back-icon">←</span>
          </button>
          <div className="user-info">
            <div className="avatar">
              <img 
                src={otherUser?.img || "/images/noavtar.jpeg"} 
                alt={otherUser?.username || "User"} 
              />
            </div>
            <div className="user-details">
              <h3 className="username">{otherUser?.username || "Unknown User"}</h3>
              <span className="status">
                {otherUser?.isSeller ? "Seller" : "Buyer"}
              </span>
            </div>
          </div>
        </div>
        {/* header-right icons removed as requested */}
      </div>

      {/* Messages container */}
      <div className="messages-container">
        {messagesLoading ? (
          <div className="loading-messages">
            <div className="loader"></div>
            <p>Loading messages...</p>
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="messages">
            {messages.map((message) => (
              <div 
                key={message._id} 
                className={`message-item ${message.userId === currentUser._id ? "sent" : "received"}`}
              >
                <div className="message-content">
                  <div className="message-bubble">
                    <p>{message.desc}</p>
                    <span className="message-time">
                      {moment(message.createdAt).format('HH:mm')}
                    </span>
                  </div>
                  <div className="message-avatar">
                    <img 
                      src={message.userId === currentUser._id 
                        ? (currentUserData?.img || "/images/noavtar.jpeg")
                        : (otherUser?.img || "/images/noavtar.jpeg")
                      } 
                      alt="avatar" 
                    />
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="no-messages">
            <div className="no-messages-icon">💬</div>
            <h3>No messages yet</h3>
            <p>Start the conversation by sending a message!</p>
          </div>
        )}
      </div>

      {/* Message input - Now positioned inside the purple section */}
      <div className="message-input-container">
        <form className="message-input-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows="1"
              className="message-textarea"
            />
            <button 
              type="submit" 
              className="send-btn"
              disabled={!messageText.trim() || mutation.isLoading}
            >
              {mutation.isLoading ? (
                <span className="spinner"></span>
              ) : (
                <span className="send-icon">➤</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Message;