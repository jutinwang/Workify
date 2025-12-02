import React, { useState, useEffect, useRef } from "react";
import { employerApi } from "../../api/employers";
import "./sections.css";

const SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1,000",
  "1,001-5,000",
  "5,001+",
];

export default function CompanyStep({
  state,
  dispatch,
  errors = {},
  onNext,
  onBack,
}) {
  const c = state.company;
  const [companySearchResults, setCompanySearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  function setCompany(p) {
    dispatch({ type: "SET_COMPANY", payload: p });
  }
  function setSocials(p) {
    dispatch({ type: "SET_COMPANY_SOCIALS", payload: p });
  }

  // Debounced company search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (c.name && c.name.length >= 2 && !c.id) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await employerApi.searchCompanies(c.name);
          setCompanySearchResults(response.companies || []);
          setShowDropdown(true);
        } catch (error) {
          console.error("Error searching companies:", error);
          setCompanySearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300); // 300ms debounce
    } else {
      setCompanySearchResults([]);
      setShowDropdown(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [c.name, c.id]);

  const handleSelectExistingCompany = (company) => {
    setCompany({
      id: company.id,
      name: company.name,
      website: company.url || "",
      industry: company.industry || "",
      size: company.size || "",
      about: company.about || "",
      careersUrl: company.careersPage || "",
    });
    setSocials({
      linkedin: company.linkedInUrl || "",
      twitter: company.twitterUrl || "",
      instagram: company.instagramUrl || "",
    });
    setShowDropdown(false);
    setCompanySearchResults([]);
  };

  const handleNameChange = (e) => {
    // Clear company ID when manually editing the name
    setCompany({ id: null, name: e.target.value });
  };

  return (
    <div className="section-card">
      <h2 className="section-title">Company Information</h2>
      <p className="section-sub">Tell candidates who you are.</p>
      <hr />

      <div className="info-container">
        <label className="field">
          <span className="label">Name</span>
          <div style={{ position: "relative" }}>
            <input
              className="input"
              value={c.name}
              onChange={handleNameChange}
              placeholder="Start typing to search existing companies..."
            />
            {isSearching && (
              <div
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                Searching...
              </div>
            )}
            {showDropdown && companySearchResults.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 1000,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                {companySearchResults.map((company) => (
                  <div
                    key={company.id}
                    onClick={() => handleSelectExistingCompany(company)}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "white")
                    }
                  >
                    <div style={{ fontWeight: "500" }}>{company.name}</div>
                    {company.industry && (
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {company.industry}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {c.id && (
            <div
              style={{ fontSize: "12px", color: "#10b981", marginTop: "4px" }}
            >
              ✓ Using existing company
            </div>
          )}
          {errors.name && <span className="error">{errors.name}</span>}
        </label>

        <label className="field">
          <span className="label">Logo (PNG/SVG/JPG)</span>
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={(e) => setCompany({ logo: e.target.files?.[0] || null })}
          />
        </label>

        <label className="field">
          <span className="label">Website URL</span>
          <input
            className="input"
            placeholder="https://example.com"
            value={c.website}
            onChange={(e) => setCompany({ website: e.target.value })}
          />
          {errors.website && <span className="error">{errors.website}</span>}
        </label>

        <label className="field">
          <span className="label">Industry / Sector</span>
          <input
            className="input"
            value={c.industry}
            onChange={(e) => setCompany({ industry: e.target.value })}
          />
          {errors.industry && <span className="error">{errors.industry}</span>}
        </label>

        <label className="field">
          <span className="label">Company Size</span>
          <select
            className="input"
            value={c.size}
            onChange={(e) => setCompany({ size: e.target.value })}
          >
            <option value="">Select…</option>
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.size && <span className="error">{errors.size}</span>}
        </label>

        <label className="field">
          <span className="label">About the company</span>
          <textarea
            className="input"
            rows={4}
            value={c.about}
            onChange={(e) => setCompany({ about: e.target.value })}
          />
        </label>

        <label className="field">
          <span className="label">LinkedIn</span>
          <input
            className="input"
            placeholder="https://linkedin.com/company/..."
            value={c.socials.linkedin}
            onChange={(e) => setSocials({ linkedin: e.target.value })}
          />
          {errors.linkedin && <span className="error">{errors.linkedin}</span>}
        </label>

        <label className="field">
          <span className="label">Twitter/X</span>
          <input
            className="input"
            placeholder="https://x.com/..."
            value={c.socials.twitter}
            onChange={(e) => setSocials({ twitter: e.target.value })}
          />
          {errors.twitter && <span className="error">{errors.twitter}</span>}
        </label>

        <label className="field">
          <span className="label">Instagram</span>
          <input
            className="input"
            placeholder="https://instagram.com/..."
            value={c.socials.instagram}
            onChange={(e) => setSocials({ instagram: e.target.value })}
          />
          {errors.instagram && (
            <span className="error">{errors.instagram}</span>
          )}
        </label>

        <label className="field">
          <span className="label">Careers page (optional)</span>
          <input
            className="input"
            placeholder="https://example.com/careers"
            value={c.careersUrl}
            onChange={(e) => setCompany({ careersUrl: e.target.value })}
          />
          {errors.careersUrl && (
            <span className="error">{errors.careersUrl}</span>
          )}
        </label>
      </div>

      <div className="actions">
        <button className="btn" onClick={onBack}>
          Back
        </button>
        <button className="btn primary" onClick={onNext}>
          Continue
        </button>
      </div>
    </div>
  );
}
