import React, { useEffect, useReducer, useState } from "react";
import './add.scss';
import { INITIAL_STATE, gigReducer } from "../../reducers/gigReducers";
import upload from '../../utils/upload.js';
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate, useLocation } from "react-router-dom";
import { GIG_CATEGORIES } from "../../constants/categories";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTranslation } from "../../translations/translations";
import { motion, AnimatePresence } from 'framer-motion';

const Add = () => {
    const [singleFile, setsingleFile] = useState(undefined);
    const [documentFile, setDocumentFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

    const { currentLanguage } = useLanguage();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { search } = useLocation();
    const editId = new URLSearchParams(search).get('edit');

    const { data: existingGig } = useQuery({
        queryKey: ['edit-gig', editId],
        queryFn: () => newRequest.get(`/gigs/single/${editId}`).then(r => r.data),
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
        mutationFn: (gig) => newRequest.post("/gigs", gig, gig instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}),
        onSuccess: () => { queryClient.invalidateQueries(["myGigs"]) }
    });

    const updateMutation = useMutation({
        mutationFn: (gig) => newRequest.patch(`/gigs/${editId}`, gig, gig instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}),
        onSuccess: () => { queryClient.invalidateQueries(["myGigs"]) }
    });

    const handlechange = (e) => {
        const name = e.target.name;
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        dispatch({ type: "CHANGE_INPUT", payload: { name, value } })
    }

    const handleNumericChange = (name, raw) => {
        const cleaned = String(raw).replace(/[^0-9.]/g, '');
        const parts = cleaned.split('.');
        const normalized = parts.length > 1
            ? `${parts[0]}.${parts.slice(1).join('').slice(0, 2)}`
            : parts[0];
        dispatch({ type: "CHANGE_INPUT", payload: { name, value: normalized } });
    }

    const handleupload = async () => {
        setUploading(true);
        try {
            const cover = await upload(singleFile);
            setUploading(false);
            dispatch({ type: "ADD_IMAGES", payload: { cover, images: [] } })
        } catch (error) { 
            console.log(error); 
            setUploading(false);
        }
    };

    const handlesubmit = (e) => {
        e.preventDefault();
        if (!state.cat) { 
            alert(getTranslation('add.alert.categoryRequired', currentLanguage)); 
            return; 
        }
        if (!state.title || !state.desc || !state.deliveryTime) { 
            alert(getTranslation('add.alert.requiredFields', currentLanguage)); 
            return; 
        }
        const payload = { ...state };
        const days = Number(state.deliveryTime || 0);
        const pages = Number(state.pages || 0);
        // Pricing: 1 day = $18; 2+ days = $10 (flat)
        const pricePerPage = days === 1 ? 18 : (days >= 2 ? 10 : 0);
        const total = pages * pricePerPage;
        payload.pricePerPage = pricePerPage;
        payload.totalPrice = total;
        // If a document file is provided, send multipart so backend stores in DB
        if (documentFile) {
            const form = new FormData();
            Object.entries(payload).forEach(([k,v])=>{ if(v!==undefined && v!==null) form.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v)); });
            form.append('document', documentFile);
            if (editId) {
                updateMutation.mutate(form);
            } else {
                createMutation.mutate(form);
            }
        } else {
            if (editId) {
                updateMutation.mutate(payload);
            } else {
                createMutation.mutate(payload);
            }
        }
        navigate('/mygigs')
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
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

    return (
        <div className="add">
            <div className="container">
                <motion.div 
                    className="header"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1>{editId ? 'Edit Gig' : getTranslation('add.header.title', currentLanguage)}</h1>
                    <p>{getTranslation('add.header.subtitle', currentLanguage)}</p>
                </motion.div>

                <motion.div 
                    className="form-container"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    <form onSubmit={handlesubmit}>
                        {/* Basic Information Section */}
                        <motion.div 
                            className="form-section stagger-children"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div className="section-header" variants={itemVariants}>
                                <div className="section-icon">📝</div>
                                <div>
                                    <h2>{getTranslation('add.basic.title', currentLanguage)}</h2>
                                    <p>{getTranslation('add.basic.subtitle', currentLanguage)}</p>
                                </div>
                            </motion.div>

                            <motion.div className="form-group" variants={itemVariants}>
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
                            </motion.div>

                            <motion.div className="form-group" variants={itemVariants}>
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
                                        <option key={category} value={category} style={{ color: '#000', background: '#fff' }}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <small>{getTranslation('add.basic.categoryHelp', currentLanguage)}</small>
                            </motion.div>
                        </motion.div>

                        {/* Media Section (Photos) */}
                        <motion.div 
                            className="form-section stagger-children"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div className="section-header" variants={itemVariants}>
                                <div className="section-icon">🖼️</div>
                                <div>
                                    <h2>{getTranslation('add.media.title', currentLanguage)}</h2>
                                    <p>Upload your cover photo (images only)</p>
                                </div>
                            </motion.div>

                            <motion.div className="media-upload" variants={itemVariants}>
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
                                            <small>Accepted: PNG, JPG, GIF, WEBP.</small>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    type="button"
                                    className="upload-btn"
                                    onClick={handleupload}
                                    disabled={!singleFile || uploading}
                                    whileHover={!singleFile || uploading ? {} : { scale: 1.05 }}
                                    whileTap={!singleFile || uploading ? {} : { scale: 0.95 }}
                                >
                                    {uploading ? (
                                        <>
                                            <span className="spinner"></span>
                                            {getTranslation('add.media.uploading', currentLanguage)}
                                        </>
                                    ) : (
                                        getTranslation('add.media.uploadBtn', currentLanguage)
                                    )}
                                </motion.button>
                                
                                <AnimatePresence>
                                    {state.cover && (
                                        <motion.div
                                            style={{ marginTop: 16 }}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            {/\.(png|jpe?g|gif|webp)$/i.test(state.cover) ? (
                                                <img 
                                                    src={state.cover} 
                                                    alt="cover" 
                                                    style={{ 
                                                        width: 160, 
                                                        height: 90, 
                                                        objectFit: 'cover', 
                                                        borderRadius: 12, 
                                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                                                    }} 
                                                />
                                            ) : (
                                                <a 
                                                    href={state.cover} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 12,
                                                        padding: '12px 16px',
                                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                                        borderRadius: 12,
                                                        textDecoration: 'none',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        backdropFilter: 'blur(10px)'
                                                    }}
                                                >
                                                    <span style={{ fontSize: 20 }}>📄</span>
                                                    <span style={{ fontSize: 14, color: '#ffffff', fontWeight: 600 }}>
                                                        View uploaded file
                                                    </span>
                                                </a>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>

                        {/* Document Section */}
                        <motion.div 
                            className="form-section stagger-children"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div className="section-header" variants={itemVariants}>
                                <div className="section-icon">📄</div>
                                <div>
                                    <h2>Supporting Document</h2>
                                    <p>Upload a brief/requirements document for bidders to read or download.</p>
                                </div>
                            </motion.div>

                            <motion.div className="media-upload" variants={itemVariants}>
                                <div className="upload-group">
                                    <label htmlFor="document">Attach document (optional)</label>
                                    <div className="file-upload-area">
                                        <input
                                            type="file"
                                            id="document"
                                            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/zip,application/x-zip-compressed,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                            onChange={e => setDocumentFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                                        />
                                        <div className="upload-placeholder">
                                            <span className="upload-icon">📎</span>
                                            <p>PDF, DOC/DOCX, TXT, ZIP, XLS/XLSX</p>
                                            {documentFile && <small>Selected: {documentFile.name}</small>}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Description Section */}
                        <motion.div 
                            className="form-section stagger-children"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div className="section-header" variants={itemVariants}>
                                <div className="section-icon">📖</div>
                                <div>
                                    <h2>{getTranslation('add.desc.title', currentLanguage)}</h2>
                                    <p>{getTranslation('add.desc.subtitle', currentLanguage)}</p>
                                </div>
                            </motion.div>

                            <motion.div className="form-group" variants={itemVariants}>
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
                            </motion.div>
                        </motion.div>

                        {/* Pricing & Delivery Section */}
                        <motion.div 
                            className="form-section stagger-children"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div className="section-header" variants={itemVariants}>
                                <div className="section-icon">💰</div>
                                <div>
                                    <h2>{getTranslation('add.pricing.title', currentLanguage)}</h2>
                                    <p>{getTranslation('add.pricing.subtitle', currentLanguage)}</p>
                                </div>
                            </motion.div>

                            <motion.div className="pricing-row" variants={itemVariants}>
                                <div className="form-group">
                                    <label htmlFor="pages">Number of pages *</label>
                                    <input 
                                        type="number" 
                                        id="pages" 
                                        name="pages" 
                                        min="1" 
                                        value={state.pages} 
                                        onChange={handlechange} 
                                    />
                                    <small>Specify how many pages are required.</small>
                                </div>

                                {/* Move Delivery Time before Price Per Page */}
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

                                {/* Price per page now uses flat rule for 2+ days */}
                                <div className="form-group">
                                    <label htmlFor="pricePerPage">Price per page (auto) *</label>
                                    <div className="price-range-input">
                                        <div className="price-input">
                                            <span className="dollar-sign">$</span>
                                            <input
                                                type="text"
                                                id="pricePerPage"
                                                name="pricePerPage"
                                                value={(() => { 
                                                    const d = Number(state.deliveryTime || 0); 
                                                    return d === 1 ? 18 : (d >= 2 ? 10 : 0); 
                                                })()}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <small>Auto: per-page price — 1 day = $18; 2+ days = $10.</small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="totalPrice">Total price (auto)</label>
                                    <input 
                                        type="number" 
                                        id="totalPrice" 
                                        name="totalPrice" 
                                        value={(() => { 
                                            const d = Number(state.deliveryTime || 0); 
                                            const p = Number(state.pages || 0); 
                                            const rate = d === 1 ? 18 : (d >= 2 ? 10 : 0); 
                                            return p * rate; 
                                        })()} 
                                        readOnly 
                                    />
                                </div>
                            </motion.div>

                            <motion.div className="form-section" style={{ marginTop: 24 }} variants={itemVariants}>
                                <div className="section-header">
                                    <div className="section-icon">🏷️</div>
                                    <div>
                                        <h2>Optional Discount</h2>
                                        <p>Offer a discount for faster completion or special conditions.</p>
                                    </div>
                                </div>
                                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <input 
                                        type="checkbox" 
                                        id="discountEnabled" 
                                        name="discountEnabled" 
                                        checked={!!state.discountEnabled} 
                                        onChange={handlechange} 
                                    />
                                    <label htmlFor="discountEnabled" style={{ marginBottom: 0 }}>Enable discount</label>
                                </div>
                                <AnimatePresence>
                                    {state.discountEnabled && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="form-group">
                                                <label htmlFor="discountAmount">Discount amount (USD)</label>
                                                <div className="price-range-input">
                                                    <div className="price-input">
                                                        <span className="dollar-sign">$</span>
                                                        <input 
                                                            type="number" 
                                                            id="discountAmount" 
                                                            name="discountAmount" 
                                                            min="0" 
                                                            step="0.01" 
                                                            value={state.discountAmount} 
                                                            onChange={handlechange} 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="discountCondition">Discount condition</label>
                                                <input 
                                                    type="text" 
                                                    id="discountCondition" 
                                                    name="discountCondition" 
                                                    placeholder="e.g., $4 off if delivered in half the estimated days" 
                                                    value={state.discountCondition} 
                                                    onChange={handlechange} 
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>

                        {/* Submit Section */}
                        <motion.div 
                            className="submit-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <motion.button 
                                type="submit" 
                                className="create-btn"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="btn-icon">✨</span>
                                {editId ? 'Update Gig' : getTranslation('add.submit.create', currentLanguage)}
                            </motion.button>
                            <p className="submit-note">{getTranslation('add.submit.note', currentLanguage)}</p>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

export default Add;