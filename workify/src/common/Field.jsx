import React from "react";

function Field({ label, error, children }) {
    return (
        <label className="field">
            <span className="label">{label}</span>
            {children}
            {error && <span className="error-text">{error}</span>}
        </label>
    );
}

export default Field;