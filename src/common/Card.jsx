import React from "react";
import './card.css';

function Card({ title, children }) {
    return (
        <div className="card">
            {title && <h3 className="card-title">{title}</h3>}
            {children}
        </div>
    );
}

export default Card;