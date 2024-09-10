import React from 'react'
import { useNavigate } from 'react-router-dom';

import Card from '../components/Card'

import '../styles/Styles.css'

export default function Home() {

	const navigate = useNavigate();

	return (
		<div style={{marginTop: -25}}>
			<button style={{ float: 'right', marginRight: 125, marginTop: -15, width: "12.5%", backgroundColor: '#d74141', color: '#111' }} className='returning-button' onClick={() => navigate("/logout")}>
				Cerrar Sesión
			</button><br/>
			<h1 style={{ fontSize: 50 }}>Bienvenida Jefa!</h1>
			<div className='card-display'>
				<Card name="Nueva Visita" onClick={() => navigate('/create')} />
				<Card name="Buscar Ficha" onClick={() => navigate('/list')} />
			</div>
		</div>
	)
}
