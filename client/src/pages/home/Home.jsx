// 1.28.50
import React from "react";
import './home.scss';
import Featured from "../../components/featured/Featured";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations/translations";
import { motion } from 'framer-motion';
import ParticlesCanvas from '../../components/effects/ParticlesCanvas';

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
    const categoryImageMap = {
        'Essay writing service': '/images/categories/essay.jpg',
        'College essay writing service': '/images/categories/college-essay.jpg',
        'Coursework writing service': '/images/categories/coursework.jpg',
        'Dissertation writing service': '/images/categories/dissertation.jpg',
        'Custom essay writing service': '/images/categories/custom-essay.jpg',
        'Research paper writing service': '/images/categories/research-paper.jpg',
        'Term paper writing service': '/images/categories/term-paper.jpg',
        'Thesis writing service': '/images/categories/thesis.jpg',
        'Case study writing service': '/images/categories/case-study.jpg',
        'Literature review writing service': '/images/categories/literature-review.jpg',
    };
    return (
        <div className="home">
            <div style={{position:'relative'}}>
                <ParticlesCanvas />
                <Featured></Featured>
            </div>
            
            <motion.div className="features dark" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
                <div className="container">
                    <div className="item">
                        <h1>{getTranslation('home.features.title1', currentLanguage)}</h1>
                        <div className="feature-points">
                            {[
                                {title:'Academic writing, perfected', desc:'From essays to theses, get polished, original work crafted by vetted academic writers and editors.'},
                                {title:'Transparent pricing', desc:'Only pay for the pages you need. Clear timelines, no surprises.'},
                                {title:'On-time, every time', desc:'Meet your deadline with reliable delivery and real-time updates.'},
                            ].map((pt, i)=> (
                                <div className="feature-point" key={i}>
                                    <div className="icon-wrap"><img src="/images/greencheck.png" alt="check" /></div>
                                    <div className="content">
                                        <h3>{pt.title}</h3>
                                        <p>{pt.desc}</p>
                        </div>
                        </div>
                            ))}
                        </div>
                        </div>
                    <div className="academics-grid">
                        {[
                            {icon:'📚', title:'Subject‑matter experts', desc:'Writers across STEM, humanities, business, and social sciences.'},
                            {icon:'🧭', title:'Proper structure', desc:'Crisp thesis statements, strong arguments, and logical flow.'},
                            {icon:'🧾', title:'Citations & formatting', desc:'APA, MLA, Chicago, Harvard—meticulously followed.'},
                            {icon:'🔍', title:'Originality guaranteed', desc:'Plagiarism‑free writing with similarity checks on request.'},
                            {icon:'🛡️', title:'Confidential & secure', desc:'Private, encrypted communication and file handling.'},
                            {icon:'✅', title:'Revisions included', desc:'Thoughtful edits to match your rubric and feedback.'},
                        ].map((c, i)=> (
                            <div className="academic-card" key={i}>
                                <div className="icon">{c.icon}</div>
                                <div className="card-title">{c.title}</div>
                                <div className="card-desc">{c.desc}</div>
                    </div>
                        ))}
                    </div>
                </div>
            </motion.div>
            
            <motion.div className="explore" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <div className="container">
                    <div className="heading-box">
                        <h1>{getTranslation('home.academic.title', currentLanguage)}</h1>
                    </div>
                    <div className="carousel" title="Academic services">
                        <div className="track">
                            {duplicated.map((svc, idx) => (
                                <motion.div
                                    className="card"
                                    key={`${svc.value}-${idx}`}
                                    onClick={() => navigate(`/gigs?cat=${encodeURIComponent(svc.value)}`)}
                                    whileHover={{ y: -6 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <div className="card-header">
                                        <div className="card-title">{getTranslation(svc.key, currentLanguage)}</div>
                                    </div>
                                    <div className="card-media">
                                        <img
                                            className="card-image"
                                            src={categoryImageMap[svc.value]}
                                            alt={svc.value}
                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        />
                                        <div className="media-illustration">{svc.icon}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
            
            
            
            <motion.div className="reviews dark" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <div className="container">
                    <h2>Client reviews</h2>
                    <div className="cards">
                        {[{
                            quote: 'I have been working with our freelancers for several years now. Exceptionally talented, professional, and highly productive — the breadth and depth of talent keeps impressing us.',
                            author: 'Ian Stokes-Rees',
                            role: 'Partner',
                            company: 'BCG X',
                            logo: '/images/logomaker.webp'
                        }, {
                            quote: 'Job Portal is my go-to source to find high‑quality talent I can’t find elsewhere. They always deliver.',
                            author: 'Tess Caputo',
                            role: 'Chief Operations Officer',
                            company: 'Zoetis',
                            logo: '/images/greencheck.png'
                        }, {
                            quote: 'Under tight deadlines, we received clear, well‑researched academic writing and meticulous citations. The editors were responsive and ensured the paper met our rubric and formatting requirements.',
                            author: 'Dr. Conor Kenney',
                            role: 'Program Coordinator, Graduate Studies',
                            company: 'School of Social Sciences',
                            logo: '/images/check.png'
                        }].map((r, i) => (
                            <motion.div className="review-card" key={i} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 250, damping: 18 }}>
                                <div className="quote-mark">“</div>
                                <h3 className="title">{i===0 ? 'I have been working with Job Portal…' : i===1 ? 'Job Portal is my go‑to source' : 'Academic writing done right'}</h3>
                                <p className="text">{r.quote}</p>
                                <div className="stars" aria-label="rating">★★★★★</div>
                                <div className="person">
                                    <div className="who">
                                        <div className="name">{r.author}</div>
                                        <div className="role">{r.role}</div>
                                    </div>
                                    <img className="logo" src={r.logo} alt={r.company} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Home;




