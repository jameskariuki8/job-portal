import React, { useState } from "react";
import './footer.scss';
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../translations/translations';
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

    const categoryKeys = [
        'home.hero.essay',
        'home.hero.collegeEssay',
        'home.hero.coursework',
        'home.hero.dissertation',
        'home.hero.researchPaper',
        'home.hero.termPaper',
        'home.hero.thesis',
        'home.hero.caseStudy',
        'home.hero.literatureReview',
    ];

    const visible = showAllCats ? categoryKeys : categoryKeys.slice(0, 4);

    return (
        <div className="footer">
            <div className="container">
                <div className="top">
                    <div className="item">
                        <h2>{getTranslation('footer.categories', currentLanguage)}</h2>
                        {visible.map((key)=> (
                            <span key={key}>{getTranslation(key, currentLanguage)}</span>
                        ))}
                        {!showAllCats && <span>Personal statement writing service</span> /* keep one more static if needed */}
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
                    <div className="item">
                        <h2>{getTranslation('footer.community', currentLanguage)}</h2>
                        <span>{getTranslation('footer.success', currentLanguage)}</span>
                        <span>{getTranslation('footer.blog', currentLanguage)}</span>
                        <span>{getTranslation('footer.forum', currentLanguage)}</span>
                        <span>{getTranslation('footer.events', currentLanguage)}</span>
                    </div>
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
                        <h2>Job Portal</h2>
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
