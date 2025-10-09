import React, { useState } from "react";
import './featured.scss';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../translations/translations';
import { motion, AnimatePresence } from 'framer-motion';

function Featured() {
  const [input, setinput] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  
  const handlesubmit = () => {
    if (input.trim()) {
      navigate(`gigs?search=${input}`);
    }
  }

  const popularServices = [
    'home.hero.essay',
    'home.hero.researchPaper',
    'home.hero.dissertation',
  ];

  const academicShapes = [
    { class: 'shape-1', top: '15%', left: '8%', delay: 0 },
    { class: 'shape-2', top: '70%', left: '85%', delay: 0.5 },
    { class: 'shape-3', top: '55%', left: '12%', delay: 0.3 },
  ];

  return (
    <div className="featured">
      {/* Enhanced Background Elements */}
      <div className="hero-background">
        <div className="gradient-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
        </div>
        
        {/* Academic-themed Floating Shapes */}
        <div className="academic-elements">
          {academicShapes.map((shape, index) => (
            <motion.div
              key={index}
              className={`academic-shape ${shape.class}`}
              style={{
                top: shape.top,
                left: shape.left,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                delay: shape.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      <div className="container">
        <div className="left">
          <div className="hero-content">
            {/* Title Section */}
            <motion.div
              className="title-section"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {"Find the perfect freelance services for your Academic."}
              </motion.h1>
              
              
            </motion.div>

            {/* Search Section - Hidden on Mobile */}
            <motion.div 
              className="search-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="search-wrapper">
                <div className={`search ${isSearchFocused ? 'focused' : ''}`}>
                  <div className="searchInput">
                    <img src="/images/search.png" alt="Search" />
                    <input 
                      type="text" 
                      placeholder={"Try 'Thesis Paper'"} 
                      onChange={e => setinput(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      onKeyDown={(e) => e.key === 'Enter' && handlesubmit()}
                    />
                  </div>
                  <motion.button 
                    onClick={handlesubmit}
                    className="search-btn"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {getTranslation('home.hero.searchButton', currentLanguage)}
                  </motion.button>
                </div>
              </div>

              
            </motion.div>

            {/* Popular Services Section */}
            <motion.div 
              className="popular-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="popular-label">
                {getTranslation('home.hero.popular', currentLanguage)}
              </span>
              <div className="popular-buttons">
                {popularServices.map((key, index) => (
                  <motion.button
                    key={key}
                    onClick={e => navigate(`gigs?search=${encodeURIComponent(getTranslation(key, currentLanguage))}`)}
                    className="popular-tag"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {getTranslation(key, currentLanguage)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Static image instead of 3D scene */}
        <motion.div 
          className="right"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="image-container">
            <img src="images/logo.png" alt="Academic writing" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Featured;