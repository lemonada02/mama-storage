import React from "react";

export default function Card({ name, onClick }) {

    const image= name === "Nueva Visita" ? "/añadir.png" : "/icon.png";

    return (
        <div className="card-container" onClick={onClick}>
            <img src={image} alt="placeholder" style={{marginTop: 15, width: 100}}/>
            <h1>{name}</h1>
        </div>
    );
}