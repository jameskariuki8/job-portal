import React, { useState } from "react";
import './gigCard.scss'
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";

const GigCard = ({ item }) => {
    const { isLoading, error, data } = useQuery({
        queryKey: [`${item.userId}`],
        queryFn: () =>
            newRequest.get(`/users/${item.userId}`)
                .then((res) => {
                    return res.data;
                })
            })
    const [expanded, setExpanded] = useState(false);
    const [coverIsDoc, setCoverIsDoc] = useState(!(/\.(png|jpe?g|gif|webp|svg)$/i.test(item.cover || '')));
    const currentUser = getCurrentUser();
    const initialLiked = Array.isArray(item.likedBy) && currentUser ? item.likedBy.includes(currentUser._id) : false;
    const [liked, setLiked] = useState(initialLiked);
    const [likesCount, setLikesCount] = useState(Array.isArray(item.likedBy) ? item.likedBy.length : 0);
    const descText = item.desc || '';
    const maxChars = 120;
    const showToggle = descText.length > maxChars;
    const preview = showToggle ? descText.slice(0, maxChars) + '...' : descText;

    return ([
        <Link to={`/gig/${item._id}`} className="link">
            <div className="gigCard ">
                {coverIsDoc ? (
                    <div className="doc-preview">
                        <div className="doc-icon">📄</div>
                        <div className="doc-actions">
                            <a href={/\.pdf$/i.test(item.cover||'') ? item.cover : `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(item.cover||'')}`} target="_blank" rel="noreferrer">View</a>
                            <a href={item.cover} download style={{marginLeft:12}}>Download</a>
                        </div>
                    </div>
                ) : (
                    <img src={item.cover} alt="" onError={()=>setCoverIsDoc(true)} />
                )}
                <div className="info">
                    {isLoading ? "loading" : error ? "something wrong" : <div className="user">
                        <img src={data.img || '/images/noavtar.jpeg'} alt="" />
                        <span>{data.username}</span>
                    </div>}
                    <div className="category">
                        <span>{item.cat}</span>
                    </div>
                    <p className={expanded ? 'desc expanded' : 'desc'}>
                        {expanded ? descText : preview}
                    </p>
                    {showToggle && (
                        <button className="readmore" onClick={(e)=>{ e.preventDefault(); setExpanded(!expanded); }}>
                            {expanded ? 'Show less' : 'Read more'}
                        </button>
                    )}
                    <div className="star">
                        <img src="/images/star.png" alt="" />
                        <span>
                            {!isNaN(item.totalStars / item.starNumber) &&
                                Math.round(item.totalStars / item.starNumber)}
                        </span>
                    </div>
                </div>
                <hr />
                <div className="details">
                    <button
                        className={`like-btn${liked ? ' liked' : ''}`}
                        onClick={async (e)=>{
                            e.preventDefault();
                            e.stopPropagation();
                            try {
                                const res = await newRequest.post(`/gigs/${item._id}/like`);
                                setLiked(Boolean(res.data?.liked));
                                setLikesCount(Number(res.data?.likes || 0));
                            } catch(err){
                                console.log(err);
                            }
                        }}
                        title="Like"
                    >
                        <img
                            src="/images/heart.png"
                            alt="like"
                            style={liked ? { filter: 'invert(16%) sepia(95%) saturate(7459%) hue-rotate(1deg) brightness(90%) contrast(120%)' } : undefined}
                        />
                        <span className="likes-count">{likesCount}</span>
                    </button>
                    <div className="price">
                        {(Number(item.pages||0) * Number(item.pricePerPage||0)) > 0 && (
                            <div className="total-price">Total: ${Number(item.pages||0) * Number(item.pricePerPage||0)}</div>
                        )}
                        {item.pricePerPage > 0 && item.pages > 0 && (
                            <div className="per-page">${item.pricePerPage}/page · {item.pages} pages</div>
                        )}
                        {item.discountEnabled && item.discountAmount > 0 ? (
                            <div className="discount-wrap">
                                <button className="discount-btn" title={`Discount: $${item.discountAmount}${item.discountCondition ? ` — ${item.discountCondition}` : ''}`}>
                                    Discount
                                </button>
                                <div className="discount-tooltip">
                                    <div className="tooltip-title">Discount</div>
                                    <div className="tooltip-body">${item.discountAmount}{item.discountCondition ? ` — ${item.discountCondition}` : ''}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="no-discount">No discount</div>
                        )}
                    </div>
                    {item.status && item.status !== 'available' && (
                        <div className="status-badge">
                            <span className={`status ${item.status}`}>
                                {item.status === 'in_progress' ? 'In Progress' : 'Completed'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    ]);
}
export default GigCard;