import React, { useState } from "react";
import './Gig.scss';
import { Slider } from "infinite-react-carousel";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate, useParams } from "react-router-dom";
import getCurrentUser from "../../utils/getCurrentUser";
 

const Gig = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showBidModal, setShowBidModal] = useState(false);
    const [bidAmount, setBidAmount] = useState(0);
    const [bidDays, setBidDays] = useState(1);
    const [bidMessage, setBidMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    
    
    const { isLoading, error, data } = useQuery({
        queryKey: ['gig'],
        queryFn: () =>
            newRequest.get(`/gigs/single/${id}`)
                .then((res) => res.data)
    });
    
    const userId = data?.userId;
    const { isLoading: isLoadingUser, error: errorUser, data: dataUser } = useQuery({
        queryKey: ['user'],
        queryFn: () =>
            newRequest.get(`/users/${userId}`)
                .then((res) => res.data),
        enabled: !!userId,
    });

    const { data: bidCount } = useQuery({
        queryKey: ['bid-count', id],
        queryFn: () => newRequest.get(`/bids/gig/${id}/count`).then(r => r.data?.count || 0),
        enabled: !!id,
    });

    const currentUser = getCurrentUser();
    const isOwner = currentUser && data && currentUser._id === data.userId;

    // Fetch my bids for this gig (to derive button state)
    const { data: myBids } = useQuery({
        queryKey: ['my-bids', id],
        queryFn: () => newRequest.get(`/bids/my/gig/${id}`).then(r => r.data),
        enabled: !!currentUser && !!id && !isOwner,
        retry: false,
    });

    const pendingBid = myBids && myBids.find(b => b.status === 'pending');
    const approvedBid = myBids && (myBids.find(b => b.status === 'approved' || b.status === 'in_progress'));

    const openBidModal = () => {
        if (!currentUser) return alert('Please login to place a bid');
        if (isOwner) return alert('You cannot bid on your own gig');
        const total = Number(data.pages || 0) * Number(data.pricePerPage || 0);
        const fallback = Number(data.priceMin || 0) > 0 ? Number(data.priceMin) : 1;
        setBidAmount(total > 0 ? total : fallback);
        setBidDays(Math.min(1, data.deliveryTime));
        setBidMessage("");
        setShowBidModal(true);
    };

    const submitBid = async () => {
        // Ensure a positive amount even if total price isn't configured
        let amountToSend = Number(bidAmount);
        if (!(amountToSend > 0)) {
            const total = Number(data.pages || 0) * Number(data.pricePerPage || 0);
            const fallback = Number(data.priceMin || 0) > 0 ? Number(data.priceMin) : 1;
            amountToSend = total > 0 ? total : fallback;
            setBidAmount(amountToSend);
        }
        if (bidDays < 1 || bidDays > data.deliveryTime) {
            return alert(`Days must be between 1 and ${data.deliveryTime}`);
        }
        if (!bidMessage || bidMessage.trim().length < 100) {
            return alert('Proposal must be at least 100 characters');
        }
        setSubmitting(true);
        try {
            await newRequest.post('/bids', { gigId: id, amount: amountToSend, days: Number(bidDays), message: bidMessage.trim() });
            setShowBidModal(false);
            window.location.reload();
        } catch (e) {
            alert(e?.response?.data || 'Failed to place bid');
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) return <div className="gig-loading"><div className="loader"></div></div>;
    if (error) return <div className="gig-error"><h4>Something Went Wrong</h4></div>;

    return (
        <div className="gig">
            <div className="gig-header">
                <div className="container">
                    <nav className="breadcrumb-nav">
                        <span className="breadcrumbs">JOB PORTAL &gt; {data.cat} &gt;</span>
                    </nav>
                    
                    <div className="gig-title-section">
                        <h1 className="gig-title">{data.title}</h1>
                        <div className="gig-category-badge">
                            <span className="category-icon">🏷️</span>
                            <span>{data.cat}</span>
                        </div>
                    </div>

                    {!isLoadingUser && !errorUser && (
                        <div className="seller-preview">
                            <div className="seller-avatar">
                                <img src={dataUser.img || "/images/noavtar.jpeg"} alt={dataUser.username} />
                            </div>
                            <div className="seller-info">
                                <h3 className="seller-name">{dataUser.username}</h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="gig-content">
                <div className="container">
                    <div className="gig-main">
                        <div className="gig-gallery">
                            {data.images && data.images.length > 0 && (
                                <div className="image-slider-container">
                                    <Slider slideToShow={1} arrowsScroll={1} className="image-slider">
                                        {data.images.map((src, index) => (
                                            <div key={index} className="slide">
                                                {/\.(png|jpe?g|gif|webp|svg)$/i.test(src || '') ? (
                                                    <img src={src} alt={`Gig image ${index + 1}`} />
                                                ) : (
                                                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:300,background:'#f8fafc',border:'1px solid #f1f3f5', borderRadius:8}}>
                                                        <div style={{fontSize:56}}>📄</div>
                                                        <div style={{marginTop:8,display:'flex',gap:12}}>
                                                            <a href={/\.pdf$/i.test(src) ? src : `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(src)}`} target="_blank" rel="noreferrer" style={{fontWeight:700,color:'#0b4f71',textDecoration:'none'}}>View</a>
                                                            <a href={src} download style={{fontWeight:700,color:'#0b4f71',textDecoration:'none'}}>Download</a>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                        </Slider>
                                </div>
                            )}
                        </div>

                        <div className="gig-description-section">
                            <div className="section-header">
                                <h2>About This Gig</h2>
                                <div className="section-icon">📋</div>
                            </div>
                            <div className="description-content">
                                <p>{data.desc}</p>
                            </div>
                        </div>

                        {data.hasDocument && (
                            <div className="gig-document-section">
                                <div className="section-header">
                                    <h2>Attached Document</h2>
                                    <div className="section-icon">📄</div>
                                </div>
                                <div className="document-actions">
                                    <a className="doc-btn" href={`/api/gigs/${id}/document`} target="_blank" rel="noreferrer">View</a>
                                    <a className="doc-btn secondary" href={`/api/gigs/${id}/document`} download>Download</a>
                                </div>
                                <p className="doc-note">Please review this document before placing a bid.</p>
                            </div>
                        )}

                        {!isLoadingUser && !errorUser && (
                            <div className="seller-details-section">
                                <div className="section-header">
                            <h2>About The Seller</h2>
                                    <div className="section-icon">👤</div>
                                </div>
                                
                                <div className="seller-card">
                                    <div className="seller-header">
                                        <div className="seller-avatar-large">
                                            <img src={dataUser.img || "/images/noavtar.jpeg"} alt={dataUser.username} />
                                        </div>
                                        <div className="seller-details">
                                            <h3 className="seller-name-large">{dataUser.username}</h3>
                                    {!isOwner && (
                                                <button 
                                                    className="contact-seller-btn"
                                                    onClick={async () => {
                                            if (!currentUser) {
                                                return alert('Please login to contact the seller');
                                            }
                                            const sellerId = data.userId;
                                            const buyerId = currentUser._id;
                                            const convoId = [sellerId, buyerId].sort().join('');
                                            try {
                                                const res = await newRequest.get(`/conversations/single/${convoId}`);
                                                navigate(`/message/${res.data.id}`);
                                            } catch (err) {
                                                if (err?.response?.status === 404) {
                                                    try {
                                                        const resCreate = await newRequest.post(`/conversations`, { to: sellerId });
                                                        navigate(`/message/${resCreate.data.id}`);
                                                    } catch (e) {
                                                        alert(e?.response?.data || 'Failed to start conversation');
                                                    }
                                                } else {
                                                    alert(err?.response?.data || 'Failed to open conversation');
                                                }
                                            }
                                                    }}
                                                >
                                                    <span className="btn-icon">💬</span>
                                                    Contact Seller
                                                </button>
                                    )}
                                </div>
                                    </div>
                                    
                                    <div className="seller-stats">
                                        <div className="stat-item">
                                            <div className="stat-icon">🌍</div>
                                            <div className="stat-content">
                                                <span className="stat-label">From</span>
                                                <span className="stat-value">{dataUser.country || 'Not specified'}</span>
                                            </div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-icon">📅</div>
                                            <div className="stat-content">
                                                <span className="stat-label">Member since</span>
                                                <span className="stat-value">Aug 2022</span>
                                            </div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-icon">⏱️</div>
                                            <div className="stat-content">
                                                <span className="stat-label">Avg. response time</span>
                                                <span className="stat-value">4 hours</span>
                                            </div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-icon">🚀</div>
                                            <div className="stat-content">
                                                <span className="stat-label">Last delivery</span>
                                                <span className="stat-value">1 day</span>
                                            </div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="stat-icon">🗣️</div>
                                            <div className="stat-content">
                                                <span className="stat-label">Languages</span>
                                                <span className="stat-value">English</span>
                                    </div>
                                    </div>
                                    </div>
                                    
                                    {dataUser.desc && (
                                        <div className="seller-bio">
                                            <h4>Bio</h4>
                                            <p>{dataUser.desc}</p>
                                    </div>
                                    )}
                                    </div>
                                </div>
                        )}

                        {/* Reviews moved to modal; open via button */}
                    </div>

                    <div className="gig-sidebar">
                        <div className="pricing-card">
                            <div className="price-header">
                                <h3 className="price-title">Total Price</h3>
                                <div className="price-amount">
                                    <span className="currency">$</span>
                                    <span className="amount">{Number(data.pages||0) * Number(data.pricePerPage||0)}</span>
                                </div>
                            </div>
                            
                            <div className="delivery-info">
                                <div className="delivery-item">
                                    <div className="delivery-icon">⏰</div>
                                    <div className="delivery-details">
                                        <span className="delivery-label">Delivery Time</span>
                                        <span className="delivery-value">{data.deliveryTime} days</span>
                                    </div>
                                </div>
                                {data.pricePerPage > 0 && (
                                    <div className="delivery-item">
                                        <div className="delivery-icon">📄</div>
                                        <div className="delivery-details">
                                            <span className="delivery-label">Price per page</span>
                                            <span className="delivery-value">${data.pricePerPage}</span>
                                        </div>
                                    </div>
                                )}
                                {data.pages > 0 && (
                                    <div className="delivery-item">
                                        <div className="delivery-icon">📑</div>
                                        <div className="delivery-details">
                                            <span className="delivery-label">Pages</span>
                                            <span className="delivery-value">{data.pages}</span>
                                        </div>
                                    </div>
                                )}
                                {data.discountEnabled && data.discountAmount > 0 && (
                                    <div className="delivery-item">
                                        <div className="delivery-icon">🏷️</div>
                                        <div className="delivery-details">
                                            <span className="delivery-label">Discount</span>
                                            <span className="delivery-value">Discount ${data.discountAmount}{data.discountCondition ? ` — ${data.discountCondition}` : ''}</span>
                                        </div>
                                    </div>
                                )}
                                
                                {data.status && data.status !== 'available' && (
                                    <div className="delivery-item">
                                        <div className="delivery-icon">📊</div>
                                        <div className="delivery-details">
                                            <span className="delivery-label">Status</span>
                                            <span className={`delivery-value status-${data.status}`}>
                                                {data.status === 'in_progress' ? 'In Progress' : 'Completed'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                        </div>

                            <div className="bid-metrics">
                                <div className="metric">
                                    <span className="metric-icon">👥</span>
                                    <span className="metric-label">Bids</span>
                                    <span className="metric-value">{bidCount || 0}</span>
                                </div>
                            </div>

                            <div className="action-buttons">
                        {isOwner ? (
                                    <button className="view-bids-btn" onClick={()=>navigate('/orders')}>
                                        <span className="btn-icon">👥</span>
                                        View Bids
                                    </button>
                        ) : approvedBid ? (
                                    <button className="approved-btn" disabled>
                                        <span className="btn-icon">✅</span>
                                        Approved — start working
                                    </button>
                        ) : pendingBid ? (
                                    <button className="pending-btn" disabled>
                                        <span className="btn-icon">⏳</span>
                                        Pending approval
                                    </button>
                                ) : (
                                    <button className="bid-btn" onClick={openBidModal}>
                                        <span className="btn-icon">💰</span>
                                        Place Bid
                                    </button>
                                )}
                                
                            </div>
                        </div>
                        
                        {/* Owner management disabled on gig page; status is read-only in sidebar */}
                    </div>
                </div>
            </div>

            {showBidModal && (
                <div className="bid-modal-overlay" onClick={() => setShowBidModal(false)}>
                    <div className="bid-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Place Your Bid</h3>
                        {/* Amount is auto-calculated from total price; hidden from the form */}
                        <div className="bid-field">
                            <label>Days (1-{data.deliveryTime})</label>
                            <input type="number" value={bidDays} min={1} max={data.deliveryTime} onChange={(e)=>setBidDays(Number(e.target.value))} />
                        </div>
                        <div className="bid-field">
                            <label>Proposal (min 100 characters)</label>
                            <textarea value={bidMessage} onChange={(e)=>setBidMessage(e.target.value)} rows={6} placeholder="Describe your approach, scope, and timeline in detail..." />
                            <div className="chars-counter">{bidMessage.length}/100</div>
                        </div>
                        <div className="bid-actions">
                            <button className="secondary" onClick={()=>setShowBidModal(false)}>Cancel</button>
                            <button className="primary" disabled={submitting} onClick={submitBid}>{submitting ? 'Submitting...' : 'Submit Bid'}</button>
                        </div>
                        <div className="bid-hint">Your bid must be within the gig range and delivery time.</div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Gig;