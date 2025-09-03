import { Link, useNavigate } from 'react-router-dom';
import './becomeseller.scss'
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../translations/translations';

const BecomeSeller=()=>{
    const navigate=useNavigate();
    const { currentLanguage } = useLanguage();
    return(
        <div className="becomeseller">
                <div className="container">
                    <div className="item">
                        <h1>{getTranslation('becomeSeller.title', currentLanguage)}</h1>
                        <hr />
                        <div className="title">
                            <img src="/images/becomeseller1.svg" alt="check" />
                            {getTranslation('becomeSeller.point1.title', currentLanguage)}
                        </div>
                        <p>{getTranslation('becomeSeller.point1.desc', currentLanguage)}</p>
                        <hr />
                        <div className="title">
                            <img src="/images/becomeseller2.svg" alt="check" />
                            {getTranslation('becomeSeller.point2.title', currentLanguage)}
                        </div>
                        <p>{getTranslation('becomeSeller.point2.desc', currentLanguage)}</p>
                        <hr />
                        <div className="title">
                            <img src="/images/becomeseller3.svg" alt="check" />
                            {getTranslation('becomeSeller.point3.title', currentLanguage)}
                        </div>
                        <p>{getTranslation('becomeSeller.point3.desc', currentLanguage)}</p>
                        <hr />
                    </div>
                    <div className="item">
                        <video src="https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/v1/video-attachments/generic_asset/asset/966b0ae895e85b526600eff1d21e3cf4-1674728725728/Seller%20onboarding%20video%20HQ" controls width='100%'></video>
                    </div>
                   
                </div>
                <button onClick={e=>navigate('/becomeSeller2')}>{getTranslation('becomeSeller.cta', currentLanguage)}</button>
                <Link to={'/'} className='link' style={{marginLeft:"10px",color:"blue"}}>{getTranslation('common.back', currentLanguage)}</Link>
            </div>
            
    );
}

export default BecomeSeller;