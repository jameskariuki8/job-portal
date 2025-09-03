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
                <div key={b._id} className="bid-card">
                    <div className="bid-head">
                        <img className="avatar" src={b?.bidderProfile?.img || '/images/noavtar.jpeg'} alt={b.bidderUsername}/>
                        <div className="who">
                            <a className="name profile-link" href={`/profile/${b.bidderId}`} target="_blank" rel="noreferrer">{b.bidderUsername || b.bidderId}</a>
                            <div className="meta" style={{fontWeight:700}}>{b?.gig?.title || b.gigId}</div>
                            <div className="badges">
                                <div className="badge">${b.amount}</div>
                                <div className="badge">{b.days}d</div>
                                <div className="badge">{b.status}</div>
                            </div>
                        </div>
                    </div>
                    <div className="price">${b.amount}</div>
                    <div className="msg">{b.message}</div>
                    <div className="actions">
                        {!isCompleted && b.status === 'pending' && (<button className="approve-btn" onClick={()=>approveBid(b._id)}>{getTranslation('orders.approve', currentLanguage)}</button>)}
                        {!isCompleted && (b.status === 'in_progress' || b.status === 'approved') && (<button className="complete-btn" onClick={()=>openComplete(b)}>{getTranslation('orders.complete', currentLanguage)}</button>)}
                        <button className="approve-btn" style={{background:'#446ee7'}} onClick={()=>messageUser(b.bidderId)}>Message</button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderBidderList = (list, isCompleted=false) => (
        <div className="bid-grid">
            {(list || []).filter(b => isCompleted ? b.status==='completed' : b.status!=='completed').map(b => (
                <div key={b._id} className="bid-card">
                    <div className="bid-head">
                        <img className="avatar" src={b?.gig?.cover || '/images/noavtar.jpeg'} alt={b?.gig?.title}/>
                        <div className="who">
                            <div className="name">{b?.gig?.title || b.gigId}</div>
                            <div className="badges">
                                <div className="badge">${b.amount}</div>
                                <div className="badge">{b.days}d</div>
                                <div className="badge">{b.status}</div>
                            </div>
                        </div>
                    </div>
                    <div className="price">${b.amount}</div>
                    <div className="msg">{b.message}</div>
                    <div className="actions">
                        {!isCompleted && (b.status === 'approved' || b.status === 'in_progress') && (
                            <span>Working</span>
                        )}
                        <button className="approve-btn" style={{background:'#446ee7'}} onClick={()=>messageUser(b.sellerId)}>Message Owner</button>
                    </div>
                </div>
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