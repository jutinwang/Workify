import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import './PositionWriting.css';

const PositionWriting = () => {
    const [coopDescription, setCoopDescription] = useState("");
    const [responsibilities, setResponsibilities] = useState("");
    const [qualifications, setQualifications] = useState("");
    const [benefits, setBenefits] = useState("");
    const [jobLength, setJobLength] = useState("");
    const [salaryRange, setSalaryRange] = useState("");
    const [workModel, setWorkModel] = useState("");
    const [officeLocation, setOfficeLocation] = useState(""); 
    const[tags, setTags] = useState([])

    const textareaRef = useRef(null);

    const handleCoopDescriptionChange = (description) => setCoopDescription(description.target.value);
    const handleResponsibilitiesChange = (responsibility) => setResponsibilities(responsibility.target.value);
    const handleQualificationsChange = (qualification) => setQualifications(qualification.target.value);
    const handleBenefetsChange = (benefet) => setBenefits(benefet.target.value);
    const handleSalaryChange = (salary) => setSalaryRange(salary.target.value);
    const handleOfficeLocationChange = (location) => setOfficeLocation(location.target.value);


    function handleKeyDown(e) {
        if (e.key !== 'Enter') return
        const value = e.target.value
        if (!value.trim()) return
        setTags([...tags, value])
        e.target.value = ''
    }

    function removeTag(index) {
        setTags(tags.filter((el, i) => i !== index))
    }

    // TODO: CHANGE CONTENTS SO IT POSTS JOB TO BACKEND
    function postJob() {
        setCoopDescription("");
        setResponsibilities("");
        setQualifications("");
        setBenefits("");
        setJobLength("");
        setSalaryRange("");
        setWorkModel("");
        setTags([]);
    }

    return (
        <div className="positionwriting-container">
            <div className="content-wrapper">
                <h3>Create Coop Posting</h3>
                <div className="textInput">
                    <p>Coop Description</p>
                    <textarea className="infoInput"
                        ref={textareaRef}
                        value={coopDescription}
                        onChange={handleCoopDescriptionChange}
                        placeholder="Type something..."
                    />

                     <p>Key Resposibilities</p>
                    <textarea className="infoInput"
                        ref={textareaRef}
                        value={responsibilities}
                        onChange={handleResponsibilitiesChange}
                        placeholder="Type something..."
                    />

                    <p>Qualifications</p>
                    <textarea className="infoInput"
                        ref={textareaRef}
                        value={qualifications}
                        onChange={handleQualificationsChange}
                        placeholder="Type something..."
                    />

                    <p>Benefits and Perks</p>
                    <textarea className="infoInput"
                        ref={textareaRef}
                        value={benefits}
                        onChange={handleBenefetsChange}
                        placeholder="Type something..."
                    />

                    <p>Salary Range</p>
                    <textarea className="infoInput"
                        ref={textareaRef}
                        value={salaryRange}
                        onChange={handleSalaryChange}
                        placeholder="Type something..."
                    />
                    
                    <div className="dropdowns">
                        <p>Job Length</p>
                        <select
                            className="dropdown job-length-dropdown"
                            value={jobLength}
                            onChange={(e) => setJobLength(e.target.value)}
                        >
                            <option value="" disabled selected>Select duration...</option>
                            <option value="4">4 months</option>
                            <option value="8">8 months</option>
                            <option value="12">12 months</option>
                            <option value="16">16 months</option>
                        </select>

                        <p>Work Models</p>
                        <select
                            className="dropdown work-model-dropdown"
                            value={workModel}
                            onChange={(e) => setWorkModel(e.target.value)}
                        >
                            <option value="" disabled selected>Select work model...</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="inperson">In-Person</option>
                        </select>
                    </div>
                </div>

                {(workModel === "hybrid" || workModel === "inperson") && (
                        <>
                            <p>Office Location</p>
                            <textarea
                                className="locationInput"
                                ref={textareaRef}
                                value={officeLocation}
                                onChange={handleOfficeLocationChange}
                                placeholder="Enter office address or city..."
                            />
                        </>
                    )}

                <p>Tags</p>
                <div className="tags-container">
                    {/* https://www.youtube.com/watch?v=l8Jd7Ub4yJE */}
                    { tags.map((tag, index) => (
                        <div className="tag-item" key={index}>
                            <span className="text">{tag}</span>
                            <span className="close" onClick={() => removeTag(index)}>&times;</span>
                        </div>
                    ))}
                    <input onKeyDown={handleKeyDown} type="text" className="tags-input" placeholder="Add Tags Here..."></input>
                </div>

                <div className="button-container">
                    <Link
                        to={`/profile-employer`}
                        className="navigateHome"
                        title="Go Back"
                        >
                        <button className="cancel-btn">Cancel</button>                    
                    </Link>
                    <button className="post-btn" onClick={postJob}>Post</button>
                </div>
            </div>
        </div>
    );
};

export default PositionWriting;