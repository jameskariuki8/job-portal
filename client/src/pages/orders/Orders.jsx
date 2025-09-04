import React, { useState } from "react";
import './orders.scss';
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations/translations";
const Orders = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const { currentLanguage } = useLanguage();

    const [tab, setTab] = useState('active');
    const [reviewModal, setReviewModal] = useState({ open: false, bid: null, stars: 5, satisfaction: 'excellent', comment: '' });
    const [hoverStars, setHoverStars] = useState(0);
    
    const BidCard = ({ bid, isOwner, isCompleted }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const msg = String(bid.message || '');
        const showToggle = msg.length > 160;
        return (
            <div className="bid-card">
                <div className="bid-head">
                    <img className="avatar" src={isOwner ? (bid?.bidderProfile?.img || '/images/noavtar.jpeg') : (bid?.gig?.cover || '/images/noavtar.jpeg')} alt={isOwner ? (bid.bidderUsername) : (bid?.gig?.title)}/>
                    <div className="who">
                        {isOwner ? (
                            <a className="name profile-link" href={`/profile/${bid.bidderId}`} target="_blank" rel="noreferrer">{bid.bidderUsername || bid.bidderId}</a>
                        ) : (
                            <div className="name">{bid?.gig?.title || bid.gigId}</div>
                        )}
                        <div className="badges">
                            <div className="badge">${bid.amount}</div>
                            <div className="badge">{bid.days}d</div>
                            <div className="badge">{bid.status}</div>
                        </div>
                    </div>
                </div>
                <div className="price">${bid.amount}</div>
                <div className={isExpanded ? 'msg expanded' : 'msg clamped'}>
                    {msg}
                </div>
                {showToggle && (
                    <button className="read-more" onClick={() => setIsExpanded(v=>!v)}>
                        {isExpanded ? 'Read less' : 'Read more'}
                    </button>
                )}
                <div className="actions">
                    {isOwner ? (
                        <>
                            {!isCompleted && bid.status === 'pending' && (<button className="approve-btn" onClick={()=>approveBid(bid._id)}>{getTranslation('orders.approve', currentLanguage)}</button>)}
                            {!isCompleted && (bid.status === 'in_progress' || bid.status === 'approved') && (<button className="complete-btn" onClick={()=>openComplete(bid)}>{getTranslation('orders.complete', currentLanguage)}</button>)}
                            <button className="approve-btn" style={{background:'#446ee7'}} onClick={()=>messageUser(bid.bidderId)}>Message</button>
                        </>
                    ) : (
                        <>
                            {!isCompleted && (bid.status === 'approved' || bid.status === 'in_progress') && (
                                <span>Working</span>
                            )}
                            <button className="approve-btn" style={{background:'#446ee7'}} onClick={()=>messageUser(bid.sellerId)}>Message Owner</button>
                        </>
                    )}
                </div>
            </div>
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
        try { await newRequest.post(`/bids/approve/${bidId}`); window.location.reload(); } catch (e) { alert(e?.response?.data || 'Failed to approve bid'); }
    }

    const openComplete = (bid) => { setReviewModal({ open: true, bid, stars: 5, satisfaction: 'excellent', comment: '' }); setHoverStars(0); }
    const submitComplete = async () => {
        const b = reviewModal.bid; try {
            await newRequest.post('/user-reviews', { bidId: b._id, stars: Number(reviewModal.stars), satisfaction: String(reviewModal.satisfaction), comment: reviewModal.comment.trim() || '—' });
            await newRequest.post(`/bids/complete/${b._id}`);
            setReviewModal({ open: false, bid: null, stars: 5, satisfaction: 'excellent', comment: '' });
            window.location.reload();
        } catch (e) { alert(e?.response?.data || 'Failed to submit review/complete'); }
    }

    const messageUser = async (toId) => {
        try {
            const fromId = currentUser._id;
            const convoId = fromId + toId;
            const res = await newRequest.get(`/conversations/single/${convoId}`);
            window.location.href = `/message/${res.data.id}`;
        } catch (err) {
            if (err?.response?.status === 404) {
                const resCreate = await newRequest.post(`/conversations`, { to: toId });
                window.location.href = `/message/${resCreate.data.id}`;
            } else { alert('Failed to open messages'); }
        }
    }

    const renderOwnerList = (list, isCompleted=false) => (
        <div className="bid-grid">
            {(list || []).map(b => (
                <BidCard key={b._id} bid={b} isOwner={true} isCompleted={isCompleted} />
            ))}
        </div>
    );

    const renderBidderList = (list, isCompleted=false) => (
        <div className="bid-grid">
            {(list || []).filter(b => isCompleted ? b.status==='completed' : b.status!=='completed').map(b => (
                <BidCard key={b._id} bid={b} isOwner={false} isCompleted={isCompleted} />
            ))}
        </div>
    );

    if (currentUser?.isSeller) {
        if (loadingOwnerActive || loadingOwnerCompleted) return <div className="orders"><div className="container"><div className="title">{getTranslation('orders.loading', currentLanguage)}</div></div></div>;
        if (errorOwnerActive || errorOwnerCompleted) return <div className="orders"><div className="container"><div className="title">{getTranslation('orders.error', currentLanguage)}</div></div></div>;
        return (
            <div className="orders">
                <div className="container">
                    <div className="title"><h1>{getTranslation('orders.title.bids', currentLanguage)}</h1></div>
                    <div className="tabs" style={{display:'flex', gap:12, marginBottom:16}}>
                        <button className={tab==='active'?'tab active':'tab'} onClick={()=>setTab('active')}>Active</button>
                        <button className={tab==='completed'?'tab active':'tab'} onClick={()=>setTab('completed')}>Completed</button>
                    </div>
                    {tab==='active' ? renderOwnerList(ownerActive,false) : renderOwnerList(ownerCompleted,true)}
                </div>

                {reviewModal.open && (
                    <div className="bid-modal-overlay" onClick={()=>setReviewModal({ ...reviewModal, open:false })}>
                        <div className="bid-modal" onClick={(e)=>e.stopPropagation()}>
                            <h3>Complete Gig & Review</h3>
                            <p className="sub">Rate your experience and leave a short comment before completing.</p>
                            <div className="bid-field">
                                <label>Rating</label>
                                <div className="stars-select" onMouseLeave={()=>setHoverStars(0)}>
                                    {[1,2,3,4,5].map(n => (
                                        <span key={n} className={`star ${(hoverStars || reviewModal.stars) >= n ? 'filled' : ''}`} onMouseEnter={()=>setHoverStars(n)} onClick={()=>setReviewModal({ ...reviewModal, stars: n })}>★</span>
                                    ))}
                                </div>
                            </div>
                            <div className="bid-field">
                                <label>Satisfaction</label>
                                <select value={reviewModal.satisfaction} onChange={e=>setReviewModal({ ...reviewModal, satisfaction: e.target.value })}>
                                    <option value="poor">Poor</option>
                                    <option value="fair">Fair</option>
                                    <option value="good">Good</option>
                                    <option value="very_good">Very Good</option>
                                    <option value="excellent">Excellent</option>
                                </select>
                            </div>
                            <div className="bid-field">
                                <label>Comment</label>
                                <textarea rows={5} value={reviewModal.comment} onChange={e=>setReviewModal({ ...reviewModal, comment: e.target.value })} placeholder="Share your experience working with this bidder"/>
                            </div>
                            <div className="bid-actions">
                                <button className="secondary" onClick={()=>setReviewModal({ ...reviewModal, open:false })}>Cancel</button>
                                <button className="primary" onClick={submitComplete}>Submit & Complete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (loadingMy) return <div className="orders"><div className="container"><div className="title">{getTranslation('orders.loading', currentLanguage)}</div></div></div>;
    if (errorMy) return <div className="orders"><div className="container"><div className="title">{getTranslation('orders.error', currentLanguage)}</div></div></div>;

    return (
        <div className="orders">
            <div className="container">
                <div className="title"><h1>{getTranslation('orders.title.myBids', currentLanguage)}</h1></div>
                <div className="tabs" style={{display:'flex', gap:12, marginBottom:16}}>
                    <button className={tab==='active'?'tab active':'tab'} onClick={()=>setTab('active')}>Active</button>
                    <button className={tab==='completed'?'tab active':'tab'} onClick={()=>setTab('completed')}>Completed</button>
                </div>
                {tab==='active' ? renderBidderList(myBids,false) : renderBidderList(myBids,true)}
            </div>
        </div>
    );
}
export default Orders;