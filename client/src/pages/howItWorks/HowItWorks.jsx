import React from "react";
import './howItWorks.scss';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();
  return (
    <div className="how">
      <div className="hero">
        <div className="wrap">
          <div className="icon">🎯</div>
          <h1>How Essay Shop Works</h1>
          <p className="sub">A simple, transparent workflow for creators and bidders – from posting to completion.</p>
          <div className="cta">
            <button className="ghost" onClick={()=>navigate('/gigs')}>Browse Gigs</button>
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="badge">For Gig Creators</div>
          <h2>Post your project in minutes</h2>
          <ul>
            <li><span>📝</span><div><strong>Create</strong> a gig with a clear title, category, detailed description, budget range, and delivery time.</div></li>
            <li><span>📥</span><div><strong>Receive bids</strong> from qualified bidders. Each bid includes price, days, and a proposal message.</div></li>
            <li><span>✅</span><div><strong>Approve</strong> one or more bidders to start – the gig moves to <em>In Progress</em>.</div></li>
            <li><span>💬</span><div><strong>Message</strong> selected bidders to align on details; all messages are kept in your inbox.</div></li>
            <li><span>🏁</span><div><strong>Complete</strong> the gig when satisfied. Leave a star rating and satisfaction review to build reputation.</div></li>
          </ul>
        </div>

        <div className="card">
          <div className="badge purple">For Bidders</div>
          <h2>Find work. Bid. Deliver.</h2>
          <ul>
            <li><span>🔎</span><div><strong>Discover gigs</strong> by browsing categories or searching keywords.</div></li>
            <li><span>💰</span><div><strong>Place a bid</strong> within the creator’s price range and delivery time. Share a thoughtful proposal (≥100 chars).</div></li>
            <li><span>🚀</span><div><strong>Start working</strong> once approved. Collaborate via messages and deliver as agreed.</div></li>
            <li><span>⭐</span><div><strong>Get rated</strong> after completion – great performance boosts your profile and future success.</div></li>
          </ul>
        </div>

        <div className="card">
          <div className="badge blue">Best Practices</div>
          <h2>Tips for success</h2>
          <ul>
            <li><span>🧭</span><div>Write clear, scannable gig descriptions. Be explicit about scope and outcomes.</div></li>
            <li><span>📆</span><div>Choose realistic timelines. Over‑deliver rather than over‑promise.</div></li>
            <li><span>🧩</span><div>Keep communication inside Essay Shop messages for clarity and safety.</div></li>
            <li><span>🔒</span><div>Only mark Complete when you’re satisfied. Reviews help the whole community.</div></li>
          </ul>
        </div>
      </div>

      <div className="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="items">
          <div className="item">
            <h3>Can I approve multiple bidders?</h3>
            <p>Yes. Approve one or more bidders to work in parallel. The gig status becomes <em>In Progress</em> until you complete it.</p>
          </div>
          <div className="item">
            <h3>How do payments work?</h3>
            <p>Creators define budget ranges; bidders propose within that range. Use your preferred payment flow outside this demo or integrate a gateway.</p>
          </div>
          <div className="item">
            <h3>What happens after completion?</h3>
            <p>The gig moves to the Completed tab. Creators leave a star rating and satisfaction review that shows on the bidder’s profile.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
