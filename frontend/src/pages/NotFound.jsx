import React from 'react'
import { useNavigate } from "react-router-dom";

import "../styles/Styles.css"

export default function NotFound() {

	const navigate= useNavigate();
	return (
		<div>
			<h1>
				No hemos podido encontrar esta página<br/>:(
			</h1>
			<button className='normal-button' onClick={()=> navigate("/")}>
				Volver al Inicio
			</button>
		</div>
	)
}
