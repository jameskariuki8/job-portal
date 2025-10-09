import React, { useState, useRef, useEffect, useMemo } from "react";
import './gigs.scss';
import GigCard from '../../components/GigCard/GigCard'
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";
import { GIG_CATEGORIES, getCategoryIcon } from "../../constants/categories";
import getCurrentUser from "../../utils/getCurrentUser";
import { motion, AnimatePresence } from 'framer-motion';

const Gigs = () => {
    const [open, setopen] = useState(false);
    const [sort, setsort] = useState("sales");
    const minRef = useRef();
    const maxRef = useRef();
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const category = searchParams.get('cat');
    const searchQuery = searchParams.get('search');
    
    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ['gigs', search, sort],
        queryFn: () => {
            const queryParams = new URLSearchParams();
            if (category) queryParams.append('cat', category);
            if (searchQuery) queryParams.append('search', searchQuery);
            if (minRef.current?.value) queryParams.append('min', minRef.current.value);
            if (maxRef.current?.value) queryParams.append('max', maxRef.current.value);
            if (sort) queryParams.append('sort', sort);
            
            const queryString = queryParams.toString();
            const url = `/gigs${queryString ? '?' + queryString : ''}`;
            
            console.log('Frontend: Requesting URL:', url);
            console.log('Frontend: Category:', category);
            console.log('Frontend: Search query:', searchQuery);
            
            return newRequest.get(url)
                .then((res) => {
                    console.log('Frontend: Received data:', res.data);
                    return res.data;
                });
        }
    });

    const currentUser = getCurrentUser();
    const { data: myBids } = useQuery({
        queryKey: ['my-bids-all'],
        queryFn: () => newRequest.get('/bids/me').then(r => r.data),
        enabled: !!currentUser && !currentUser.isSeller,
        retry: false,
    });

    const filteredData = useMemo(() => {
        if (!data) return [];
        if (!myBids || currentUser?.isSeller) return data;
        const excludedGigIds = new Set(
            myBids
                .filter(b => b.status === 'approved' || b.status === 'in_progress')
                .map(b => String(b.gigId))
        );
        return data.filter(g => !excludedGigIds.has(String(g._id)));
    }, [data, myBids, currentUser]);
    
    useEffect(() => {
        refetch();
    }, [refetch, sort]);

    const resort = (type) => {
        setsort(type);
        setopen(false);
    }

    const apply = () => {
        refetch();
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="gigs">
            <div className="container">
                <motion.span 
                    className="breadcrumbs"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    Essay Shop &gt; {category ? category : 'All Categories'} &gt;
                </motion.span>
                
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {category || searchQuery || 'All Gigs'}
                </motion.h1>
                
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {category 
                        ? `Explore amazing ${category} services on Essay Shop`
                        : searchQuery 
                        ? `Search results for "${searchQuery}"`
                        : 'Explore the boundaries of art and technology with Essay Shop\'s talented freelancers'
                    }
                </motion.p>

                <motion.div 
                    className="menu"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="left">
                        <span>Budget</span>
                        <input 
                            ref={minRef} 
                            type="number" 
                            placeholder="Min" 
                            onKeyDown={(e) => e.key === 'Enter' && apply()}
                        />
                        <input 
                            ref={maxRef} 
                            type="number" 
                            placeholder="Max" 
                            onKeyDown={(e) => e.key === 'Enter' && apply()}
                        />
                        <motion.button 
                            onClick={apply}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Apply
                        </motion.button>
                    </div>
                    <div className="right">
                        <span className="sortBy">Sort By</span>
                        <span className="sortType">
                            {sort === "sales" ? "Best Selling" : "Newest"}
                        </span>
                        <motion.img 
                            src="/images/down.png" 
                            alt="Sort options" 
                            onClick={() => setopen(!open)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            animate={{ rotate: open ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        />
                        <AnimatePresence>
                            {open && (
                                <motion.div 
                                    className="rightMenu"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {sort === "sales" ? (
                                        <motion.span 
                                            onClick={() => resort('createdAt')}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            Newest
                                        </motion.span>
                                    ) : (
                                        <motion.span 
                                            onClick={() => resort('sales')}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            Best Selling
                                        </motion.span>
                                    )}
                                    <motion.span 
                                        onClick={() => resort("sales")}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        Popular
                                    </motion.span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <motion.div 
                    className="cards"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {isLoading ? (
                        <div className="loader"></div>
                    ) : error ? (
                        <motion.h4 variants={itemVariants}>
                            Something Went Wrong
                        </motion.h4>
                    ) : filteredData.length === 0 ? (
                        <motion.div 
                            className="empty-state"
                            variants={itemVariants}
                        >
                            <div className="icon">🔎</div>
                            <h3>Oops, no jobs at the moment</h3>
                            <p>Come again later or try another category.</p>
                        </motion.div>
                    ) : (
                        filteredData.map((gig, index) => (
                            <motion.div
                                key={gig._id}
                                variants={itemVariants}
                                custom={index}
                            >
                                <GigCard item={gig} />
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default Gigs;