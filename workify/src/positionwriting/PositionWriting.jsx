import { useState, useRef } from "react";
import './PositionWriting.css';

const PositionWriting = () => {
    // const [formData] = useState({
    //     jobtags: ["Software", "Agile", "Front-end", "Teamwork"]
    // });
    const [coopDescription, setCoopDescription] = useState("");
    const [responsibilities, setResponsibilities] = useState("");
    const [qualifications, setQualifications] = useState("");
    const [benefits, setBenefits] = useState("");
    const [jobLength, setJobLength] = useState("");
    const [salaryRange, setSalaryRange] = useState("");
    const [workModel, setWorkModel] = useState("");

    const textareaRef = useRef(null);

    const handleCoopDescriptionChange = (description) => {
        setCoopDescription(description.target.value);
    };
    const handleResponsibilitiesChange = (responsibility) => {
        setResponsibilities(responsibility.target.value);
    };
    const handleQualificationsChange = (qualification) => {
        setQualifications(qualification.target.value);
    };
    const handleBenefetsChange = (benefet) => {
        setBenefits(benefet.target.value);
    };
    const handleSalaryChange = (salary) => {
        setSalaryRange(salary.target.value);
    };


    return (
        <div className="positionwriting-container">
            <div className="content-wrapper">
                <h3>Create Coop Posting</h3>
                <div className="textInput">
                    <p>Coop Description</p>
                    <textarea className="textInput"
                        ref={textareaRef}
                        value={coopDescription}
                        onChange={handleCoopDescriptionChange}
                        placeholder="Type something..."
                        style={{
                            minHeight: '40px', // Optional: set a minimum height
                            resize: 'none',    // Prevent manual resizing by user
                            overflowY: 'auto',
                            overflow: 'hidden', // Hide scrollbar
                            width: '100%',     // Adjust as needed
                            height: '250px',
                            border: '1.5px',
                            borderStyle: 'solid',
                            borderColor: 'black',
                            borderRadius: '8px',
                            padding: '10px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />

                     <p>Key Resposibilities</p>
                    <textarea className="textInput"
                        ref={textareaRef}
                        value={responsibilities}
                        onChange={handleResponsibilitiesChange}
                        placeholder="Type something..."
                        style={{
                            minHeight: '40px', // Optional: set a minimum height
                            resize: 'none',    // Prevent manual resizing by user
                            overflowY: 'auto',
                            overflow: 'hidden', // Hide scrollbar
                            width: '100%',     // Adjust as needed
                            height: '250px',
                            border: '1.5px',
                            borderStyle: 'solid',
                            borderColor: 'black',
                            borderRadius: '8px',
                            padding: '10px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />

                    <p>Qualifications</p>
                    <textarea className="textInput"
                        ref={textareaRef}
                        value={qualifications}
                        onChange={handleQualificationsChange}
                        placeholder="Type something..."
                        style={{
                            minHeight: '40px', // Optional: set a minimum height
                            resize: 'none',    // Prevent manual resizing by user
                            overflowY: 'auto',
                            overflow: 'hidden', // Hide scrollbar
                            width: '100%',     // Adjust as needed
                            height: '250px',
                            border: '1.5px',
                            borderStyle: 'solid',
                            borderColor: 'black',
                            borderRadius: '8px',
                            padding: '10px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />

                    <p>Benefits and Perks</p>
                    <textarea className="textInput"
                        ref={textareaRef}
                        value={benefits}
                        onChange={handleBenefetsChange}
                        placeholder="Type something..."
                        style={{
                            minHeight: '40px', // Optional: set a minimum height
                            resize: 'none',    // Prevent manual resizing by user
                            overflowY: 'auto',
                            overflow: 'hidden', // Hide scrollbar
                            width: '100%',     // Adjust as needed
                            height: '250px',
                            border: '1.5px',
                            borderStyle: 'solid',
                            borderColor: 'black',
                            borderRadius: '8px',
                            padding: '10px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />

                    <p>Salary Range</p>
                    <textarea className="textInput"
                        ref={textareaRef}
                        value={salaryRange}
                        onChange={handleSalaryChange}
                        placeholder="Type something..."
                        style={{
                            minHeight: '40px', // Optional: set a minimum height
                            resize: 'none',    // Prevent manual resizing by user
                            overflowY: 'auto',
                            overflow: 'hidden', // Hide scrollbar
                            width: '100%',     // Adjust as needed
                            height: '45px',
                            border: '1.5px',
                            borderStyle: 'solid',
                            borderColor: 'black',
                            borderRadius: '8px',
                            padding: '10px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />
                    
                    <div className="dropdowns">
                        <p>Job Length</p>
                        <select
                            className="dropdown"
                            value={jobLength}
                            onChange={(e) => setJobLength(e.target.value)}
                            style={{
                                minHeight: '40px', // Optional: set a minimum height
                                resize: 'none',    // Prevent manual resizing by user
                                overflowY: 'auto',
                                overflow: 'hidden', // Hide scrollbar
                                width: '45%',     // Adjust as needed
                                height: '45px',
                                border: '1.5px',
                                borderStyle: 'solid',
                                borderColor: 'black',
                                borderRadius: '8px',
                                padding: '10px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <option value="">Select duration...</option>
                            <option value="4">4 months</option>
                            <option value="8">8 months</option>
                            <option value="12">12 months</option>
                            <option value="16">16 months</option>
                        </select>

                        <p>Work Models</p>
                        <select
                            className="dropdown"
                            value={workModel}
                            onChange={(e) => setWorkModel(e.target.value)}
                            style={{
                                minHeight: '40px', // Optional: set a minimum height
                                resize: 'none',    // Prevent manual resizing by user
                                overflowY: 'auto',
                                overflow: 'hidden', // Hide scrollbar
                                width: '45%',     // Adjust as needed
                                height: '45px',
                                border: '1.5px',
                                borderStyle: 'solid',
                                borderColor: 'black',
                                borderRadius: '8px',
                                padding: '10px',
                                fontSize: '14px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <option value="">Select work model...</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="inperson">In-Person</option>
                        </select>
                    </div>
                </div>
                {/* <div className="tags-container">
                    {formData.jobtags.map((tag, idx) => (
                        <div key={idx} className="tag">
                        <span>X</span> {tag}
                        </div>
                    ))}
                </div> */}
                <div className="button-container">
                    <button className="cancel-btn">Cancel</button>
                    <button className="post-btn">Post</button>
                </div>
            </div>
        </div>
    );
};

export default PositionWriting;