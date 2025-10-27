import React from "react";
import "./sections.css";

const SIZES = ["1-10","11-50","51-200","201-500","501-1,000","1,001-5,000","5,001+"];

export default function CompanyStep({ state, dispatch, errors = {}, onNext, onBack }) {
    const c = state.company;

    function setCompany(p) { dispatch({ type: "SET_COMPANY", payload: p }); }
    function setSocials(p) { dispatch({ type: "SET_COMPANY_SOCIALS", payload: p }); }

    return (
        <div className="section-card">
            <h2 className="section-title">Company Information</h2>
            <p className="section-sub">Tell candidates who you are.</p>
            <hr />

            <div className="info-container">
                <label className="field">
                    <span className="label">Name</span>
                    <input className="input" value={c.name} onChange={e=>setCompany({name:e.target.value})} />
                    {errors.name && <span className="error">{errors.name}</span>}
                </label>

                <label className="field">
                    <span className="label">Logo (PNG/SVG/JPG)</span>
                    <input className="input" type="file" accept="image/*"
                            onChange={(e)=>setCompany({logo: e.target.files?.[0] || null})} />
                </label>

                <label className="field">
                    <span className="label">Website URL</span>
                    <input className="input" placeholder="https://example.com"
                            value={c.website} onChange={e=>setCompany({website:e.target.value})} />
                    {errors.website && <span className="error">{errors.website}</span>}
                </label>

                <label className="field">
                    <span className="label">Industry / Sector</span>
                    <input className="input" value={c.industry} onChange={e=>setCompany({industry:e.target.value})} />
                    {errors.industry && <span className="error">{errors.industry}</span>}
                </label>

                <label className="field">
                    <span className="label">Company Size</span>
                    <select className="input" value={c.size} onChange={e=>setCompany({size:e.target.value})}>
                        <option value="">Select…</option>
                        {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.size && <span className="error">{errors.size}</span>}
                </label>

                <label className="field">
                    <span className="label">About the company</span>
                    <textarea className="input" rows={4} value={c.about}
                                onChange={e=>setCompany({about:e.target.value})} />
                </label>

                <label className="field">
                    <span className="label">LinkedIn</span>
                    <input className="input" placeholder="https://linkedin.com/company/..."
                            value={c.socials.linkedin} onChange={e=>setSocials({linkedin:e.target.value})} />
                    {errors.linkedin && <span className="error">{errors.linkedin}</span>}
                </label>

                <label className="field">
                    <span className="label">Twitter/X</span>
                    <input className="input" placeholder="https://x.com/..."
                            value={c.socials.twitter} onChange={e=>setSocials({twitter:e.target.value})} />
                    {errors.twitter && <span className="error">{errors.twitter}</span>}
                </label>

                <label className="field">
                    <span className="label">Instagram</span>
                    <input className="input" placeholder="https://instagram.com/..."
                            value={c.socials.instagram} onChange={e=>setSocials({instagram:e.target.value})} />
                    {errors.instagram && <span className="error">{errors.instagram}</span>}
                </label>

                <label className="field">
                    <span className="label">Careers page (optional)</span>
                    <input className="input" placeholder="https://example.com/careers"
                            value={c.careersUrl} onChange={e=>setCompany({careersUrl:e.target.value})} />
                    {errors.careersUrl && <span className="error">{errors.careersUrl}</span>}
                </label>
            </div>

            <div className="actions">
                <button className="btn" onClick={onBack}>Back</button>
                <button className="btn primary" onClick={onNext}>Continue</button>
            </div>
        </div>
    );
}
