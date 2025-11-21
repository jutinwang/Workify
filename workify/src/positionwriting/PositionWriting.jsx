import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PositionWriting.css";
import RichTextEditor from "./component/RichTextEditor";
import TagSelectionModal from "./component/TagSelectionModal";
import { employerApi } from "../api/employers";
import { AVAILABLE_PROGRAMS } from "../constants/programs";

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
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [programs, setPrograms] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const handleCoopTitleChange = (title) => setCoopTitle(title.target.value);
  const handleOfficeLocationChange = (location) =>
    setOfficeLocation(location.target.value);

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

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
    setPrograms(programs.filter((program) => program !== programToRemove));
  };

  const postJob = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
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
        tags: tags,
        programs: programs,
      };

      console.log("Payload being sent:", payload);

      const response = await employerApi.postCoop(payload);

      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Error posting coop position:", err);
      setError(
        err.message || "Failed to post coop position. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostAnother = () => {
    setCoopTitle("");
    setCoopDescription([]);
    setResponsibilities("");
    setQualifications("");
    setBenefits("");
    setJobLength("");
    setSalaryRange("");
    setWorkModel("");
    setOfficeLocation("");
    setTags([]);
    setPrograms([]);
    setIsSuccess(false);
    setError(null);
  };

  const handleGoToProfile = () => {
    navigate("/profile-employer");
  };

  if (isSuccess) {
    return (
      <div className="positionwriting-container">
        <div className="content-wrapper success-screen">
          <div className="success-icon">✓</div>
          <h2>Coop Position Posted Successfully!</h2>
          <p>Your co-op posting has been published and is now live.</p>

          <div className="success-buttons">
            <button className="post-another-btn" onClick={handlePostAnother}>
              Post Another Coop
            </button>
            <button className="go-to-profile-btn" onClick={handleGoToProfile}>
              View My Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="positionwriting-container">
      <div className="content-wrapper">
        <h3>Create Coop Posting</h3>
        {error && <div className="error-message">{error}</div>}
        <div className="textInput">
          <p>Coop Title</p>
          <textarea
            className="titleInput"
            ref={textareaRef}
            value={coopTitle}
            onChange={handleCoopTitleChange}
            placeholder="Type something..."
          />
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
                  disabled={programs.length >= 3 && !programs.includes(program)}
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
            className="infoInput salary-input"
            onChange={setSalaryRange}
            customHeight="100px"
          />
        </div>

        <p> Role Attributes (Select up to 5)</p>
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

        <div className="button-container">
          <Link
            to={`/profile-employer`}
            className="navigateHome"
            title="Go Back"
          >
            <button className="cancel-btn">Cancel</button>
          </Link>
          <button
            className="post-btn"
            onClick={postJob}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PositionWriting;
