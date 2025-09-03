import React, { useEffect, useMemo, useRef, useState } from "react";
import './profile.scss';
import { useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import upload from "../../utils/upload";

const CountrySelect = ({ name, defaultValue }) => {
    const [query, setQuery] = useState("");
    const countries = useMemo(() => [
        "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan",
        "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
        "Cambodia","Cameroon","Canada","Cape Verde","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic",
        "Denmark","Djibouti","Dominica","Dominican Republic",
        "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
        "Fiji","Finland","France",
        "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
        "Haiti","Honduras","Hungary",
        "Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy",
        "Jamaica","Japan","Jordan",
        "Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan",
        "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
        "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
        "Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway",
        "Oman",
        "Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
        "Qatar",
        "Romania","Russia","Rwanda",
        "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
        "Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
        "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
        "Vanuatu","Vatican City","Venezuela","Vietnam",
        "Yemen",
        "Zambia","Zimbabwe"
    ], []);
    const filtered = useMemo(() => countries.filter(c => c.toLowerCase().includes(query.toLowerCase())), [countries, query]);
    return (
        <div className="country-select">
            <input placeholder="Search nationality" value={query} onChange={e => setQuery(e.target.value)} />
            <select name={name} defaultValue={defaultValue}>
                {filtered.map(c => (<option key={c} value={c}>{c}</option>))}
            </select>
        </div>
    );
};

const Profile = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const { data: user, isLoading, error } = useQuery({
        queryKey: ['profile', id],
        queryFn: () => newRequest.get(`/users/${id}`).then(r => r.data),
        enabled: !!id,
    });

    const { data: userReviews } = useQuery({
        queryKey: ['user-reviews', id],
        queryFn: () => newRequest.get(`/user-reviews/${id}`).then(r => r.data),
        enabled: !!id,
    });

    const { data: gigsMap } = useQuery({
        queryKey: ['user-review-gigs', id, userReviews?.length || 0],
        queryFn: async () => {
            const uniqueGigIds = Array.from(new Set((userReviews||[]).map(r=>r.gigId)));
            const entries = await Promise.all(uniqueGigIds.map(async gid => {
                try { const g = await newRequest.get(`/gigs/single/${gid}`).then(r=>r.data); return [gid, g.title]; } catch { return [gid, `#${gid}`]; }
            }));
            return Object.fromEntries(entries);
        },
        enabled: !!(userReviews && userReviews.length),
    });

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isOwner = currentUser?._id === id;

    const updateMutation = useMutation({
        mutationFn: (payload) => newRequest.put(`/users/${id}`, payload),
        onSuccess: () => queryClient.invalidateQueries(['profile', id]),
    });

    const formRef = useRef(null);

    const [eduList, setEduList] = useState(user?.education || []);
    const [certList, setCertList] = useState(user?.certifications || []);
    const [editing, setEditing] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        const form = formRef.current;
        const payload = {
            fullName: form.fullName.value,
            bio: form.bio.value,
            country: form.country.value,
            nationality: form.nationality.value,
            phone: form.phone.value,
            education: eduList,
            hobbies: form.hobbies.value ? form.hobbies.value.split('\n').map(s => s.trim()).filter(Boolean) : [],
            experience: form.experience.value ? form.experience.value.split('\n').map(s => s.trim()).filter(Boolean) : [],
            certifications: certList,
            social: {
                linkedin: form.linkedin.value,
                twitter: form.twitter.value,
                github: form.github.value,
                website: form.website.value,
            }
        };
        updateMutation.mutate(payload);
    };

    const ensureHtml2Pdf = () => new Promise((resolve, reject) => {
        if (window.html2pdf) return resolve(window.html2pdf);
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => resolve(window.html2pdf);
        script.onerror = reject;
        document.body.appendChild(script);
    });

    const downloadPdf = async () => {
        try {
            await ensureHtml2Pdf();
            const element = document.querySelector('.cv-print');
            const opt = {
                margin:       10,
                filename:     'job-portal-profile.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
            };
            window.html2pdf().set(opt).from(element).save();
        } catch (e) {
            window.print();
        }
    };

    useEffect(() => {
        const doDownload = async () => {
            try {
                await new Promise(r => setTimeout(r, 400));
                await downloadPdf();
                if (searchParams.get('download') === '1') {
                    setTimeout(() => window.close(), 600);
                }
            } catch {}
        };
        if (searchParams.get('print') === '1' || searchParams.get('download') === '1') {
            doDownload();
        }
    }, [searchParams]);

    if (isLoading) return <div className="profile"><div className="container">Loading...</div></div>;
    if (error) return <div className="profile"><div className="container">Something went wrong</div></div>;

    return (
        <div className="profile">
            <div className="container" id="cv-root">
                <div className="header">
                    <img src={user?.img || '/images/noavtar.jpeg'} alt="avatar" className="avatar" />
                    <div className="identity">
                        <h1>{user?.fullName || user?.username}</h1>
                        <p>@{user?.username}</p>
                        <p>{user?.country} {user?.nationality ? `· ${user.nationality}` : ''} {user?.phone ? `· ${user.phone}` : ''}</p>
                    </div>
                    <button className="download" onClick={downloadPdf}>Download PDF</button>
                </div>

                <div className="reviews-readonly">
                    <h2>Client Reviews</h2>
                    {(userReviews || []).length === 0 && <div className="empty">No reviews yet.</div>}
                    {(userReviews || []).map((r) => (
                        <div className="review-card" key={r._id}>
                            <div className="stars">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
                            <div className={`pill pill-${r.satisfaction}`}>{r.satisfaction.replace('_',' ')}</div>
                            <p className="comment">{r.comment}</p>
                            <div className="meta">on gig {gigsMap ? (gigsMap[r.gigId] || `#${r.gigId}`) : `#${r.gigId}`}</div>
                        </div>
                    ))}
                </div>

                <div className="profile-body">
                    <div className="card about">
                        <h2>About</h2>
                        <div className="field"><div className="value">{user?.bio || 'No bio yet.'}</div></div>
                    </div>
                    <div className="card">
                        <h2>Contact</h2>
                        <div className="field"><div className="label">Email</div><div className="value">{user?.email}</div></div>
                        <div className="field"><div className="label">Phone</div><div className="value">{user?.phone || '—'}</div></div>
                        <div className="field"><div className="label">Country</div><div className="value">{user?.country || '—'}</div></div>
                        <div className="field"><div className="label">Nationality</div><div className="value">{user?.nationality || '—'}</div></div>
                    </div>
                    <div className="card">
                        <h2>Education</h2>
                        <div className="list">
                            {(user?.education || []).length === 0 && <div className="list-item">No education added.</div>}
                            {(user?.education || []).map((ed, i)=>(
                                <div className="list-item" key={i}>
                                    <div className="title">{ed.institution || 'Institution'}</div>
                                    <div className="sub">{ed.qualification || ''} {ed.grade ? `· ${ed.grade}` : ''}</div>
                                    <div className="sub">{(ed.start||'')}{(ed.start||ed.end)?' - ':''}{ed.end||''}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card">
                        <h2>Experience</h2>
                        <div className="list">
                            {(user?.experience || []).length === 0 && <div className="list-item">No experience added.</div>}
                            {(user?.experience || []).map((line,i)=>(<div className="list-item" key={i}>{line}</div>))}
                        </div>
                    </div>
                    <div className="card">
                        <h2>Certifications</h2>
                        <div className="list">
                            {(user?.certifications || []).length === 0 && <div className="list-item">No certifications added.</div>}
                            {(user?.certifications || []).map((c,i)=>(
                                <div className="list-item" key={i}>
                                    <div className="title">{c.title || 'Title'}</div>
                                    <div className="sub">{[c.issuer,c.issuedOn,c.credentialId].filter(Boolean).join(' · ')}</div>
                                    {c.url && <div className="sub">{c.url}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card">
                        <h2>Social</h2>
                        <div className="list">
                            {user?.social?.linkedin && <div className="list-item">LinkedIn: {user.social.linkedin}</div>}
                            {user?.social?.twitter && <div className="list-item">Twitter: {user.social.twitter}</div>}
                            {user?.social?.github && <div className="list-item">GitHub: {user.social.github}</div>}
                            {user?.social?.website && <div className="list-item">Website: {user.social.website}</div>}
                            {!(user?.social && (user.social.linkedin||user.social.twitter||user.social.github||user.social.website)) && <div className="list-item">No social links added.</div>}
                        </div>
                    </div>
                </div>

                {isOwner && (
                    <div className="edit-bar">
                        <button className="edit-btn" onClick={()=>setEditing(!editing)}>{editing ? 'Close Edit' : 'Edit Profile'}</button>
                    </div>
                )}

                {isOwner && (
                    <form ref={formRef} className={editing ? 'sections editing' : 'sections'} onSubmit={handleSave}>
                        <div className="section">
                            <h2>About</h2>
                            <textarea name="bio" maxLength={1000} defaultValue={user?.bio || ''} placeholder="Tell us about yourself (≤ 400 words)"></textarea>
                        </div>
                        <div className="grid">
                            <div className="section">
                                <h2>Personal Info</h2>
                                <input name="fullName" placeholder="Full Name" defaultValue={user?.fullName || ''} />
                                <input name="country" placeholder="Country" defaultValue={user?.country || ''} />
                                <CountrySelect name="nationality" defaultValue={user?.nationality || ''} />
                                <input name="phone" placeholder="Phone" defaultValue={user?.phone || ''} />
                                <input name="email" placeholder="Email" defaultValue={user?.email || ''} disabled />
                            </div>
                            <div className="section">
                                <h2>Social Accounts</h2>
                                <input name="linkedin" placeholder="LinkedIn URL" defaultValue={user?.social?.linkedin || ''} />
                                <input name="twitter" placeholder="Twitter URL" defaultValue={user?.social?.twitter || ''} />
                                <input name="github" placeholder="GitHub URL" defaultValue={user?.social?.github || ''} />
                                <input name="website" placeholder="Personal Website URL" defaultValue={user?.social?.website || ''} />
                            </div>
                        </div>
                        <div className="grid">
                            <div className="section">
                                <h2>Education</h2>
                                {(eduList || []).map((ed, idx) => (
                                    <div className="row" key={idx}>
                                        <input placeholder="University / College" value={ed.institution || ''} onChange={e => { const copy=[...eduList]; copy[idx]={...copy[idx], institution:e.target.value}; setEduList(copy); }} />
                                        <input placeholder="Degree / Diploma" value={ed.qualification || ''} onChange={e => { const copy=[...eduList]; copy[idx]={...copy[idx], qualification:e.target.value}; setEduList(copy); }} />
                                        <input placeholder="Grade" value={ed.grade || ''} onChange={e => { const copy=[...eduList]; copy[idx]={...copy[idx], grade:e.target.value}; setEduList(copy); }} />
                                        <input placeholder="Start (e.g., 2019)" value={ed.start || ''} onChange={e => { const copy=[...eduList]; copy[idx]={...copy[idx], start:e.target.value}; setEduList(copy); }} />
                                        <input placeholder="End (e.g., 2023)" value={ed.end || ''} onChange={e => { const copy=[...eduList]; copy[idx]={...copy[idx], end:e.target.value}; setEduList(copy); }} />
                                    </div>
                                ))}
                                <button type="button" onClick={() => setEduList([...(eduList || []), { institution: '', qualification: '', grade: '' }])}>Add Education</button>
                            </div>
                            <div className="section">
                                <h2>Hobbies</h2>
                                <textarea name="hobbies" placeholder="One per line" defaultValue={(user?.hobbies || []).join('\n')}></textarea>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="section">
                                <h2>Experience</h2>
                                <textarea name="experience" placeholder="One per line" defaultValue={(user?.experience || []).join('\n')}></textarea>
                            </div>
                            <div className="section">
                                <h2>Certifications</h2>
                                {(certList || []).map((c, idx) => (
                                    <div className="row" key={idx}>
                                        <input placeholder="Title" value={c.title || ''} onChange={e => { const cp=[...certList]; cp[idx] = { ...cp[idx], title: e.target.value }; setCertList(cp); }} />
                                        <input placeholder="Issuer" value={c.issuer || ''} onChange={e => { const cp=[...certList]; cp[idx] = { ...cp[idx], issuer: e.target.value }; setCertList(cp); }} />
                                        <input placeholder="Credential ID" value={c.credentialId || ''} onChange={e => { const cp=[...certList]; cp[idx] = { ...cp[idx], credentialId: e.target.value }; setCertList(cp); }} />
                                        <input placeholder="URL" value={c.url || ''} onChange={e => { const cp=[...certList]; cp[idx] = { ...cp[idx], url: e.target.value }; setCertList(cp); }} />
                                    </div>
                                ))}
                                <button type="button" onClick={() => setCertList([...(certList || []), { title: '' }])}>Add Certification</button>
                            </div>
                        </div>
                        <div className="actions">
                            <button type="submit" disabled={updateMutation.isLoading}>Save Profile</button>
                            {updateMutation.isSuccess && <span className="saved">Saved!</span>}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Profile;


