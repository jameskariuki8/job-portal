import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import { motion, AnimatePresence } from 'framer-motion';
import './sellerDashboard.scss';

const SellerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    // Redirect if not a seller
    useEffect(() => {
        if (!currentUser?.isSeller) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    // Fetch seller statistics
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['seller-stats'],
        queryFn: () => newRequest.get('/gigs/stats').then(r => r.data),
        enabled: !!currentUser?.isSeller,
    });

    const { data: recentGigs, isLoading: gigsLoading } = useQuery({
        queryKey: ['seller-recent-gigs'],
        queryFn: () => newRequest.get(`/gigs?userId=${currentUser?._id}&limit=5`).then(r => r.data),
        enabled: !!currentUser?.isSeller,
    });

    const { data: recentOrders, isLoading: ordersLoading } = useQuery({
        queryKey: ['seller-recent-orders'],
        queryFn: () => newRequest.get('/bids/owner/pending?limit=5').then(r => r.data),
        enabled: !!currentUser?.isSeller,
    });

    const { data: messages, isLoading: messagesLoading } = useQuery({
        queryKey: ['seller-conversations'],
        queryFn: () => newRequest.get('/conversations').then(r => r.data),
        enabled: !!currentUser?.isSeller,
    });

    const navigationItems = [
        { id: 'overview', label: 'Overview', icon: '📊', path: '/seller-dashboard' },
        { id: 'gigs', label: 'My Gigs', icon: '💼', path: '/mygigs' },
        { id: 'orders', label: 'Orders', icon: '📦', path: '/orders' },
        { id: 'messages', label: 'Messages', icon: '💬', path: '/messages' },
        { id: 'add', label: 'Add New Gig', icon: '➕', path: '/add' },
        { id: 'profile', label: 'Profile', icon: '👤', path: `/profile/${currentUser?._id}` },
    ];

    const handleNavigation = (item) => {
        if (item.id === 'overview') {
            setActiveTab('overview');
        } else {
            navigate(item.path);
        }
    };

    const StatCard = ({ title, value, icon, color, trend }) => (
        <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            <div className="stat-icon" style={{ backgroundColor: color }}>
                {icon}
            </div>
            <div className="stat-content">
                <h3>{value}</h3>
                <p>{title}</p>
                {trend && <span className={`trend ${trend > 0 ? 'positive' : 'negative'}`}>
                    {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
                </span>}
            </div>
        </motion.div>
    );

    const QuickAction = ({ title, description, icon, onClick, color }) => (
        <motion.button
            className="quick-action"
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ borderLeftColor: color }}
        >
            <div className="action-icon">{icon}</div>
            <div className="action-content">
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
        </motion.button>
    );

    const RecentItem = ({ item, type, onClick }) => (
        <motion.div 
            className="recent-item"
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
        >
            <div className="item-thumb">
                {type === 'gig' ? (
                    <img src={item.cover} alt={item.title} />
                ) : (
                    <div className="message-avatar">
                        <img src={item.otherUser?.img || '/images/noavtar.jpeg'} alt={item.otherUser?.username} />
                    </div>
                )}
            </div>
            <div className="item-content">
                <h4>{type === 'gig' ? item.title : item.otherUser?.username}</h4>
                <p>{type === 'gig' ? item.cat : item.lastMessage}</p>
                <span className="item-meta">
                    {type === 'gig' ? `$${item.priceMin}-${item.priceMax}` : 'New message'}
                </span>
            </div>
        </motion.div>
    );

    if (!currentUser?.isSeller) {
        return null;
    }

    return (
        <div className="seller-dashboard">
            {/* Mobile Header */}
            <div className="mobile-header">
                <button 
                    className="menu-toggle"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    ☰
                </button>
                <h1>Seller Dashboard</h1>
                <div className="user-avatar">
                    <img src={currentUser?.img || '/images/noavtar.jpeg'} alt={currentUser?.username} />
                </div>
            </div>

            <div className="dashboard-container">
                {/* Sidebar */}
                <motion.aside 
                    className={`sidebar ${sidebarOpen ? 'open' : ''}`}
                    initial={{ x: -300 }}
                    animate={{ x: sidebarOpen ? 0 : -300 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <div className="sidebar-header">
                        <h2>Seller Hub</h2>
                        <p>Manage your business</p>
                    </div>
                    
                    <nav className="sidebar-nav">
                        {navigationItems.map((item) => (
                            <motion.button
                                key={item.id}
                                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => handleNavigation(item)}
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </motion.button>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        <div className="user-info">
                            <img src={currentUser?.img || '/images/noavtar.jpeg'} alt={currentUser?.username} />
                            <div>
                                <h4>{currentUser?.username}</h4>
                                <p>Seller</p>
                            </div>
                        </div>
                    </div>
                </motion.aside>

                {/* Main Content */}
                <main className="main-content">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Welcome Section */}
                                <div className="welcome-section">
                                    <motion.h1
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        Welcome back, {currentUser?.username}! 👋
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Here's what's happening with your business today.
                                    </motion.p>
                                </div>

                                {/* Stats Grid */}
                                <div className="stats-grid">
                                    <StatCard
                                        title="Total Gigs"
                                        value={stats?.totalGigs || 0}
                                        icon="💼"
                                        color="#4F46E5"
                                        trend={12}
                                    />
                                    <StatCard
                                        title="Active Orders"
                                        value={stats?.activeOrders || 0}
                                        icon="📦"
                                        color="#10B981"
                                        trend={8}
                                    />
                                    <StatCard
                                        title="Total Revenue"
                                        value={`$${stats?.totalRevenue || 0}`}
                                        icon="💰"
                                        color="#F59E0B"
                                        trend={15}
                                    />
                                    <StatCard
                                        title="Messages"
                                        value={messages?.length || 0}
                                        icon="💬"
                                        color="#8B5CF6"
                                        trend={-2}
                                    />
                                </div>

                                {/* Quick Actions */}
                                <div className="quick-actions-section">
                                    <h2>Quick Actions</h2>
                                    <div className="quick-actions-grid">
                                        <QuickAction
                                            title="Create New Gig"
                                            description="Add a new service to your portfolio"
                                            icon="➕"
                                            color="#4F46E5"
                                            onClick={() => navigate('/add')}
                                        />
                                        <QuickAction
                                            title="View Orders"
                                            description="Manage your active orders"
                                            icon="📦"
                                            color="#10B981"
                                            onClick={() => navigate('/orders')}
                                        />
                                        <QuickAction
                                            title="Check Messages"
                                            description="Respond to client inquiries"
                                            icon="💬"
                                            color="#8B5CF6"
                                            onClick={() => navigate('/messages')}
                                        />
                                        <QuickAction
                                            title="Update Profile"
                                            description="Keep your profile fresh"
                                            icon="👤"
                                            color="#F59E0B"
                                            onClick={() => navigate(`/profile/${currentUser._id}`)}
                                        />
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="recent-activity">
                                    <div className="activity-section">
                                        <h3>Recent Gigs</h3>
                                        <div className="activity-list">
                                            {gigsLoading ? (
                                                <div className="loading">Loading...</div>
                                            ) : recentGigs?.length > 0 ? (
                                                recentGigs.map((gig) => (
                                                    <RecentItem
                                                        key={gig._id}
                                                        item={gig}
                                                        type="gig"
                                                        onClick={() => navigate(`/gig/${gig._id}`)}
                                                    />
                                                ))
                                            ) : (
                                                <div className="empty-state">
                                                    <p>No gigs yet. <Link to="/add">Create your first gig!</Link></p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="activity-section">
                                        <h3>Recent Messages</h3>
                                        <div className="activity-list">
                                            {messagesLoading ? (
                                                <div className="loading">Loading...</div>
                                            ) : messages?.length > 0 ? (
                                                messages.slice(0, 3).map((conversation) => (
                                                    <RecentItem
                                                        key={conversation._id}
                                                        item={conversation}
                                                        type="message"
                                                        onClick={() => navigate(`/message/${conversation._id}`)}
                                                    />
                                                ))
                                            ) : (
                                                <div className="empty-state">
                                                    <p>No messages yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <motion.div
                    className="sidebar-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default SellerDashboard;
