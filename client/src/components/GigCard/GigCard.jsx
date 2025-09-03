import React, { useState } from "react";
import './gigCard.scss'
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

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
    const descText = item.desc || '';
    const maxChars = 120;
    const showToggle = descText.length > maxChars;
    const preview = showToggle ? descText.slice(0, maxChars) + '...' : descText;

    return ([
        <Link to={`/gig/${item._id}`} className="link">
            <div className="gigCard ">
                <img src={item.cover} alt="" />
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
                    <img src="/images/heart.png" alt="" />
                    <div className="price">
                        <span>STARTING AT</span>
                        <h2>$ {item.priceMin} - ${item.priceMax}</h2>
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