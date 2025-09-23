import React, { useState } from "react";
import './featured.scss';
import{ useNavigate} from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../translations/translations';
import HeroCanvas from './HeroCanvas';
import { motion } from 'framer-motion';

function Featured() {
  const [input,setinput]=useState("");
  const navigate=useNavigate();
  const { currentLanguage } = useLanguage();
  const handlesubmit=()=>{
    navigate(`gigs?search=${input}`);
  }
  const popularServices = [
    'home.hero.essay',
    'home.hero.researchPaper',
    'home.hero.dissertation',
  ];
    return (
      <div className="featured">
        <div className="container">
          <div className="left">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
              {getTranslation('home.hero.title', currentLanguage)}
            </motion.h1>
            <motion.div className="search" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
              <div className="searchInput">
                <img src="/images/search.png" alt="" />
                <input type="text" placeholder={getTranslation('home.hero.searchPlaceholder', currentLanguage)} onChange={e=>setinput(e.target.value)} />
              </div>
              <button onClick={handlesubmit}>{getTranslation('home.hero.searchButton', currentLanguage)}</button>
            </motion.div>
            <motion.div className="popular" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <span>{getTranslation('home.hero.popular', currentLanguage)}</span>
              {popularServices.map(key => (
                <button key={key} onClick={e=>navigate(`gigs?search=${encodeURIComponent(getTranslation(key, currentLanguage))}`)}>
                  {getTranslation(key, currentLanguage)}
                </button>
              ))}
            </motion.div>
          </div>
          <div className="right">
            <HeroCanvas />
          </div>
        </div>
      </div>
    );
  }
export default Featured;