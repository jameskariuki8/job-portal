import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import './superadmin.scss';

const SuperAdmin = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('gigs');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['superadmin-overview'],
    queryFn: async () => (await newRequest.get('/admin/overview')).data,
  });

  const getGigPrice = (gig) => {
    const price = gig.priceMin ?? gig.priceMax ?? 0;
    return `$${Number(price)}`;
  };

  const onDeleteUser = async (userId, username) => {
    if (!window.confirm(`Delete user "${username}"? This action cannot be undone.`)) return;
    try {
      await newRequest.delete(`/admin/users/${userId}`);
      await queryClient.invalidateQueries({ queryKey: ['superadmin-overview'] });
    } catch (err) {
      alert('Error deleting user');
    }
  };

  const onDeleteGig = async (gigId, title) => {
    if (!window.confirm(`Delete gig "${title}"? This action cannot be undone.`)) return;
    try {
      await newRequest.delete(`/admin/gigs/${gigId}`);
      await queryClient.invalidateQueries({ queryKey: ['superadmin-overview'] });
    } catch (err) {
      alert('Error deleting gig');
    }
  };

  // Filter data based on search
  const filteredGigs = data?.gigs?.filter(gig => 
    gig.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gig.cat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gig.creator?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredUsers = data?.users?.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return (
    <div className="container superadmin">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="container superadmin">
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h2>Error loading dashboard</h2>
        <p>Please try refreshing the page</p>
      </div>
    </div>
  );

  const users = data?.users || [];
  const gigs = data?.gigs || [];

  return (
    <div className="container superadmin">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Superadmin Dashboard</h1>
          <p>Manage users and gigs across the platform</p>
        </div>
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-value">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{gigs.length}</div>
            <div className="stat-label">Total Gigs</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {users.filter(u => u.isSeller).length}
            </div>
            <div className="stat-label">Sellers</div>
          </div>
        </div>
      </header>

      <div className="dashboard-controls">
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'gigs' ? 'active' : ''}`}
            onClick={() => setActiveTab('gigs')}
          >
            Gigs ({gigs.length})
          </button>
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users ({users.length})
          </button>
        </div>
        
        <div className="search-box">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {activeTab === 'gigs' && (
        <section className="data-section">
          <div className="section-header">
            <h2>All Gigs</h2>
            <span className="result-count">{filteredGigs.length} results</span>
          </div>
          
          <div className="table-container">
            <div className="table gigs">
              <div className="row header">
                <div>Title</div>
                <div>Category</div>
                <div>Status</div>
                <div>Creator</div>
                <div>Price</div>
                <div>Actions</div>
              </div>
              
              {filteredGigs.length === 0 ? (
                <div className="empty-state">
                  <p>No gigs found{searchTerm && ` matching "${searchTerm}"`}</p>
                </div>
              ) : (
                filteredGigs.map(gig => (
                  <div key={gig._id} className="row card">
                    <div className="title" title={gig.title}>{gig.title}</div>
                    <div className="badge cat">{gig.cat}</div>
                    <div className={`badge status ${gig.status}`}>
                      {gig.status?.replace('_', ' ') || 'Unknown'}
                    </div>
                    <div className="creator" title={gig.creator ? `${gig.creator.username} (${gig.creator.email})` : gig.userId}>
                      {gig.creator ? `${gig.creator.username} (${gig.creator.email})` : gig.userId}
                    </div>
                    <div className="price">{getGigPrice(gig)}</div>
                    <div className="actions">
                      <button 
                        className="btn-danger" 
                        onClick={() => onDeleteGig(gig._id, gig.title)}
                        title="Delete gig"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'users' && (
        <section className="data-section">
          <div className="section-header">
            <h2>All Users</h2>
            <span className="result-count">{filteredUsers.length} results</span>
          </div>
          
          <div className="table-container">
            <div className="table users">
              <div className="row header">
                <div>Username</div>
                <div>Email</div>
                <div>Type</div>
                <div>Actions</div>
              </div>
              
              {filteredUsers.length === 0 ? (
                <div className="empty-state">
                  <p>No users found{searchTerm && ` matching "${searchTerm}"`}</p>
                </div>
              ) : (
                filteredUsers.map(user => (
                  <div key={user._id} className="row card">
                    <div className="username">{user.username}</div>
                    <div className="email">{user.email}</div>
                    <div className={`badge seller ${user.isSeller ? 'seller-badge' : 'buyer-badge'}`}>
                      {user.isSeller ? 'Seller' : 'Buyer'}
                    </div>
                    <div className="actions">
                      <button 
                        className="btn-danger" 
                        onClick={() => onDeleteUser(user._id, user.username)}
                        title="Delete user"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SuperAdmin;