import { useState, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import "./PositionWriting.css";
import RichTextEditor from "./component/RichTextEditor";
import { employerApi } from "../api/employer";

const PositionWriting = () => {
  const [coopTitle, setCoopTitle] = useState("");
  const [coopDescription, setCoopDescription] = useState([]);
  const [responsibilities, setResponsibilities] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [benefits, setBenefits] = useState("");
  const [jobLength, setJobLength] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [workModel, setWorkModel] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [tags, setTags] = useState([]);

  const textareaRef = useRef(null);

  const handleCoopTitleChange = (title) => setCoopTitle(title.target.value);
  const handleOfficeLocationChange = (location) => setOfficeLocation(location.target.value);

  function handleKeyDown(e) {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault();
      const newTag = e.target.value.trim();

      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }

      e.target.value = "";
    }
  }

  // Hit x icon to delete tag
  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const postJob = async(e) => {
    const payload = {
      title: coopTitle,
      description: JSON.stringify(coopDescription),
      officeLocation: officeLocation ? officeLocation : "Remote",
      jobLength: jobLength,
      salary: JSON.stringify(salaryRange),
      responsibilities: JSON.stringify(responsibilities),
      qualifications: JSON.stringify(qualifications),
      benefits: JSON.stringify(benefits),
      workModel: workModel,
      tags: tags
    };

    console.log("Payload being sent:", payload);

    const response = await employerApi.postCoop(payload);
    
    if (response.token) {
      localStorage.setItem("authToken", response.token);
    }
  };

  return (
    <div className="positionwriting-container">
      <div className="content-wrapper">
        <h3>Create Coop Posting</h3>
        <div className="textInput">

          <p>Coop Title</p>
          <textarea className="infoInput"
              ref={textareaRef}
              value={coopTitle}
              onChange={handleCoopTitleChange}
              placeholder="Type something..."
          />

          <p>Coop Description</p>
          <RichTextEditor
            placeholder=" "
            initialText="Write your co-op description here..."
            className="infoInput"
            onChange={setCoopDescription}
          />

          <p>Key Responsibilities</p>
          <RichTextEditor
            placeholder=" "
            initialText="Write the co-op responsibilities here..."
            className="infoInput"
            onChange={setResponsibilities}
          />

          <p>Qualifications</p>
          <RichTextEditor
            placeholder=" "
            initialText="Describe the needed qualification..."
            className="infoInput"
            onChange={setQualifications}
          />

          <p>Benefits and Perks</p>
          <RichTextEditor
            placeholder=" "
            initialText="Write the benefits and perks here..."
            className="infoInput"
            onChange={setBenefits}
          />

          <p>Salary Range</p>
          <RichTextEditor
            placeholder=" "
            initialText="Put the salary here..."
            className="infoInput"
            onChange={setSalaryRange}
          />

          <div className="dropdowns">
            <p>Job Length</p>
            <select
              className="dropdown job-length-dropdown"
              value={jobLength}
              onChange={(e) => setJobLength(e.target.value)}
            >
              <option value="" disabled>
                Select duration...
              </option>
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
              <option value="" disabled>
                Select work model...
              </option>
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
          {tags.map((tag, index) => (
            <div className="tag-item" key={index}>
              <span className="text">{tag}</span>
              <span className="close" onClick={() => removeTag(index)}>
                &times;
              </span>
            </div>
          ))}
          <input
            onKeyDown={handleKeyDown}
            type="text"
            className="tags-input"
            placeholder="Add Tags Here..."
          />
        </div>

        <div className="button-container">
          <Link to={`/profile-employer`} className="navigateHome" title="Go Back">
            <button className="cancel-btn">Cancel</button>
          </Link>
          <button className="post-btn" onClick={postJob}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PositionWriting;