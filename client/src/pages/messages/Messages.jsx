import React from "react";
import './messages.scss';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import moment from 'moment';

const Messages = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || 'null');
    const queryClient = useQueryClient();

    const { isLoading, error, data: conversations } = useQuery({
        queryKey: ["conversations"],
        queryFn: () =>
            newRequest.get(`/conversations`).then((res) => res.data),
    });

    const mutation = useMutation({
        mutationFn: (id) => {
            return newRequest.put(`/conversations/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["conversations"]);
        },
    });

    const handleRead = (id) => {
        mutation.mutate(id);
    };

    // Helper: robustly get the other participant regardless of roles
    const getOtherUserId = (conversation) => {
        if (!conversation) return null;
        return currentUser._id === conversation.sellerId
            ? conversation.buyerId
            : conversation.sellerId;
    };

    // Fetch all unique user IDs from conversations
    const uniqueUserIds = conversations ? 
        [...new Set(conversations.map(c => getOtherUserId(c)))] : [];

    // Fetch all other users' data
    const { data: usersData, isLoading: usersLoading } = useQuery({
        queryKey: ["users", uniqueUserIds],
        queryFn: async () => {
            if (uniqueUserIds.length === 0) return {};
            
            const usersPromises = uniqueUserIds.map(id => 
                newRequest.get(`/users/${id}`).then(res => res.data)
            );
            
            const users = await Promise.all(usersPromises);
            const usersMap = {};
            users.forEach(user => {
                usersMap[user._id] = user;
            });
            
            return usersMap;
        },
        enabled: uniqueUserIds.length > 0,
    });

    // Helper function to get other user's data
    const getOtherUserData = (conversation) => {
        if (!usersData) return { username: "Loading...", img: "/images/noavtar.jpeg" };
        
        const otherUserId = getOtherUserId(conversation);
        const user = usersData[otherUserId];
        
        if (user) {
            return {
                username: user.username || "Unknown User",
                img: user.img || "/images/noavtar.jpeg"
            };
        }
        
        return { username: "Unknown User", img: "/images/noavtar.jpeg" };
    };

    if (isLoading) {
        return (
            <div className="messages-loading">
                <div className="loader"></div>
                <p>Loading conversations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="messages-error">
                <h3>Something went wrong</h3>
                <p>Unable to load conversations</p>
            </div>
        );
    }

    return (
        <div className="messages">
            <div className="container">
                <div className="title">
                    <h1>Messages</h1>
                    <p>Your conversations</p>
                </div>
                
                {conversations && conversations.length > 0 ? (
                    <div className="conversations-list">
                        {conversations.map((conversation) => {
                            const otherUser = getOtherUserData(conversation);
                            const isUnread = (currentUser.isSeller && !conversation.readBySeller) ||
                                           (!currentUser.isSeller && !conversation.readByBuyer);
                            
                            return (
                                <div 
                                    key={conversation.id} 
                                    className={`conversation-item ${isUnread ? 'unread' : ''}`}
                                    onClick={() => handleRead(conversation.id)}
                                >
                                    <Link to={`/message/${conversation.id}`} className="conversation-link">
                                        <div className="conversation-avatar">
                                            <img 
                                                src={otherUser.img} 
                                                alt={otherUser.username} 
                                            />
                                            {isUnread && <div className="unread-indicator"></div>}
                                        </div>
                                        
                                        <div className="conversation-content">
                                            <div className="conversation-header">
                                                <h3 className="username">{otherUser.username}</h3>
                                                <span className="timestamp">
                                                    {moment(conversation.updatedAt).fromNow()}
                                                </span>
                                            </div>
                                            
                                            <div className="conversation-preview">
                                                <p className="last-message">
                                                    {conversation.lastMessage ? 
                                                        (conversation.lastMessage.length > 50 ? 
                                                            conversation.lastMessage.substring(0, 50) + '...' : 
                                                            conversation.lastMessage
                                                        ) : 
                                                        'No messages yet'
                                                    }
                                                </p>
                                                {isUnread && (
                                                    <div className="unread-badge">
                                                        <span>New</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="no-conversations">
                        <div className="no-conversations-icon">💬</div>
                        <h3>No conversations yet</h3>
                        <p>Start chatting with sellers or buyers to see your conversations here.</p>
                        <div className="no-conversations-modal">
                            <div className="modal-card">
                                <div className="modal-icon">📭</div>
                                <div className="modal-text">No messages now</div>
                                <button className="modal-btn" onClick={()=>window.location.href='/gigs'}>Explore gigs</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
