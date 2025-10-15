// Enhanced Home component with better animations and interactions
import React, { useEffect } from "react";
import './home.scss';
import Featured from "../../components/featured/Featured";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations/translations";
import { motion } from 'framer-motion';
import ParticlesCanvas from '../../components/effects/ParticlesCanvas';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.8
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const Home = () => {
    const navigate = useNavigate();
    const { currentLanguage } = useLanguage();
    
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "EssayShop",
            "url": "https://myessay-shop.com",
            "logo": "https://myessay-shop.com/images/logo.png",
            "description": "Academic writing, editing, proofreading and dissertation assistance for international & European students.",
            "areaServed": [
                { "@type": "Place", "name": "Europe" },
                { "@type": "Place", "name": "United Kingdom" },
                { "@type": "Place", "name": "Germany" },
                { "@type": "Place", "name": "France" }
            ],
            "serviceType": [
                "Essay writing",
                "Coursework writing",
                "Dissertation / thesis writing",
                "Proofreading & academic editing"
            ],
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Academic writing services",
                "itemListElement": [
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Essay writing" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Dissertation assistance" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Proofreading & editing" } }
                ]
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer support",
                "email": "contact@myessay-shop.com",
                "url": "https://myessay-shop.com/contact"
            }
        });

        const faqScript = document.createElement('script');
        faqScript.type = 'application/ld+json';
        faqScript.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What academic writing services do you offer?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "We provide essay writing, coursework, research papers, dissertations/theses, and proofreading & academic editing across STEM, humanities, business, and social sciences."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Do you guarantee originality?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes. Every paper is written from scratch and can include similarity reports upon request."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How fast can you deliver?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Turnarounds range from same‑day to multi‑week projects depending on scope. We meet agreed deadlines and provide updates throughout."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Do you follow academic styles like APA or MLA?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Absolutely. We adhere to APA, MLA, Chicago, and Harvard formatting, including in‑text citations and references."
                    }
                }
            ]
        });

        document.head.appendChild(script);
        document.head.appendChild(faqScript);
        return () => {
            document.head.removeChild(script);
            document.head.removeChild(faqScript);
        };
    }, []);
    
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
            {/* Hero Section with Particles */}
            <motion.div 
                className="hero-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <ParticlesCanvas />
                <Featured />
            </motion.div>
            
            {/* Features Section */}
            <motion.section 
                className="features dark"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="container">
                    <motion.div className="item" variants={itemVariants}>
                        <h1>{getTranslation('home.features.title1', currentLanguage)}</h1>
                        <motion.div 
                            className="feature-points stagger-children"
                            variants={containerVariants}
                        >
                            {[
                                {title:'Academic writing, perfected', desc:'From essays to theses, get polished, original work crafted by vetted academic writers and editors.'},
                                {title:'Transparent pricing', desc:'Only pay for the pages you need. Clear timelines, no surprises.'},
                                {title:'On-time, every time', desc:'Meet your deadline with reliable delivery and real-time updates.'},
                            ].map((pt, i) => (
                                <motion.div 
                                    className="feature-point" 
                                    key={i}
                                    variants={cardVariants}
                                    whileHover="hover"
                                >
                                    <div className="icon-wrap">
                                        <img src="/images/greencheck.png" alt="check" />
                                    </div>
                                    <div className="content">
                                        <h3>{pt.title}</h3>
                                        <p>{pt.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                    
                    <motion.div 
                        className="academics-grid stagger-children"
                        variants={containerVariants}
                    >
                        {[
                            {icon:'📚', title:'Subject‑matter experts', desc:'Writers across STEM, humanities, business, and social sciences.'},
                            {icon:'🧭', title:'Proper structure', desc:'Crisp thesis statements, strong arguments, and logical flow.'},
                            {icon:'🧾', title:'Citations & formatting', desc:'APA, MLA, Chicago, Harvard—meticulously followed.'},
                            {icon:'🔍', title:'Originality guaranteed', desc:'Plagiarism‑free writing with similarity checks on request.'},
                            {icon:'🛡️', title:'Confidential & secure', desc:'Private, encrypted communication and file handling.'},
                            {icon:'✅', title:'Revisions included', desc:'Thoughtful edits to match your rubric and feedback.'},
                        ].map((c, i) => (
                            <motion.div 
                                className="academic-card" 
                                key={i}
                                variants={cardVariants}
                                whileHover="hover"
                            >
                                <div className="icon">{c.icon}</div>
                                <div className="card-title">{c.title}</div>
                                <div className="card-desc">{c.desc}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>
            
            {/* Explore Section */}
            <motion.section 
                className="explore"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="container">
                    <motion.div className="heading-box" variants={itemVariants}>
                        <h1>{getTranslation('home.academic.title', currentLanguage)}</h1>
                    </motion.div>
                    <div className="carousel" title="Academic services">
                        <div className="track">
                            {duplicated.map((svc, idx) => (
                                <motion.div
                                    className="card"
                                    key={`${svc.value}-${idx}`}
                                    onClick={() => navigate(`/gigs?cat=${encodeURIComponent(svc.value)}`)}
                                    variants={cardVariants}
                                    whileHover="hover"
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
                                            onError={(e) => { 
                                                e.currentTarget.style.display = 'none'; 
                                            }}
                                        />
                                        <div className="media-illustration">{svc.icon}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>
            
            {/* Reviews Section */}
            <motion.section 
                className="reviews dark"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="container">
                    <motion.h2 variants={itemVariants}>Client reviews</motion.h2>
                    <motion.div 
                        className="cards stagger-children"
                        variants={containerVariants}
                    >
                        {[{
                            quote: 'I have been working with our freelancers for several years now. Exceptionally talented, professional, and highly productive — the breadth and depth of talent keeps impressing us.',
                            author: 'Ian Stokes-Rees',
                            role: 'Partner',
                            company: 'BCG X',
                            logo: '/images/logomaker.webp'
                        }, {
                            quote: 'Essay Shop is my go-to source to find high‑quality talent I can\'t find elsewhere. They always deliver.',
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
                            <motion.div 
                                className="review-card" 
                                key={i}
                                variants={cardVariants}
                                whileHover="hover"
                            >
                                <div className="quote-mark">"</div>
                                <h3 className="title">
                                    {i===0 ? 'I have been working with Essay Shop…' : 
                                     i===1 ? 'Essay Shop is my go‑to source' : 
                                     'Academic writing done right'}
                                </h3>
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
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
}

export default Home;