import { useState, useRef } from "react";
import './PositionWriting.css';

const PositionWriting = () => {
    const [formData] = useState({
        jobtags: ["Software", "Agile", "Front-end", "Teamwork"]
    });
    const [text, setText] = useState('');
    const textareaRef = useRef(null);

    const handleChange = (event) => {
        setText(event.target.value);
    };

    return (
        <div className="positionwriting-container">
            <h3>Create Coop Posting</h3>
            <div className="textInput">
                <p>Coop Description</p>
                <textarea className="textInput"
                    ref={textareaRef}
                    value={text}
                    onChange={handleChange}
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
            </div>
            <div className="tags-container">
                {formData.jobtags.map((tag, idx) => (
                    <div key={idx} className="tag">
                    <span>X</span> {tag}
                    </div>
                ))}
            </div>
            <div className="button-container">
                <button className="cancel-btn">Cancel</button>
                <button className="post-btn">Post</button>
            </div>
        </div>
    );
};

export default PositionWriting;