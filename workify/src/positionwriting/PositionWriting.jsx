import { useState, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { createEditor, Editor, Transforms, Element as SlateElement } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import isHotkey from "is-hotkey";
import "./PositionWriting.css";

// Key shortcuts for stylings
const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
  "mod+-": "strikethrough",
  "mod+.": "bulleted-list"
};

// different kinds of lists
const LIST_TYPES = ["numbered-list", "bulleted-list"];

const PositionWriting = () => {
  const [coopDescription, setCoopDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [benefits, setBenefits] = useState("");
  const [jobLength, setJobLength] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [workModel, setWorkModel] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [tags, setTags] = useState([]);

  const textareaRef = useRef(null);

  const handleCoopDescriptionChange = (description) => setCoopDescription(description.target.value);
  const handleResponsibilitiesChange = (responsibility) => setResponsibilities(responsibility.target.value);
  const handleQualificationsChange = (qualification) => setQualifications(qualification.target.value);
  const handleBenefitsChange = (benefet) => setBenefits(benefet.target.value);
  const handleSalaryChange = (salary) => setSalaryRange(salary.target.value);
  const handleOfficeLocationChange = (location) => setOfficeLocation(location.target.value);

  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (!value.trim()) return;
    setTags([...tags, value]);
    e.target.value = "";
  }

  // Hit x icon to delete tag
  function removeTag(index) {
    setTags(tags.filter((el, i) => i !== index));
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

  // declared so text can be edited with stylings 
  const editor = useMemo(() => withReact(createEditor()), []);

  const renderElement = useCallback((props) => <Element {...props} />, []); // create text format
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []); // create text contents with stylings

  const initialValue = [
    {
      type: "paragraph", // block level (element)
      children: [{ text: "Write your job description here..." }], // leaf aka text content
    },
  ];

  // used for applying non element attribute changes
  const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const isMarkActive = (editor, format) => {
    const { selection } = editor;
    if (!selection) return false;

    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  }; 

  // used for applying different element changes 
  const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        LIST_TYPES.includes(n.type),
      split: true,
    });

    const newType = isActive ? "paragraph" : isList ? "list-item" : format;

    Transforms.setNodes(editor, { type: newType });

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  const isBlockActive = (editor, format) => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === format,
      })
    );
    return !!match;
  };

  // ELEMENTS AND LEAVES
  const Element = ({ attributes, children, element }) => {
    switch (element.type) {
      case "code":
        return (
          <pre {...attributes}>
            <code>{children}</code>
          </pre>
        );
      case 'bulleted-list':
        return (
          <ul {...attributes}>
            {children}
          </ul>
        );
      case 'numbered-list':
        return (
          <ol {...attributes}>
            {children}
          </ol>
        );
      case 'list-item':
        return (
          <li {...attributes}>
            {children}
          </li>
        );
      default:
        return <p {...attributes}>{children}</p>;
    }
  };

  const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.code) children = <code>{children}</code>;
    if (leaf.italic) children = <em>{children}</em>;
    if (leaf.underline) children = <u>{children}</u>;
    if (leaf.strikethrough) children = <s>{children}</s>;

    return <span {...attributes}>{children}</span>;
  };

  return (
    <div className="positionwriting-container">
      <div className="content-wrapper">
        <h3>Create Coop Posting</h3>
        <div className="textInput">
          <p>Coop Description</p>
          <Slate editor={editor} initialValue={initialValue}>
            {/* Toolbar with buttons */}
            <div className="toolbar">
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleMark(editor, "bold");
                }}
              >
                Bold
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleMark(editor, "italic");
                }}
              >
                Italic
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleMark(editor, "underline");
                }}
              >
                Underline
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleMark(editor, "code");
                }}
              >
                Code
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleMark(editor, "strikethrough");
                }}
              >
                Strikethrough
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleBlock(editor, "bulleted-list");
                }}
              >
                Bulleted List
              </button>
            </div>

            <Editable
              className="infoInput"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Type your rich text here..."
              spellCheck
              autoFocus
              onKeyDown={(event) => {
                for (const hotkey in HOTKEYS) {
                  if (isHotkey(hotkey, event)) {
                    event.preventDefault();
                    const mark = HOTKEYS[hotkey];
                    if (LIST_TYPES.includes(mark)) {
                      toggleBlock(editor, mark);
                    } else {
                      toggleMark(editor, mark);
                    }
                  }
                }
              }}
            />
          </Slate>

          <p>Key Responsibilities</p>
          <textarea
            className="infoInput"
            ref={textareaRef}
            value={responsibilities}
            onChange={handleResponsibilitiesChange}
            placeholder="Type something..."
          />

          <p>Qualifications</p>
          <textarea
            className="infoInput"
            ref={textareaRef}
            value={qualifications}
            onChange={handleQualificationsChange}
            placeholder="Type something..."
          />

          <p>Benefits and Perks</p>
          <textarea
            className="infoInput"
            ref={textareaRef}
            value={benefits}
            onChange={handleBenefitsChange}
            placeholder="Type something..."
          />

          <p>Salary Range</p>
          <textarea
            className="infoInput"
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