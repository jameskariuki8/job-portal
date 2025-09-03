import React, { useEffect, useReducer, useState } from "react";
import './add.scss';
import { INITIAL_STATE, gigReducer } from "../../reducers/gigReducers";
import upload from '../../utils/upload.js';
import { useQueryClient,useMutation, useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate, useLocation } from "react-router-dom";
import { GIG_CATEGORIES } from "../../constants/categories";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations/translations";
const Add = () => {
    const [singleFile, setsingleFile] = useState(undefined);
    const [uploading, setUploading] = useState(false);
    const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

    const { currentLanguage } = useLanguage();
    const navigate=useNavigate();
    const queryClient = useQueryClient();
    const { search } = useLocation();
    const editId = new URLSearchParams(search).get('edit');

    const { data: existingGig } = useQuery({
        queryKey: ['edit-gig', editId],
        queryFn: () => newRequest.get(`/gigs/single/${editId}`).then(r=>r.data),
        enabled: !!editId,
    });

    useEffect(() => {
        if (existingGig) {
            dispatch({ type: 'CHANGE_INPUT', payload: { name: 'title', value: existingGig.title || '' } });
            dispatch({ type: 'CHANGE_INPUT', payload: { name: 'cat', value: existingGig.cat || '' } });
            dispatch({ type: 'CHANGE_INPUT', payload: { name: 'desc', value: existingGig.desc || '' } });
            dispatch({ type: 'CHANGE_INPUT', payload: { name: 'deliveryTime', value: existingGig.deliveryTime || 0 } });
            dispatch({ type: 'CHANGE_INPUT', payload: { name: 'priceMin', value: existingGig.priceMin || 0 } });
            dispatch({ type: 'CHANGE_INPUT', payload: { name: 'priceMax', value: existingGig.priceMax || 0 } });
            dispatch({ type: 'ADD_IMAGES', payload: { cover: existingGig.cover || '', images: existingGig.images || [] } });
        }
    }, [existingGig]);

    const createMutation = useMutation({
        mutationFn: (gig) => newRequest.post("/gigs", gig),
        onSuccess:()=>{ queryClient.invalidateQueries(["myGigs"]) }
    });

    const updateMutation = useMutation({
        mutationFn: (gig) => newRequest.patch(`/gigs/${editId}`, gig),
        onSuccess:()=>{ queryClient.invalidateQueries(["myGigs"]) }
    });

    const handlechange = (e) => {
        dispatch({ type: "CHANGE_INPUT", payload: { name: e.target.name, value: e.target.value } })
    }

    const handleupload = async () => {
        setUploading(true);
        try {
            const cover = await upload(singleFile);
            setUploading(false);
            dispatch({ type: "ADD_IMAGES", payload: { cover, images: [] } })
        } catch (error) { console.log(error); }
    };
  
    const handlesubmit=(e)=>{
        e.preventDefault();
        if (!state.cat) { alert(getTranslation('add.alert.categoryRequired', currentLanguage)); return; }
        if (!state.title || !state.desc || !state.priceMin || !state.priceMax || !state.deliveryTime) { alert(getTranslation('add.alert.requiredFields', currentLanguage)); return; }
        if (parseFloat(state.priceMin) >= parseFloat(state.priceMax)) { alert(getTranslation('add.alert.priceRange', currentLanguage)); return; }
        const payload = { ...state };
        if (editId) {
            updateMutation.mutate(payload);
        } else {
            createMutation.mutate(payload);
        }
        navigate('/mygigs')
    }
    return (
        <div className="add">
            <div className="container">
                <div className="header">
                    <h1>{editId ? 'Edit Gig' : getTranslation('add.header.title', currentLanguage)}</h1>
                    <p>{getTranslation('add.header.subtitle', currentLanguage)}</p>
                </div>
                
                <div className="form-container">
                    <form onSubmit={handlesubmit}>
                        {/* Basic Information Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <div className="section-icon">📝</div>
                                <h2>{getTranslation('add.basic.title', currentLanguage)}</h2>
                                <p>{getTranslation('add.basic.subtitle', currentLanguage)}</p>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="title">{getTranslation('add.basic.titleLabel', currentLanguage)} *</label>
                                <input 
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder={getTranslation('add.basic.titlePlaceholder', currentLanguage)}
                                    onChange={handlechange}
                                    value={state.title}
                                    required
                                />
                                <small>{getTranslation('add.basic.tip', currentLanguage)}</small>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="cat">{getTranslation('add.basic.categoryLabel', currentLanguage)} *</label>
                                <select 
                                    id="cat" 
                                    name="cat" 
                                    onChange={handlechange} 
                                    value={state.cat}
                                    required
                                >
                                    <option value="">{getTranslation('add.basic.categoryPlaceholder', currentLanguage)}</option>
                                    {GIG_CATEGORIES.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <small>{getTranslation('add.basic.categoryHelp', currentLanguage)}</small>
                            </div>
                        </div>

                        {/* Media Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <div className="section-icon">🖼️</div>
                                <h2>{getTranslation('add.media.title', currentLanguage)}</h2>
                                <p>{getTranslation('add.media.subtitle', currentLanguage)}</p>
                            </div>
                            
                            <div className="media-upload">
                                <div className="upload-group">
                                    <label htmlFor="cover">{getTranslation('add.media.coverLabel', currentLanguage)} *</label>
                                    <div className="file-upload-area">
                                        <input 
                                            type="file" 
                                            id="cover"
                                            accept="image/*"
                                            onChange={e => setsingleFile(e.target.files[0])} 
                                        />
                                        <div className="upload-placeholder">
                                            <span className="upload-icon">📁</span>
                                            <p>{getTranslation('add.media.uploadClick', currentLanguage)}</p>
                                            <small>{getTranslation('add.media.uploadHelp', currentLanguage)}</small>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    type="button"
                                    className="upload-btn" 
                                    onClick={handleupload}
                                    disabled={!singleFile}
                                >
                                    {uploading ? (<><span className="spinner"></span>{getTranslation('add.media.uploading', currentLanguage)}</>) : (getTranslation('add.media.uploadBtn', currentLanguage))}
                                </button>
                                {state.cover && <div style={{marginTop:8}}><img src={state.cover} alt="cover" style={{width:160, height:90, objectFit:'cover', borderRadius:8, border:'1px solid #e9ecef'}}/></div>}
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <div className="section-icon">📖</div>
                                <h2>{getTranslation('add.desc.title', currentLanguage)}</h2>
                                <p>{getTranslation('add.desc.subtitle', currentLanguage)}</p>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="desc">{getTranslation('add.desc.label', currentLanguage)} *</label>
                                <textarea
                                    id="desc"
                                    name="desc"
                                    rows="8"
                                    placeholder={getTranslation('add.desc.placeholder', currentLanguage)}
                                    onChange={handlechange}
                                    value={state.desc}
                                    required
                                ></textarea>
                                <small>{getTranslation('add.desc.help', currentLanguage)}</small>
                            </div>
                        </div>

                        {/* Pricing & Delivery Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <div className="section-icon">💰</div>
                                <h2>{getTranslation('add.pricing.title', currentLanguage)}</h2>
                                <p>{getTranslation('add.pricing.subtitle', currentLanguage)}</p>
                            </div>
                            
                            <div className="pricing-row">
                                <div className="form-group">
                                    <label htmlFor="priceMin">{getTranslation('add.pricing.priceLabel', currentLanguage)} *</label>
                                    <div className="price-range-input">
                                        <div className="price-input">
                                            <span className="dollar-sign">$</span>
                                            <input 
                                                type="number" 
                                                id="priceMin"
                                                onChange={handlechange} 
                                                name="priceMin"
                                                placeholder={getTranslation('add.pricing.minPlaceholder', currentLanguage)}
                                                step="0.01"
                                                min="0"
                                                value={state.priceMin}
                                                required
                                            />
                                        </div>
                                        <span className="price-separator">-</span>
                                        <div className="price-input">
                                            <span className="dollar-sign">$</span>
                                            <input 
                                                type="number" 
                                                id="priceMax"
                                                onChange={handlechange} 
                                                name="priceMax"
                                                placeholder={getTranslation('add.pricing.maxPlaceholder', currentLanguage)}
                                                step="0.01"
                                                min="0"
                                                value={state.priceMax}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <small>{getTranslation('add.pricing.priceHelp', currentLanguage)}</small>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="deliveryTime">{getTranslation('add.pricing.deliveryLabel', currentLanguage)} *</label>
                                    <div className="delivery-input">
                                        <input 
                                            type="number" 
                                            id="deliveryTime"
                                            name="deliveryTime" 
                                            min="1" 
                                            onChange={handlechange}
                                            value={state.deliveryTime}
                                            required
                                        />
                                        <span className="unit">{getTranslation('add.pricing.daysUnit', currentLanguage)}</span>
                                    </div>
                                    <small>{getTranslation('add.pricing.deliveryHelp', currentLanguage)}</small>
                                </div>
                            </div>
                        </div>

                        {/* Submit Section */}
                        <div className="submit-section">
                            <button type="submit" className="create-btn">
                                <span className="btn-icon">✨</span>
                                {editId ? 'Update Gig' : getTranslation('add.submit.create', currentLanguage)}
                            </button>
                            <p className="submit-note">{getTranslation('add.submit.note', currentLanguage)}</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Add;