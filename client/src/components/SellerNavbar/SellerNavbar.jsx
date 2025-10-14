import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './sellerNavbar.scss';
import newRequest from '../../utils/newRequest';

const SellerNavbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    const handleLogout = async () => {
        try {
            await newRequest.post('/auth/logout');
        } catch (e) {
            // ignore
        } finally {
            localStorage.removeItem('currentUser');
            navigate('/');
            window.location.reload();
        }
    };

    return (
        <header className="seller-navbar">
            <div className="inner">
                <div className="left">
                    <button className={menuOpen ? 'hamburger open' : 'hamburger'} onClick={()=>setMenuOpen(v=>!v)} aria-label="Toggle menu">
                        <span></span><span></span><span></span>
                    </button>
                    <Link to="/seller/dashboard" className="brand" onClick={()=>setMenuOpen(false)}>
                        <span className="logo">⚡</span>
                        <span className="title">Seller Hub</span>
                    </Link>
                </div>

                <nav className={menuOpen ? 'nav open' : 'nav'}>
                    <NavLink to="/seller/dashboard" className="navlink" onClick={()=>setMenuOpen(false)}>Dashboard</NavLink>
                    <NavLink to="/seller/mygigs" className="navlink" onClick={()=>setMenuOpen(false)}>My Gigs</NavLink>
                    <NavLink to="/seller/add" className="navlink" onClick={()=>setMenuOpen(false)}>Add Gig</NavLink>
                    <NavLink to="/seller/orders" className="navlink" onClick={()=>setMenuOpen(false)}>Orders</NavLink>
                    <NavLink to="/seller/messages" className="navlink" onClick={()=>setMenuOpen(false)}>Messages</NavLink>
                </nav>

                <div className="right">
                    <button className="iconbtn" title="Notifications">🔔</button>
                    <div className="user" onClick={()=>setMenuOpen(false)}>
                        <img src={currentUser?.img || '/images/noavtar.jpeg'} alt="avatar" />
                        <div className="dropdown">
                            <Link to={`/profile/${currentUser?._id}`} className="item">Profile</Link>
                            <button className="item" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default SellerNavbar;


