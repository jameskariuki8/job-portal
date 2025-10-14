import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import { motion, AnimatePresence } from 'framer-motion';
import './sellerDashboard.scss';

// Icons for better visual consistency
const Icons = {
  overview: '📊',
  gigs: '💼',
  orders: '📦',
  messages: '💬',
  add: '✨',
  profile: '👤',
  revenue: '💰',
  stats: '📈',
  create: '🚀',
  update: '🔄'
};

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  
  // Redirect if not a seller
  useEffect(() => {
    if (!currentUser?.isSeller) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch seller statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['seller-stats'],
    queryFn: () => newRequest.get('/gigs/stats').then(r => r.data),
    enabled: !!currentUser?.isSeller,
  });

  // Recent gigs/messages sections removed; keep only stats and quick actions

  useQuery({
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
    { id: 'overview', label: 'Overview', icon: Icons.overview, path: '/seller/dashboard' },
    { id: 'gigs', label: 'My Gigs', icon: Icons.gigs, path: '/seller/mygigs' },
    { id: 'orders', label: 'Orders', icon: Icons.orders, path: '/seller/orders' },
    { id: 'messages', label: 'Messages', icon: Icons.messages, path: '/seller/messages' },
    { id: 'add', label: 'Create Gig', icon: Icons.add, path: '/seller/add' },
    { id: 'profile', label: 'Profile', icon: Icons.profile, path: `/profile/${currentUser?._id}` },
  ];

  const handleNavigation = (item) => {
    if (item.id === 'overview') {
      setActiveTab('overview');
    } else {
      navigate(item.path);
    }
    setSidebarOpen(false);
  };

  const StatCard = ({ title, value, icon, color, trend, loading }) => (
    <motion.div 
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="stat-glow" style={{ background: `radial-gradient(circle at center, ${color}20, transparent 70%)` }} />
      <div className="stat-icon" style={{ 
        background: `linear-gradient(135deg, ${color}40, ${color}20)`,
        border: `1px solid ${color}30`
      }}>
        {icon}
      </div>
      <div className="stat-content">
        {loading ? (
          <div className="skeleton-loader skeleton-text"></div>
        ) : (
          <>
            <h3>{value}</h3>
            <p>{title}</p>
            {trend && (
              <span className={`trend ${trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral'}`}>
                {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
              </span>
            )}
          </>
        )}
      </div>
    </motion.div>
  );

  const QuickAction = ({ title, description, icon, onClick, color }) => (
    <motion.button
      className="quick-action"
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      style={{ 
        '--action-color': color,
        background: `linear-gradient(135deg, ${color}15, ${color}08)`,
        border: `1px solid ${color}25`
      }}
    >
      <div className="action-glow" style={{ background: `radial-gradient(circle at center, ${color}20, transparent 70%)` }} />
      <div className="action-icon" style={{ color }}>{icon}</div>
      <div className="action-content">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      <div className="action-arrow">→</div>
    </motion.button>
  );

  // RecentItem removed with recent sections

  const LoadingSkeleton = () => (
    <div className="skeleton-container">
      <div className="welcome-section">
        <div className="skeleton-loader skeleton-title"></div>
        <div className="skeleton-loader skeleton-subtitle"></div>
      </div>
      <div className="stats-grid">
        {[1, 2, 3, 4].map(i => (
          <StatCard key={i} title="" value="" icon=" " loading={true} />
        ))}
      </div>
      <div className="quick-actions-section">
        <div className="skeleton-loader skeleton-heading"></div>
        <div className="quick-actions-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="quick-action-skeleton">
              <div className="skeleton-loader skeleton-icon"></div>
              <div className="skeleton-content">
                <div className="skeleton-loader skeleton-text short"></div>
                <div className="skeleton-loader skeleton-text medium"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!currentUser?.isSeller) {
    return null;
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-container">
        {/* Sidebar */}
        <motion.aside 
          className={`sidebar ${sidebarOpen ? 'open' : ''}`}
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="sidebar-background"></div>
          <div className="sidebar-content">
            <div className="sidebar-header">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                Seller Hub
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Your business command center
              </motion.p>
            </div>
            
            <nav className="sidebar-nav">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleNavigation(item)}
                  whileHover={{ x: 8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  <div className="nav-glow"></div>
                </motion.button>
              ))}
            </nav>

            <div className="sidebar-footer">
              <motion.div 
                className="user-info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="user-avatar">
                  <img src={currentUser?.img || '/images/noavtar.jpeg'} alt={currentUser?.username} />
                  <div className="online-indicator"></div>
                </div>
                <div className="user-details">
                  <h4>{currentUser?.username}</h4>
                  <p>Professional Seller</p>
                </div>
              </motion.div>
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
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    {/* Welcome Section */}
                    <div className="welcome-section">
                      <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        Welcome back, <span className="gradient-text">{currentUser?.username}</span>! 👋
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        You need it, we've got it. Here's your latest performance.
                      </motion.p>
                    </div>

                    {/* Stats Grid */}
                    <div className="stats-grid">
                      <StatCard
                        title="Active Gigs"
                        value={stats?.totalGigs || 0}
                        icon={Icons.gigs}
                        color="#8B5CF6"
                        trend={12}
                        loading={statsLoading}
                      />
                      <StatCard
                        title="Pending Orders"
                        value={stats?.activeOrders || 0}
                        icon={Icons.orders}
                        color="#10B981"
                        trend={8}
                        loading={statsLoading}
                      />
                      <StatCard
                        title="Total Revenue"
                        value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
                        icon={Icons.revenue}
                        color="#F59E0B"
                        trend={15}
                        loading={statsLoading}
                      />
                      <StatCard
                        title="Unread Messages"
                        value={messages?.length || 0}
                        icon={Icons.messages}
                        color="#EF4444"
                        trend={-2}
                        loading={messagesLoading}
                      />
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions-section">
                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        Quick Actions
                      </motion.h2>
                      <div className="quick-actions-grid">
                        <QuickAction
                          title="Create New Gig"
                          description="Launch a new service offering"
                          icon={Icons.create}
                          color="#8B5CF6"
                          onClick={() => navigate('/seller/add')}
                        />
                        <QuickAction
                          title="Manage Orders"
                          description="Review and process orders"
                          icon={Icons.orders}
                          color="#10B981"
                          onClick={() => navigate('/seller/orders')}
                        />
                        <QuickAction
                          title="Check Messages"
                          description="Connect with your clients"
                          icon={Icons.messages}
                          color="#3B82F6"
                          onClick={() => navigate('/seller/messages')}
                        />
                        <QuickAction
                          title="Update Profile"
                          description="Refresh your seller profile"
                          icon={Icons.update}
                          color="#F59E0B"
                          onClick={() => navigate(`/profile/${currentUser._id}`)}
                        />
                      </div>
                    </div>

                    {/* Recent gigs/messages removed by request */}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerDashboard;