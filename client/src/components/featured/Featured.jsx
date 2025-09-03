import React, { useState } from "react";
import './featured.scss';
import{ useNavigate} from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../translations/translations';

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
            <h1>
              {getTranslation('home.hero.title', currentLanguage)}
            </h1>
            <div className="search">
              <div className="searchInput">
                <img src="/images/search.png" alt="" />
                <input type="text" placeholder={getTranslation('home.hero.searchPlaceholder', currentLanguage)} onChange={e=>setinput(e.target.value)} />
              </div>
              <button onClick={handlesubmit}>{getTranslation('home.hero.searchButton', currentLanguage)}</button>
            </div>
            <div className="popular">
              <span>{getTranslation('home.hero.popular', currentLanguage)}</span>
              {popularServices.map(key => (
                <button key={key} onClick={e=>navigate(`gigs?search=${encodeURIComponent(getTranslation(key, currentLanguage))}`)}>
                  {getTranslation(key, currentLanguage)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
export default Featured;