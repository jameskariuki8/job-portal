import { Link, useNavigate } from 'react-router-dom';
import './becomeseller2.scss'
import { useLanguage } from '../../contexts/LanguageContext';
import { getTranslation } from '../../translations/translations';
const BecomeSeller2 = () => {
    const navigate=useNavigate();
    const { currentLanguage } = useLanguage();
    return (
        <div className="becomeseller2">
            <div className="container">
                <div className="item">
                    <img src="https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/6efbf3f896f8ad45ed66505a6df63a60-1636629911828/seller_onboarding_overview_do.png" alt="" />
                </div>
                <div className="item2">
                    <div className="header_item2">
                        <h1>{getTranslation('becomeSeller2.header.title', currentLanguage)}</h1>
                        <p>{getTranslation('becomeSeller2.header.subtitle', currentLanguage)}</p>
                    </div>
                    <div className="title">
                        <div className="item">
                            <img src="/images/becomeseller2_1svg.svg" alt="" />
                            <p>{getTranslation('becomeSeller2.point1', currentLanguage)}</p>
                        </div>
                        <div className="item">
                            <img src="/images/becomeseller2_2.svg" alt="" />
                            <p>{getTranslation('becomeSeller2.point2', currentLanguage)}</p>
                        </div>
                        <div className="item">
                            <img src="/images/becomeseller2_3.svg" alt="" />
                            <p>{getTranslation('becomeSeller2.point3', currentLanguage)}</p>
                        </div>
                    </div>
                    <div className="title">
                        <div className="item">
                            <img src="/images/becomeseller2_4.svg" alt="" />
                            <p>{getTranslation('becomeSeller2.point4', currentLanguage)}</p>
                        </div>
                        <div className="item">
                            <img src="/images/becomeseller2_5.svg" alt="" />
                            <p>{getTranslation('becomeSeller2.point5', currentLanguage)}</p>
                        </div>
                    </div>
                    <button onClick={e=>navigate('/register')}>{getTranslation('becomeSeller2.cta', currentLanguage)}</button>
                    <Link to={'/becomeSeller'} className='link' style={{ margin: "30px", color: "blue" }}>{getTranslation('common.back', currentLanguage)}</Link>
                </div>
            </div>
        </div>
    );
}

export default BecomeSeller2;