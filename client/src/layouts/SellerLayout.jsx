import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SellerNavbar from '../components/SellerNavbar/SellerNavbar';

const SellerLayout = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    useEffect(() => {
        if (!currentUser?.isSeller) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    return (
        <div className="seller-layout">
            <SellerNavbar />
            <Outlet />
        </div>
    );
};

export default SellerLayout;


