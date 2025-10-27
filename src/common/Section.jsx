import React from "react";
import EditIcon from "../profile/EditIcon";
import './section.css';

function Section({ title, children, onEdit }) {
    return (
        <section className="section-modern">
            <div className="section-header">
                <h2 className="section-title">{title}</h2>
                {onEdit && (
                    <button
                    className="edit-icon-btn"
                    onClick={onEdit}
                    aria-label={`Edit ${title}`}
                    title="Edit"
                    type="button"
                    >
                    <EditIcon />
                    </button>
                )}
            </div>
            <div className="section-content">{children}</div>
        </section>
    );
}

export default Section;