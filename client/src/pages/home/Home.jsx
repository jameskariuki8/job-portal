// 1.28.50
import React from "react";
import './home.scss';
import Featured from "../../components/featured/Featured";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations/translations";

const Home = () => {
    const navigate = useNavigate();
    const { currentLanguage } = useLanguage();
    const academicServices = [
        { value: 'Essay writing service', key: 'home.hero.essay', icon: '📄' },
        { value: 'College essay writing service', key: 'home.hero.collegeEssay', icon: '🏫' },
        { value: 'Coursework writing service', key: 'home.hero.coursework', icon: '📚' },
        { value: 'Dissertation writing service', key: 'home.hero.dissertation', icon: '🎓' },
        { value: 'Custom essay writing service', key: 'home.hero.essay', icon: '✍️' },
        { value: 'Research paper writing service', key: 'home.hero.researchPaper', icon: '🔬' },
        { value: 'Term paper writing service', key: 'home.hero.termPaper', icon: '📝' },
        { value: 'Thesis writing service', key: 'home.hero.thesis', icon: '📘' },
        { value: 'Case study writing service', key: 'home.hero.caseStudy', icon: '📊' },
        { value: 'Literature review writing service', key: 'home.hero.literatureReview', icon: '📖' },
    ];
    const duplicated = [...academicServices, ...academicServices];
    return (
        <div className="home">
            <Featured></Featured>
            
            <div className="features">
                <div className="container">
                    <div className="item">
                        <h1>{getTranslation('home.features.title1', currentLanguage)}</h1>
                        <div className="title">
                            <img src="/images/check.png" alt="check" />
                            {getTranslation('home.features.budgetTitle', currentLanguage)}
                        </div>
                        <p>{getTranslation('home.features.budgetDesc', currentLanguage)}</p>
                        <div className="title">
                            <img src="/images/check.png" alt="check" />
                            {getTranslation('home.features.qualityTitle', currentLanguage)}
                        </div>
                        <p>{getTranslation('home.features.qualityDesc', currentLanguage)}</p>
                        <div className="title">
                            <img src="/images/check.png" alt="check" />
                            {getTranslation('home.features.payTitle', currentLanguage)}
                        </div>
                        <p>{getTranslation('home.features.payDesc', currentLanguage)}</p>
                        <div className="title">
                            <img src="/images/check.png" alt="check" />
                            {getTranslation('home.features.supportTitle', currentLanguage)}
                        </div>
                        <p>{getTranslation('home.features.supportDesc', currentLanguage)}</p>
                    </div>
                    <div className="item">
                        <video src="/images/video.mp4" controls width='100%'></video>
                    </div>
                </div>
            </div>
            
            <div className="explore">
                <div className="container">
                    <h1>{getTranslation('home.academic.title', currentLanguage)}</h1>
                    <div className="carousel" title="Academic services">
                        <div className="track">
                            {duplicated.map((svc, idx) => (
                                <div
                                    className="card"
                                    key={`${svc.value}-${idx}`}
                                    onClick={() => navigate(`/gigs?cat=${encodeURIComponent(svc.value)}`)}
                                >
                                    <div className="card-icon">{svc.icon}</div>
                                    <div className="card-label">{getTranslation(svc.key, currentLanguage)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="features dark">
                <div className="container">
                    <div className="item">
                        <h1>Job Portal <em><span style={{ fontWeight: '300' }}>{getTranslation('home.business.mainTitle', currentLanguage)}</span></em></h1>
                        <h1>{getTranslation('home.business.subtitle', currentLanguage)}</h1>
                        <p>{getTranslation('home.business.description', currentLanguage)}</p>
                        <div className="title">
                            <img src="/images/check.png" alt="check" />
                            {getTranslation('home.business.talent', currentLanguage)}
                        </div>
                        <div className="title">
                            <img src="/images/check.png" alt="check" />
                            {getTranslation('home.business.account', currentLanguage)}
                        </div>
                        <div className="title">
                            <img src="/images/check.png" alt="check" />
                            {getTranslation('home.business.team', currentLanguage)}
                        </div>
                        <div className="title">
                            <img src="/images/check.png" alt="check" />
                            {getTranslation('home.business.payment', currentLanguage)}
                        </div>
                        <button>{getTranslation('home.business.cta', currentLanguage)}</button>
                    </div>
                    <div className="item">
                        <img src="images/business-desktop-870-x1.webp" alt="imagea" />
                    </div>
                </div>
            </div>
            
            <div className="last_hero">
                <div className="items">
                    <div className="left">
                        <h1>{getTranslation('home.last.titlePrefix', currentLanguage)} <em><span className="last_hero_em">{getTranslation('home.last.titleEm', currentLanguage)}</span></em></h1>
                        <button onClick={e => navigate(`/register`)}>{getTranslation('home.last.cta', currentLanguage)}</button>
                    </div>
                    <div className="right">
                        <img src="/images/last_hero.webp" alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
