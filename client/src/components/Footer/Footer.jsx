import React, { useState } from "react";
import './footer.scss';
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../translations/translations';
import { Link } from 'react-router-dom';
import { GIG_CATEGORIES } from '../../constants/categories';
const Footer = () => {
    const { currentLanguage } = useLanguage();
    const [showAllCats, setShowAllCats] = useState(false);
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' },
        { code: 'es', name: 'Español' },
    ];
    const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

    const categoryMap = {
        'Essay writing service': 'home.hero.essay',
        'College essay writing service': 'home.hero.collegeEssay',
        'Coursework writing service': 'home.hero.coursework',
        'Dissertation writing service': 'home.hero.dissertation',
        'Research paper writing service': 'home.hero.researchPaper',
        'Term paper writing service': 'home.hero.termPaper',
        'Thesis writing service': 'home.hero.thesis',
        'Case study writing service': 'home.hero.caseStudy',
        'Literature review writing service': 'home.hero.literatureReview',
    };
    const cats = GIG_CATEGORIES;
    const visibleCats = showAllCats ? cats : cats.slice(0, 6);

    return (
        <div className="footer">
            <div className="container">
                <div className="top">
                    <div className="item">
                        <h2>{getTranslation('footer.categories', currentLanguage)}</h2>
                        {visibleCats.map((cat)=> (
                            <Link key={cat} to={`/gigs?cat=${encodeURIComponent(cat)}`} className="footer-link">
                                {getTranslation(categoryMap[cat] || cat, currentLanguage)}
                            </Link>
                        ))}
                        <button style={{marginTop:8}} className="readmore" onClick={()=>setShowAllCats(!showAllCats)}>
                            {showAllCats ? 'Show less' : 'Read more'}
                        </button>
                    </div>
                    <div className="item">
                        <h2>{getTranslation('footer.about', currentLanguage)}</h2>
                        <span>{getTranslation('footer.careers', currentLanguage)}</span>
                        <span>{getTranslation('footer.privacy', currentLanguage)}</span>
                        <span>{getTranslation('footer.terms', currentLanguage)}</span>
                    </div>
                    <div className="item">
                        <h2>{getTranslation('footer.support', currentLanguage)}</h2>
                        <span>{getTranslation('footer.help', currentLanguage)}</span>
                        <span>{getTranslation('footer.trust', currentLanguage)}</span>
                        <span>{getTranslation('footer.guides', currentLanguage)}</span>
                    </div>
                    {/* Community section removed per request */}
                    <div className="item">
                        <h2>{getTranslation('footer.more', currentLanguage)}</h2>
                        <span>{getTranslation('footer.enterprise', currentLanguage)}</span>
                        <span>{getTranslation('footer.logoMaker', currentLanguage)}</span>
                        <span>{getTranslation('footer.workspace', currentLanguage)}</span>
                        <span>{getTranslation('footer.learn', currentLanguage)}</span>
                    </div>
                </div>
                <hr />
                <div className="bottom">
                    <div className="left">
                        <h2>Essay Shop</h2>
                        <span>{getTranslation('footer.copyright', currentLanguage)}</span>
                    </div>
                    <div className="right">
                        <div className="social">
                            <a href="#"> <img src="/images/twitter.png" alt=""  /></a>
                            <a href="#"> <img src="/images/facebook.png" alt=""  /></a>
                            <a href="#"><img src="/images/linkedin.png" alt=""  /></a>

                            <a href="#"> <img src="/images/instagram.png" alt=""  /></a> 
                        </div>
                        
                        <div className="link">
                            <img src="/images/coin.png" alt="" />
                            <span>USD</span>
                        </div>
                        <img src="/images/accessibility.png" alt="" />
                        
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Footer;
