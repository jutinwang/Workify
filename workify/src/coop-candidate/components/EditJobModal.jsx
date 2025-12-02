import React, { useState, useEffect } from "react";
import RichTextEditor from "../../positionwriting/component/RichTextEditor";
import TagSelectionModal from "../../positionwriting/component/TagSelectionModal";
import { AVAILABLE_PROGRAMS } from "../../constants/programs";

const safeParseToPlainText = (value) => {
    if (!value) return "";
    
    try {
        const parsed = JSON.parse(value);
        
        if (Array.isArray(parsed) && parsed.length > 0) {
            if (parsed[0]?.type && parsed[0]?.children) {
                // Extract text from Slate nodes
                return parsed.map(node => {
                    if (node.children) {
                        return node.children.map(child => child.text || '').join('');
                    }
                    return '';
                }).join('\n');
            }
            
            if (parsed[0]?.insert !== undefined) {
                return parsed.map(delta => delta.insert || '').join('');
            }
        }
    
        if (typeof parsed === "string") {
            return parsed;
        }
        
        return "";
    } catch {
        if (typeof value === "string") {
            return value;
        }
        return "";
    }
};

const EditJobModal = ({ job, onClose, onSaved }) => {
    const [coopTitle, setCoopTitle] = useState(job.title ?? "");
    const [coopDescription, setCoopDescription] = useState(() => safeParseToPlainText(job.description));
    const [responsibilities, setResponsibilities] = useState(() => safeParseToPlainText(job.responsibilities));
    const [qualifications, setQualifications] = useState(() => safeParseToPlainText(job.qualification));
    const [benefits, setBenefits] = useState(() => safeParseToPlainText(job.benefits));
    const [salaryRange, setSalaryRange] = useState(() => safeParseToPlainText(job.salary));

    const [jobLength, setJobLength] = useState(job.length ?? "");
    const [workModel, setWorkModel] = useState(job.type ?? "");
    const [officeLocation, setOfficeLocation] = useState(job.location ?? "");

    const [tags, setTags] = useState(
        job.tags?.map((t) => t.displayName) ?? []
    );
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);

    const [programs, setPrograms] = useState(
        Array.isArray(job.programs) ? job.programs : []
    );

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleProgramClick = (program) => {
        if (programs.includes(program)) {
            setPrograms(programs.filter((p) => p !== program));
        } else {
            if (programs.length < 3) {
                setPrograms([...programs, program]);
            }
        }
    };

    const removeProgram = (programToRemove) => {
        setPrograms(programs.filter((p) => p !== programToRemove));
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const safeSlate = (value, fallback = "No content") => {
        if (!value || value.length === 0) {
            return JSON.stringify([
                { type: "paragraph", children: [{ text: fallback }] }
            ]);
        } else if (typeof value == "object") { // if the text is edited, this is handled here
            return JSON.stringify(value);
        } else { // this is here because if the text isn't changed when editing, it passes a string and not a stringified slate JSON
            return JSON.stringify([{ type: "paragraph", children: [{ text: value }] }]);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");

            const token = localStorage.getItem("authToken");
            if (!token) {
                setError("You must be logged in to edit a job.");
                setSaving(false);
                return;
            }

            const payload = {
                title: coopTitle,
                description: safeSlate(coopDescription, "No description provided"),
                location: officeLocation || "Remote",
                length: jobLength || "Unspecified",
                type: workModel || "Remote",
                salary: safeSlate(salaryRange, "No salary provided"),
                responsibilities: safeSlate(responsibilities, "No responsibilities listed"),
                qualification: safeSlate(qualifications, "No qualifications listed"),
                benefits: safeSlate(benefits, "No benefits listed"),
                tags,
                programs,
            };

            console.log("Payload being sent:", payload);

            const res = await fetch(
                `http://localhost:4000/employers/me/jobs/${job.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(data.error || "Failed to update job.");
                return;
            }

            if (onSaved) {
                onSaved(data.job);
            }
            onClose();
        } catch (e) {
            console.error("Error updating job:", e);
            setError("Unexpected error while updating job.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                style={{ maxWidth: "1000px" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>Edit Coop Posting</h2>
                    <button className="modal-close" onClick={onClose}>
                        Close
                    </button>
                </div>

                <div className="modal-body">
                    {error && <div className="error-message">{error}</div>}

                    <div className="positionwriting-container">
                        <div className="content-wrapper">
                            <div className="textInput">
                                {/* Title */}
                                <p>Coop Title</p>
                                <textarea
                                    className="titleInput"
                                    value={coopTitle}
                                    onChange={(e) => setCoopTitle(e.target.value)}
                                    placeholder="Type something..."
                                />

                                {/* Programs */}
                                <p style={{ marginTop: "20px" }}>
                                    Eligible Programs For Applicants (Select up to 3)
                                </p>
                                <div className="programs-section">
                                    <div className="program-selection-grid">
                                        {AVAILABLE_PROGRAMS.map((program) => (
                                            <button
                                                key={program}
                                                type="button"
                                                className={`program-select-btn ${
                                                    programs.includes(program) ? "selected" : ""
                                                } ${
                                                    programs.length >= 3 && !programs.includes(program)
                                                        ? "disabled"
                                                        : ""
                                                }`}
                                                onClick={() => handleProgramClick(program)}
                                                disabled={
                                                    programs.length >= 3 && !programs.includes(program)
                                                }
                                            >
                                                {program}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="program-help-text">
                                        Click to select up to 3 programs
                                    </p>
                                    {programs.length > 0 && (
                                        <div className="selected-programs-display">
                                            {programs.map((program, index) => (
                                                <div className="program-item" key={index}>
                                                    <span className="text">{program}</span>
                                                    <span
                                                        className="close"
                                                        onClick={() => removeProgram(program)}
                                                    >
                                                        &times;
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Length + Work Model */}
                                    <div className="dropdowns">
                                        <p>Coop Length</p>
                                        <select
                                            className="dropdown job-length-dropdown"
                                            value={jobLength}
                                            onChange={(e) => setJobLength(e.target.value)}
                                        >
                                            <option value="" disabled>
                                                Select duration...
                                            </option>
                                            <option value="4 months">4 months</option>
                                            <option value="8 months">8 months</option>
                                            <option value="12 months">12 months</option>
                                            <option value="16 months">16 months</option>
                                        </select>

                                        <p>Work Models</p>
                                        <select
                                            className="dropdown work-model-dropdown"
                                            value={workModel}
                                            onChange={(e) => setWorkModel(e.target.value)}
                                        >
                                            <option value="" disabled>
                                                Select work model...
                                            </option>
                                            <option value="remote">Remote</option>
                                            <option value="hybrid">Hybrid</option>
                                            <option value="inperson">In-Person</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Office Location (if needed) */}
                                {(workModel === "hybrid" || workModel === "inperson") && (
                                    <>
                                        <p>Office Location</p>
                                        <textarea
                                            className="locationInput"
                                            value={officeLocation}
                                            onChange={(e) => setOfficeLocation(e.target.value)}
                                            placeholder="Enter office address or city..."
                                        />
                                    </>
                                )}

                                {/* Description */}
                                <p>Coop Description</p>
                                <RichTextEditor
                                    key={`desc-${job.id}`}
                                    placeholder=" "
                                    initialText={coopDescription}
                                    className="infoInput"
                                    onChange={setCoopDescription}
                                />

                                {/* Responsibilities */}
                                <p>Key Responsibilities</p>
                                <RichTextEditor
                                    key={`resp-${job.id}`}
                                    placeholder=" "
                                    initialText={responsibilities}
                                    className="infoInput"
                                    onChange={setResponsibilities}
                                />

                                {/* Qualifications */}
                                <p>Qualifications</p>
                                <RichTextEditor
                                    key={`qual-${job.id}`}
                                    placeholder=" "
                                    initialText={qualifications}
                                    className="infoInput"
                                    onChange={setQualifications}
                                />

                                {/* Benefits */}
                                <p>Benefits and Perks</p>
                                <RichTextEditor
                                    key={`bene-${job.id}`}
                                    placeholder=" "
                                    initialText={benefits}
                                    className="infoInput"
                                    onChange={setBenefits}
                                />

                                {/* Salary */}
                                <p>Salary Range</p>
                                <RichTextEditor
                                    key={`sal-${job.id}`}
                                    placeholder=" "
                                    initialText={salaryRange}
                                    className="infoInput salary-input"
                                    onChange={setSalaryRange}
                                    customHeight="100px"
                                />
                            </div>

                            {/* Tags */}
                            <p>Role Attributes (Select up to 5)</p>
                            <div className="tags-section">
                                <button
                                    type="button"
                                    className="select-tags-btn"
                                    onClick={() => setIsTagModalOpen(true)}
                                >
                                    {tags.length === 0
                                        ? "Select Role Attributes"
                                        : `${tags.length} Role Attribute${
                                              tags.length !== 1 ? "s" : ""
                                          } Selected`}
                                </button>

                                {tags.length > 0 && (
                                    <div className="selected-tags-display">
                                        {tags.map((tag, index) => (
                                            <div className="tag-item" key={index}>
                                                <span className="text">{tag}</span>
                                                <span className="close" onClick={() => removeTag(tag)}>
                                                    &times;
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <TagSelectionModal
                                isOpen={isTagModalOpen}
                                onClose={() => setIsTagModalOpen(false)}
                                selectedTags={tags}
                                onTagsChange={setTags}
                                maxTags={5}
                            />
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        className="cancel-btn"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        className="post-btn"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditJobModal;