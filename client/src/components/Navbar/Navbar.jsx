import React, { useEffect, useState } from 'react';
import './navbar.scss'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import newRequest from '../../utils/newRequest';
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../translations/translations';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { GIG_CATEGORIES } from '../../constants/categories';
const Navbar = () => {
    const [active, setactive] = useState(false);
    const [active1, setactive1] = useState(false);
    const [open, setopen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { pathname } = useLocation();
    const { currentLanguage } = useLanguage();
    const isActive = () => {
        window.scrollY > 0 ? setactive(true) : setactive(false);
    }
    const isActive1 = () => {
        window.scrollY > 50 ? setactive1(true) : setactive1(false);
    }
    useEffect(() => {
        window.addEventListener('scroll', isActive);
        window.addEventListener('scroll', isActive1);
        return () => {
            window.removeEventListener('scroll', isActive);
            window.removeEventListener('scroll', isActive1);
        }
    }, []);

    const current_user = JSON.parse(localStorage.getItem('currentUser'));

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await newRequest.post('/auth/logout');
            localStorage.setItem("currentUser", null);
            navigate("/")
        } catch (err) {
            console.log(err);
        }
    }
    const [input, setinput] = useState("");
    const handlesubmit = () => {
        navigate(`/gigs?search=${encodeURIComponent(input)}`);
        setMobileOpen(false);
    }

    const categoryKeyMap = {
        'Essay writing service': 'home.hero.essay',
        'College essay writing service': 'home.hero.collegeEssay',
        'Coursework writing service': 'home.hero.coursework',
        'Dissertation writing service': 'home.hero.dissertation',
        'Custom essay writing service': 'home.hero.essay',
        'Research paper writing service': 'home.hero.researchPaper',
        'Term paper writing service': 'home.hero.termPaper',
        'Thesis writing service': 'home.hero.thesis',
        'Case study writing service': 'home.hero.caseStudy',
        'Literature review writing service': 'home.hero.literatureReview',
        'Personal statement writing service': 'home.hero.personalStatement',
    };

    return (
        <div className={active || pathname !== "/" ? "navbar active" : "navbar "}>
            <div className="container">
                <div className="logo">
                    <Link to='/' className='link' onClick={()=>setMobileOpen(false)}>
                        <span className='log'>Job Portal</span>
                    </Link>
                    <span className='dot'>.</span>
                </div>
                {active  && <div className="navbarsearch">
                    <input type="text" placeholder={getTranslation('home.hero.search', currentLanguage)} onChange={e => setinput(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter'){handlesubmit()} }} />
                    <div className="search">
                        <img src="/images/search.png" alt="" onClick={handlesubmit} />
                    </div>
                </div>}

                <button className={`hamburger`} aria-label="Toggle menu" onClick={()=>setMobileOpen(prev=>!prev)}>
                    <span className={mobileOpen ? 'bar open' : 'bar'}></span>
                    <span className={mobileOpen ? 'bar open' : 'bar'}></span>
                    <span className={mobileOpen ? 'bar open' : 'bar'}></span>
                </button>

                <div className={`links ${mobileOpen ? 'open' : ''}`}>
                    <span onClick={()=>{navigate('/how-it-works'); setMobileOpen(false);}}>How it works</span>
                    <span onClick={()=>{navigate('/gigs'); setMobileOpen(false);}}>{getTranslation('nav.freelance', currentLanguage)}</span>
                    <LanguageSwitcher />
                    <Link to='/login' className='link' key={333} onClick={()=>setMobileOpen(false)}><span>{getTranslation('nav.signIn', currentLanguage)}</span></Link>

                    {!current_user?.isSeller && <span onClick={e => {navigate('/register?seller=1'); setMobileOpen(false);}}>{getTranslation('nav.becomeSeller', currentLanguage)}</span>}
                    {!current_user && <button onClick={e => {navigate(`/register`); setMobileOpen(false);}}>{getTranslation('nav.join', currentLanguage)}</button>}
                    {
                        current_user && (
                            <div className="user" onClick={() => setopen(!open)}>
                                <img src={current_user.img || '/images/noavtar.jpeg'} alt="" />
                                <span>{current_user?.username}</span>
                                {open && (
                                    <div className="options">
                                        {
                                            current_user.isSeller && (
                                                <>
                                                    <Link className='link' key={555} to='/mygigs' onClick={()=>setMobileOpen(false)}>{getTranslation('nav.gigs', currentLanguage)}</Link>
                                                    <Link className='link' key={999} to='/add' onClick={()=>setMobileOpen(false)}>{getTranslation('nav.add', currentLanguage)}</Link>
                                                </>
                                            )
                                        }
                                        <Link className='link' key={9997} to={`/profile/${current_user?._id || current_user?.id}`} onClick={()=>setMobileOpen(false)}>{getTranslation('nav.profile', currentLanguage)}</Link>
                                        <Link className='link' key={9996} to='/orders' onClick={()=>setMobileOpen(false)}>{getTranslation('nav.orders', currentLanguage)}</Link>
                                        <Link className='link' key={9995} to='/messages' onClick={()=>setMobileOpen(false)}>{getTranslation('nav.messages', currentLanguage)}</Link>
                                        <Link className='link' key={9993} onClick={()=>{handleLogout(); setMobileOpen(false);}}>{getTranslation('nav.logout', currentLanguage)}</Link>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>
            </div>

            {(active1 || pathname !== "/") && (
                <>
                    <hr />
                    <div className="menu">
                        <div className="menu-track">
                            {GIG_CATEGORIES.slice(0,9).map((cat) => (
                                <Link key={cat} className='link menulink' to={`/gigs?cat=${encodeURIComponent(cat)}`}>
                                    {getTranslation(categoryKeyMap[cat] || cat, currentLanguage)}
                                </Link>
                            ))}
                            {GIG_CATEGORIES.slice(0,9).map((cat) => (
                                <Link key={`${cat}-dup`} className='link menulink' to={`/gigs?cat=${encodeURIComponent(cat)}`}>
                                    {getTranslation(categoryKeyMap[cat] || cat, currentLanguage)}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <hr />
                </>
            )}
        </div >
    );
}
export default Navbar;