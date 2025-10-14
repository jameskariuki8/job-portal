import React, { useState } from "react";
import './orders.scss';
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations/translations";
import { motion, AnimatePresence } from "framer-motion";

const Orders = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || 'null');
    const { currentLanguage } = useLanguage();

    const [tab, setTab] = useState('active');
    const [selectedGigId, setSelectedGigId] = useState('all');
    const [reviewModal, setReviewModal] = useState({ 
        open: false, 
        bid: null, 
        stars: 5, 
        satisfaction: 'excellent', 
        comment: '' 
    });
    const [hoverStars, setHoverStars] = useState(0);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    
    const BidCard = ({ bid, isOwner, isCompleted }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const msg = String(bid.message || '');
        const showToggle = msg.length > 160;

        const getStatusColor = (status) => {
            const statusColors = {
                pending: '#F59E0B',
                approved: '#3B82F6',
                in_progress: '#8B5CF6',
                completed: '#10B981',
                cancelled: '#EF4444'
            };
            return statusColors[status] || '#6B7280';
        };

        const getStatusText = (status) => {
            const statusTexts = {
                pending: 'Pending',
                approved: 'Approved',
                in_progress: 'In Progress',
                completed: 'Completed',
                cancelled: 'Cancelled'
            };
            return statusTexts[status] || status;
        };

        return (
            <motion.div 
                className="bid-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.3 }}
            >
                <div className="card-glow"></div>
                <div className="bid-head">
                    <div className="avatar-container">
                        <img 
                            className="avatar" 
                            src={isOwner ? (bid?.bidderProfile?.img || '/images/noavtar.jpeg') : (bid?.gig?.cover || '/images/noavtar.jpeg')} 
                            alt={isOwner ? (bid.bidderUsername) : (bid?.gig?.title)}
                        />
                        <div className="online-indicator"></div>
                    </div>
                    <div className="who">
                        {isOwner ? (
                            <a className="name profile-link" href={`/profile/${bid.bidderId}`} target="_blank" rel="noreferrer">
                                {bid.bidderUsername || bid.bidderId}
                            </a>
                        ) : (
                            <div className="name">{bid?.gig?.title || bid.gigId}</div>
                        )}
                        <div className="badges">
                            <div className="badge amount">${bid.amount}</div>
                            <div className="badge days">{bid.days}d</div>
                            <div 
                                className="badge status" 
                                style={{ backgroundColor: `${getStatusColor(bid.status)}20`, color: getStatusColor(bid.status), borderColor: getStatusColor(bid.status) }}
                            >
                                {getStatusText(bid.status)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="price">${bid.amount}</div>
                <div className={`msg ${isExpanded ? 'expanded' : 'clamped'}`}>
                    {msg}
                </div>
                {showToggle && (
                    <button className="read-more" onClick={() => setIsExpanded(v => !v)}>
                        {isExpanded ? 'Read less' : 'Read more'}
                    </button>
                )}
                <div className="actions">
                    {isOwner ? (
                        <>
                            {!isCompleted && bid.status === 'pending' && (
                                <motion.button 
                                    className="approve-btn"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => approveBid(bid._id)}
                                >
                                    {getTranslation('orders.approve', currentLanguage)}
                                </motion.button>
                            )}
                            {!isCompleted && (bid.status === 'in_progress' || bid.status === 'approved') && (
                                <motion.button 
                                    className="complete-btn"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => openComplete(bid)}
                                >
                                    {getTranslation('orders.complete', currentLanguage)}
                                </motion.button>
                            )}
                            <motion.button 
                                className="message-btn"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => messageUser(bid.bidderId)}
                            >
                                💬 Message
                            </motion.button>
                        </>
                    ) : (
                        <>
                            {!isCompleted && (bid.status === 'approved' || bid.status === 'in_progress') && (
                                <span className="working-status">🔄 Working</span>
                            )}
                            <motion.button 
                                className="message-btn"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => messageUser(bid.sellerId)}
                            >
                                💬 Message Owner
                            </motion.button>
                        </>
                    )}
                </div>
            </motion.div>
        );
    };

    const { data: ownerActive, isLoading: loadingOwnerActive, error: errorOwnerActive } = useQuery({
        queryKey: ['owner-active-bids'],
        queryFn: () => newRequest.get('/bids/owner/pending').then(r => r.data),
        enabled: !!currentUser?.isSeller,
    });

    const { data: ownerCompleted, isLoading: loadingOwnerCompleted, error: errorOwnerCompleted } = useQuery({
        queryKey: ['owner-completed-bids'],
        queryFn: () => newRequest.get('/bids/owner/completed').then(r => r.data),
        enabled: !!currentUser?.isSeller,
    });

    const { data: myBids, isLoading: loadingMy, error: errorMy } = useQuery({
        queryKey: ['my-bids-all'],
        queryFn: () => newRequest.get('/bids/me').then(r => r.data),
        enabled: !currentUser?.isSeller,
    });

    const approveBid = async (bidId) => {
        try { 
            await newRequest.post(`/bids/approve/${bidId}`); 
            window.location.reload(); 
        } catch (e) { 
            alert(e?.response?.data || 'Failed to approve bid'); 
        }
    }

    const openComplete = (bid) => { 
        setReviewModal({ 
            open: true, 
            bid, 
            stars: 5, 
            satisfaction: 'excellent', 
            comment: '' 
        }); 
        setHoverStars(0); 
    }

    const submitComplete = async () => {
        const b = reviewModal.bid; 
        try {
            await newRequest.post('/user-reviews', { 
                bidId: b._id, 
                stars: Number(reviewModal.stars), 
                satisfaction: String(reviewModal.satisfaction), 
                comment: reviewModal.comment.trim() || '—' 
            });
            await newRequest.post(`/bids/complete/${b._id}`);
            setReviewModal({ open: false, bid: null, stars: 5, satisfaction: 'excellent', comment: '' });
            window.location.reload();
        } catch (e) { 
            alert(e?.response?.data || 'Failed to submit review/complete'); 
        }
    }

    const messageUser = async (toId) => {
        try {
            const fromId = currentUser._id;
            const convoId = [fromId, toId].sort().join('');
            const res = await newRequest.get(`/conversations/single/${convoId}`);
            window.location.href = `/message/${res.data.id}`;
        } catch (err) {
            if (err?.response?.status === 404) {
                const resCreate = await newRequest.post(`/conversations`, { to: toId });
                window.location.href = `/message/${resCreate.data.id}`;
            } else { 
                alert('Failed to open messages'); 
            }
        }
    }

    const renderOwnerList = (list, isCompleted = false) => (
        <div className="bid-grid">
            {(list || []).map(b => (
                <BidCard key={b._id} bid={b} isOwner={true} isCompleted={isCompleted} />
            ))}
        </div>
    );

    const renderBidderList = (list, isCompleted = false) => (
        <div className="bid-grid">
            {(list || []).filter(b => isCompleted ? b.status === 'completed' : b.status !== 'completed').map(b => (
                <BidCard key={b._id} bid={b} isOwner={false} isCompleted={isCompleted} />
            ))}
        </div>
    );

    const LoadingSkeleton = () => (
        <div className="skeleton-container">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bid-card-skeleton">
                    <div className="skeleton-avatar"></div>
                    <div className="skeleton-content">
                        <div className="skeleton-line short"></div>
                        <div className="skeleton-line medium"></div>
                        <div className="skeleton-line long"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (currentUser?.isSeller) {
        if (loadingOwnerActive || loadingOwnerCompleted) return (
            <div className="orders">
                <div className="container">
                    <div className="title">{getTranslation('orders.loading', currentLanguage)}</div>
                    <LoadingSkeleton />
                </div>
            </div>
        );
        
        if (errorOwnerActive || errorOwnerCompleted) return (
            <div className="orders">
                <div className="container">
                    <div className="error-state">
                        <div className="error-icon">⚠️</div>
                        <h3>{getTranslation('orders.error', currentLanguage)}</h3>
                        <button className="retry-btn" onClick={() => window.location.reload()}>
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );

        const activeList = ownerActive || [];
        const completedList = ownerCompleted || [];
        const list = tab === 'active' ? activeList : completedList;
        const gigEntries = Array.from(new Map(list.map(b => [String(b.gigId || b?.gig?._id || b?.gigId), {
            id: String(b.gigId || b?.gig?._id || b?.gigId),
            title: b?.gig?.title || b.gigTitle || 'Untitled Gig',
            cover: b?.gig?.cover,
        }])).values());
        
        const visible = selectedGigId === 'all' ? list : list.filter(b => String(b.gigId || b?.gig?._id || b?.gigId) === selectedGigId);

        return (
            <div className="orders">
                {/* Mobile Filter Toggle */}
                <div className="mobile-filter-toggle">
                    <motion.button
                        className="filter-btn"
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                        whileTap={{ scale: 0.95 }}
                    >
                        🎛️ Filters
                    </motion.button>
                </div>

                <div className="container split">
                    {/* Sidebar */}
                    <motion.aside 
                        className={`gig-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`}
                        initial={false}
                        animate={{ x: mobileFiltersOpen ? 0 : -300 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="sidebar-background"></div>
                        <div className="sidebar-content">
                            <div className="sidebar-head">
                                <h3>Your Gigs</h3>
                                <button 
                                    className="close-sidebar"
                                    onClick={() => setMobileFiltersOpen(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <button 
                                className={selectedGigId === 'all' ? 'gig-pill active' : 'gig-pill'} 
                                onClick={() => {
                                    setSelectedGigId('all');
                                    setMobileFiltersOpen(false);
                                }}
                            >
                                <span className="pill-icon">📦</span>
                                <span>All gigs</span>
                            </button>
                            {gigEntries.map(g => (
                                <button 
                                    key={g.id} 
                                    className={selectedGigId === g.id ? 'gig-pill active' : 'gig-pill'} 
                                    onClick={() => {
                                        setSelectedGigId(g.id);
                                        setMobileFiltersOpen(false);
                                    }}
                                >
                                    {g.cover && <img src={g.cover} alt="" />}
                                    <span>{g.title}</span>
                                </button>
                            ))}
                            <div className="tabs sidebar-tabs">
                                <button 
                                    className={tab === 'active' ? 'tab active' : 'tab'} 
                                    onClick={() => setTab('active')}
                                >
                                    Active
                                </button>
                                <button 
                                    className={tab === 'completed' ? 'tab active' : 'tab'} 
                                    onClick={() => setTab('completed')}
                                >
                                    Completed
                                </button>
                            </div>
                        </div>
                    </motion.aside>

                    {/* Main Content */}
                    <main className="bids-main">
                        <div className="title">
                            <h1>{getTranslation('orders.title.bids', currentLanguage)}</h1>
                            <div className="results-count">
                                {visible.length} {visible.length === 1 ? 'result' : 'results'}
                            </div>
                        </div>
                        
                        {visible.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📭</div>
                                <h3>No bids found</h3>
                                <p>There are no {tab} bids for the selected criteria.</p>
                            </div>
                        ) : (
                            <div className="bid-grid">
                                {visible.map(b => (
                                    <BidCard key={b._id} bid={b} isOwner={true} isCompleted={tab === 'completed'} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>

                {/* Review Modal */}
                <AnimatePresence>
                    {reviewModal.open && (
                        <motion.div 
                            className="bid-modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setReviewModal({ ...reviewModal, open: false })}
                        >
                            <motion.div 
                                className="bid-modal"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3>Complete Gig & Review</h3>
                                <p className="sub">Rate your experience and leave a short comment before completing.</p>
                                
                                <div className="bid-field">
                                    <label>Rating</label>
                                    <div className="stars-select" onMouseLeave={() => setHoverStars(0)}>
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <motion.span 
                                                key={n} 
                                                className={`star ${(hoverStars || reviewModal.stars) >= n ? 'filled' : ''}`}
                                                onMouseEnter={() => setHoverStars(n)}
                                                onClick={() => setReviewModal({ ...reviewModal, stars: n })}
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                ★
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="bid-field">
                                    <label>Satisfaction</label>
                                    <select 
                                        value={reviewModal.satisfaction} 
                                        onChange={e => setReviewModal({ ...reviewModal, satisfaction: e.target.value })}
                                    >
                                        <option value="poor">Poor</option>
                                        <option value="fair">Fair</option>
                                        <option value="good">Good</option>
                                        <option value="very_good">Very Good</option>
                                        <option value="excellent">Excellent</option>
                                    </select>
                                </div>
                                
                                <div className="bid-field">
                                    <label>Comment</label>
                                    <textarea 
                                        rows={5} 
                                        value={reviewModal.comment} 
                                        onChange={e => setReviewModal({ ...reviewModal, comment: e.target.value })} 
                                        placeholder="Share your experience working with this bidder"
                                    />
                                </div>
                                
                                <div className="bid-actions">
                                    <motion.button 
                                        className="secondary"
                                        onClick={() => setReviewModal({ ...reviewModal, open: false })}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button 
                                        className="primary"
                                        onClick={submitComplete}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Submit & Complete
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Overlay */}
                {mobileFiltersOpen && (
                    <motion.div 
                        className="sidebar-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileFiltersOpen(false)}
                    />
                )}
            </div>
        );
    }

    // Non-seller view
    if (loadingMy) return (
        <div className="orders">
            <div className="container">
                <div className="title">{getTranslation('orders.loading', currentLanguage)}</div>
                <LoadingSkeleton />
            </div>
        </div>
    );
    
    if (errorMy) return (
        <div className="orders">
            <div className="container">
                <div className="error-state">
                    <div className="error-icon">⚠️</div>
                    <h3>{getTranslation('orders.error', currentLanguage)}</h3>
                    <button className="retry-btn" onClick={() => window.location.reload()}>
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="orders">
            <div className="container">
                <div className="title">
                    <h1>{getTranslation('orders.title.myBids', currentLanguage)}</h1>
                </div>
                
                <div className="tabs">
                    <motion.button 
                        className={tab === 'active' ? 'tab active' : 'tab'} 
                        onClick={() => setTab('active')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Active
                    </motion.button>
                    <motion.button 
                        className={tab === 'completed' ? 'tab active' : 'tab'} 
                        onClick={() => setTab('completed')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Completed
                    </motion.button>
                </div>
                
                {tab === 'active' ? renderBidderList(myBids, false) : renderBidderList(myBids, true)}
            </div>
        </div>
    );
}

export default Orders;