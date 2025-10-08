import React, { useState, useRef, useEffect, useMemo } from "react";
import './gigs.scss';
import GigCard from '../../components/GigCard/GigCard'
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";
import { GIG_CATEGORIES, getCategoryIcon } from "../../constants/categories";
import getCurrentUser from "../../utils/getCurrentUser";

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
    
    return (
        <div className="gigs">
            <div className="container">
                <span className="breadcrumbs">
                    JOB PORTAL &gt; {category ? category : 'All Categories'} &gt;
                </span>
                <h1>{category || searchQuery || 'All Gigs'}</h1>
                <p>
                    {category 
                        ? `Explore amazing ${category} services on Essay Shop`
                        : searchQuery 
                        ? `Search results for "${searchQuery}"`
                        : 'Explore the boundaries of art and technology with Essay Shop\'s talented freelancers'
                    }
                </p>
                <div className="menu">
                    <div className="left">
                        <span>Budget</span>
                        <input ref={minRef} type="number" placeholder="min" />
                        <input ref={maxRef} type="number" placeholder="max" />
                        <button onClick={apply}>Apply</button>
                    </div>
                    <div className="right">
                        <span className="sortBy">SortBy</span>
                        <span className="sortType">{sort === "sales" ? "Best Selling" : "Newest "}</span>
                        <img src="/images/down.png" alt="" onClick={() => setopen(!open)} />
                        {open &&
                            (<div className="rightMenu">
                                {sort === "sales" ?
                                    (<span onClick={() => resort('creadtedAt')}>Newest</span>)
                                    : (<span onClick={() => resort('sales')}>Best Selling</span>)}
                                <span onClick={() => resort("sales")}>Popular</span>
                            </div>)}
                    </div>
                </div>
                <div className="cards">
                    {isLoading
                        ? <div className="loader"></div>
                        : error
                            ? <h4 style={{color:"red"}}>Something Gone Wrong</h4>
                            : filteredData.length === 0 ?
                                <div className="empty-state">
                                  <div className="icon">🔎</div>
                                  <h3>Oops, no jobs at the moment</h3>
                                  <p>Come again later or try another category.</p>
                                </div> :
                                filteredData.map((gig) => <GigCard key={gig._id} item={gig} />)
                    }
                </div>
            </div>
        </div>
    );
}
export default Gigs;