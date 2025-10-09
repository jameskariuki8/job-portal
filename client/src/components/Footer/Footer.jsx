import React, { useState } from "react";
import './footer.scss';
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../translations/translations';
import { Link } from 'react-router-dom';
import { GIG_CATEGORIES } from '../../constants/categories';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6
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

const linkVariants = {
  hover: {
    x: 8,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

const buttonVariants = {
  hover: {
    y: -2,
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    y: 0,
    scale: 0.95
  }
};

const socialVariants = {
  hover: {
    y: -3,
    scale: 1.1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

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
    const firstCats = cats.slice(0, 3);
    const extraCats = cats.slice(3);

    return (
        <motion.div 
            className="footer"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
        >
            <div className="container">
                <motion.div 
                    className="top stagger-children"
                    variants={containerVariants}
                >
                    {/* Categories Section */}
                    <motion.div 
                        className="item"
                        variants={itemVariants}
                    >
                        <h2>{getTranslation('footer.categories', currentLanguage)}</h2>
                        {firstCats.map((cat, index) => (
                            <motion.div
                                key={cat}
                                variants={itemVariants}
                                custom={index}
                            >
                                <Link 
                                    to={`/gigs?cat=${encodeURIComponent(cat)}`} 
                                    className="footer-link"
                                >
                                    <motion.span
                                        variants={linkVariants}
                                        whileHover="hover"
                                    >
                                        {getTranslation(categoryMap[cat] || cat, currentLanguage)}
                                    </motion.span>
                                </Link>
                            </motion.div>
                        ))}
                        <AnimatePresence initial={false}>
                          {showAllCats && extraCats.map((cat, index) => (
                            <motion.div
                              key={cat}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                            >
                              <Link 
                                to={`/gigs?cat=${encodeURIComponent(cat)}`} 
                                className="footer-link"
                              >
                                <motion.span whileHover="hover" variants={linkVariants}>
                                  {getTranslation(categoryMap[cat] || cat, currentLanguage)}
                                </motion.span>
                              </Link>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        <motion.button 
                            className="readmore" 
                            onClick={() => setShowAllCats(!showAllCats)}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            {showAllCats ? 'Show less' : 'Read more'}
                        </motion.button>
                    </motion.div>

                    {/* About Section */}
                    <motion.div 
                        className="item"
                        variants={itemVariants}
                    >
                        <h2>{getTranslation('footer.about', currentLanguage)}</h2>
                        {[
                            'footer.careers',
                            'footer.privacy', 
                            'footer.terms'
                        ].map((key, index) => (
                            <motion.span
                                key={key}
                                variants={itemVariants}
                                custom={index}
                                whileHover="hover"
                            >
                                {getTranslation(key, currentLanguage)}
                            </motion.span>
                        ))}
                    </motion.div>

                    {/* Support Section */}
                    <motion.div 
                        className="item"
                        variants={itemVariants}
                    >
                        <h2>{getTranslation('footer.support', currentLanguage)}</h2>
                        {[
                            'footer.help',
                            'footer.trust',
                            'footer.guides'
                        ].map((key, index) => (
                            <motion.span
                                key={key}
                                variants={itemVariants}
                                custom={index}
                                whileHover="hover"
                            >
                                {getTranslation(key, currentLanguage)}
                            </motion.span>
                        ))}
                    </motion.div>

                    {/* More Section */}
                    <motion.div 
                        className="item"
                        variants={itemVariants}
                    >
                        <h2>{getTranslation('footer.more', currentLanguage)}</h2>
                        {[
                            'footer.enterprise',
                            'footer.logoMaker',
                            'footer.workspace',
                            'footer.learn'
                        ].map((key, index) => (
                            <motion.span
                                key={key}
                                variants={itemVariants}
                                custom={index}
                                whileHover="hover"
                            >
                                {getTranslation(key, currentLanguage)}
                            </motion.span>
                        ))}
                    </motion.div>
                </motion.div>

                <motion.hr 
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />

                {/* Bottom section removed as requested */}
            </div>
        </motion.div>
    );
}

export default Footer;