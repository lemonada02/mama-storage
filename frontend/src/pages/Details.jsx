import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import api from '../api'
import '../styles/Styles.css'

export default function Details() {
	const navigate = useNavigate();

	const location = useLocation();
	const isEditMode = location.pathname.endsWith('/edit');
	const userId = parseInt(isEditMode ? location.pathname.split('/')[2] : location.pathname.split('/').pop());

	const [data, setData] = useState();
	const [asistencia, setAsistencia] = useState([{ fecha: '', motivo: '' }]);
	const [nuevaAsistencia, setNuevaAsistencia] = useState({ fecha: '', motivo: '' });

	const [añadirAsistencia, setAñadirAsistencia] = useState(false);
	const [editAsistenciaIndex, setEditAsistenciaIndex] = useState(null);
	const [editAsistencia, setEditAsistencia] = useState({ fecha: '', motivo: '' });

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await api.get(`/api/personas/list/`);
				const res = response.data.find((item) => item.id === userId);
				if (res.telefono === null) res.telefono = '';
				setData(res);
			}
			catch (error) {
				console.error(error);
			}
		}
		fetchData();
	}, []);

	useEffect(() => {
		const formatAsistencias = () => {
			const datos = data.asistencias.split(',');
			const asistencias = [];
			datos.forEach((item) => {
				const [fecha, motivo] = item.split(':');
				asistencias.push({ fecha, motivo });
			});
			setAsistencia(asistencias);
		}
		if (data) {
			formatAsistencias();
		}
	}, [data]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setData({
			...data,
			[name]: value
		});
	};

	const addAsistencia = () => {
		const nuevaAsistenciaStr = `${nuevaAsistencia.fecha}: ${nuevaAsistencia.motivo}`;
		setData({
			...data,
			asistencias: data.asistencias ? `${data.asistencias},${nuevaAsistenciaStr}` : nuevaAsistenciaStr
		});
		setAsistencia([...asistencia, nuevaAsistencia]);
		setNuevaAsistencia({ fecha: '', motivo: '' });
		setAñadirAsistencia(false);
	};

	const handleAsistenciaChange = (e) => {
		const { name, value } = e.target;
		setNuevaAsistencia({
			...nuevaAsistencia,
			[name]: value
		});
	};

	const startEditAsistencia = (index) => {
		setEditAsistenciaIndex(index);
		setEditAsistencia(asistencia[index]);
	};

	const handleEditChange = (e) => {
		const { name, value } = e.target;
		setEditAsistencia({
			...editAsistencia,
			[name]: value
		});
	};

	const confirmEditAsistencia = () => {
		const updatedAsistencias = asistencia.map((asistencia, index) =>
			index === editAsistenciaIndex ? editAsistencia : asistencia
		);
		setAsistencia(updatedAsistencias);
		setData({
			...data,
			asistencias: updatedAsistencias.map(a => `${a.fecha}:${a.motivo}`).join(',')
		});
		setEditAsistenciaIndex(null);
		setEditAsistencia({ fecha: '', motivo: '' });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (data.telefono === '') {
				data.telefono = null;
			}
			await api.put(`/api/personas/update/${userId}/`, data);
			navigate("");
		} catch (error) {
			alert(error);
		}
	};

	useEffect(() => {
		const sortAsistencias = () => {
			const sortedAsistencias = asistencia.sort((a, b) => {
				return new Date(a.fecha) - new Date(b.fecha);
			});
			sortedAsistencias.reverse();
			setAsistencia(sortedAsistencias);
		}
		if (asistencia) {
			sortAsistencias();
		}
	}, [asistencia]);


	if (!data) {
		return <div>Cargando...</div>;
	}

	return (
		<div className='form-container2'>
			<div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', marginTop: 25 }}>
				<button type="button" style={{ marginRight: 550, }} className='returning-button' onClick={() => navigate("/list")}>
					&larr; Volver
				</button>
				<button type="button" style={{ marginRight: 0, width: 200, backgroundColor: isEditMode ? "#d74141" : "#99cd32" }} className='returning-button' onClick={() => isEditMode ? navigate("") : navigate("edit")}>
					{isEditMode ? 'Cancelar' : 'Editar'}
					<FontAwesomeIcon icon={faEdit} className='fa-lg' style={{ marginLeft: 5 }} />
				</button>
			</div>
			<h1 style={{ marginTop: 0, marginBottom: 5 }}>Datos de <span style={{ fontWeight: 'bold', color: "#4c9c3c" }}>{data.nombre} {data.apellidos}</span></h1>
			<hr style={{ borderWidth: 2, borderColor: "#99cd32", width: "80%" }} />

			{isEditMode ? (
				<form className='form-container3' onSubmit={handleSubmit}>
					<div className='form-part2'>
						<label htmlFor="nombre">Nombre:</label>
						<input required className="form-input" type="text" id="nombre" name="nombre" value={data.nombre} onChange={handleChange} />
						<label htmlFor="apellidos">Apellidos:</label>
						<input required className="form-input" type="text" id="apellidos" name="apellidos" value={data.apellidos} onChange={handleChange} />
					</div>
					<div className='form-part2'>
						<label style={{ marginRight: -8 }} htmlFor="fecha_nacimiento">Fecha Nacimiento:</label>
						<input required className="form-input" type="date" id="fecha_nacimiento" name="fecha_nacimiento" value={data.fecha_nacimiento} onChange={handleChange} />
						<label htmlFor="nie">NIE:</label>
						<input required className="form-input" type="text" id="nie" name="nie" value={data.nie} onChange={handleChange} />
					</div>
					<div className='form-part2'>
						<label htmlFor="direccion">Dirección:</label>
						<input className="form-input" type="text" id="direccion" name="direccion" value={data.direccion} onChange={handleChange} />
						<label htmlFor="telefono">Teléfono:</label>
						<input className="form-input" type="number" id="telefono" name="telefono" value={data.telefono} onChange={handleChange} />
					</div>
					<div className='form-part2'>
						<label htmlFor='tiempo_marchena'>Tiempo en Marchena:</label>
						<input required className="form-input" type='number' id='tiempo_marchena' name='tiempo_marchena' value={data.tiempo_marchena} onChange={handleChange} />
						<label htmlFor='tiempo_espana'>Tiempo en España:</label>
						<input required className="form-input" type='number' id='tiempo_espana' name='tiempo_espana' value={data.tiempo_espana} onChange={handleChange} />
					</div>
					<div className='form-part2'>
						<label htmlFor='nivel_espanol'>Nivel de Español:</label>
						<select required className="form-input" name="nivel_espanol" value={data.nivel_espanol} onChange={handleChange}>
							<option value="Nulo">Nulo</option>
							<option value="Bajo">Bajo</option>
							<option value="Medio">Medio</option>
							<option value="Alto">Alto</option>
						</select>
						<label htmlFor='nivel_estudios'>Nivel de Estudios:</label>
						<select required className="form-input" name="nivel_estudios" value={data.nivel_estudios} onChange={handleChange}>
							<option value="Sin estudios">Sin estudios</option>
							<option value="Primarios">Primarios</option>
							<option value="Secundarios">Secundarios</option>
							<option value="Universitarios">Universitarios</option>
						</select>
					</div>
					<div className='form-part2'>
						<label htmlFor='situacion_laboral'>Situación Laboral:</label>
						<select required className="form-input" name="situacion_laboral" value={data.situacion_laboral} onChange={handleChange}>
							<option value="Busqueda de empleo">Búsqueda de empleo</option>
							<option value="Esporadicamente">Esporádicamente</option>
							<option value="Trabaja habitualmente">Trabaja habitualmente</option>
							<option value="No trabaja">No trabaja</option>
						</select>
						<label htmlFor='profesion'>Profesión:</label>
						<input className="form-input" type='text' id='profesion' name='profesion' value={data.profesion} onChange={handleChange} />
					</div>
					<div className='form-part2'>
						<label htmlFor='familiares'>Familiares a Cargo:</label>
						<input className="form-input" type='text' id='familiares' name='familiares' value={data.familiares} onChange={handleChange} />
						<label htmlFor='tipo_vivienda'>Tipo de Vivienda:</label>
						<select className="form-input" name="tipo_vivienda" value={data.tipo_vivienda} onChange={handleChange}>
							<option value="NO">NO</option>
							<option value="Alquiler">Alquiler</option>
							<option value="Propiedad">Propiedad</option>
						</select>
						<label htmlFor='comparte_vivienda'>Comparte Vivienda:</label>
						<select className="form-input" name="comparte_vivienda" value={data.comparte_vivienda} onChange={handleChange}>
							<option value="NO">NO</option>
							<option value="Vive solo">Vive solo</option>
							<option value="Con familiar">Con familiar</option>
							<option value="No familiar">No familiar</option>
							<option value="Otros">Otros</option>
						</select>					</div>
					<div className='form-part2'>
						<label htmlFor='respuesta' >Respuesta:</label>
						<input className="form-input" type='text' id='respuesta' name='respuesta' value={data.respuesta} onChange={handleChange} />
						<label htmlFor='derivacion'>Derivación:</label>
						<input className="form-input" type='text' id='derivacion' name='derivacion' value={data.derivacion} onChange={handleChange} />
					</div>
					<div className='form-part2'>
						<label style={{ marginRight: -75 }} htmlFor='asistencias'>Asistencias:</label>
						{añadirAsistencia ? (
							<>
								<input style={{ flex: "15%", marginRight: 15 }} className="form-input" type="date" name="fecha" value={nuevaAsistencia.fecha} onChange={handleAsistenciaChange} />
								<textarea style={{ flex: "50%" }} className="form-input" name="motivo" placeholder="Motivo Asistencias" value={nuevaAsistencia.motivo} onChange={handleAsistenciaChange} />
								<div>
									<button type="button" style={{ fontSize: 16, flex: "15%", marginBottom: 3, color: '#111' }} className='form-button' onClick={addAsistencia}>Agregar</button>
									<button type="button" style={{ fontSize: 16, flex: "15%", marginTop: 3, backgroundColor: "#d74141", color: '#111' }} className='form-button' onClick={() => setAñadirAsistencia(false)}>Cancelar</button>
								</div>
							</>
						) : (
							<>
								<ul style={{ marginLeft: -65 }}>
									{asistencia.map((asistencia, index) => (
										<li key={index} style={{ display: 'flex' }}>
											{editAsistenciaIndex === index ? (
												<div style={{ display: 'flex', alignItems: 'center' }}>
													<input style={{ width: 130, marginRight: 10, height: 50 }} className="form-input" type="date" name="fecha" value={editAsistencia.fecha} onChange={handleEditChange} />
													<textarea style={{ width: 220, height: 100 }} className="form-input" name="motivo" value={editAsistencia.motivo} onChange={handleEditChange} />
													<div style={{ marginRight: -100 }}>
														<button style={{ fontSize: 16, width: 100, marginBottom: 3, color: '#111' }} className='form-button' type="button" onClick={confirmEditAsistencia}>Guardar</button>
														<button style={{ fontSize: 16, width: 100, marginTop: 3, backgroundColor: "#d74141", color: '#111' }} className='form-button' type="button" onClick={() => setEditAsistenciaIndex(null)}>Cancelar</button>
													</div>
												</div>
											) : (
												<div style={{ display: 'flex', width: 550, }}>
													<span style={{ fontSize: 18, }} className='form-input'>
														<span style={{ fontWeight: 'bold' }}>{asistencia.fecha}:</span> {asistencia.motivo}
														<button style={{ fontSize: 16, float: 'right', backgroundColor: '#99cd32', height: 35 }} type="button" onClick={() => startEditAsistencia(index)}>
															<FontAwesomeIcon icon={faEdit} className='fa-lg' />
														</button>
													</span>
												</div>
											)}
										</li>
									))}
								</ul>
								<button type='button' className='form-button' style={{ fontSize: 18, width: 150, marginBottom: 5, marginLeft: -10 }} onClick={() => setAñadirAsistencia(true)}>
									Nueva Asistencia
								</button>
							</>
						)}
					</div>
					<button style={{ marginTop: 0 }} className="form-button" type="submit">Guardar Cambios</button>
				</form>
			) : (
				<div className='form-container3'>
					<div className='form-part2'>
						<label htmlFor="nombre">Nombre:</label>
						<input className="form-input" type="text" id="nombre" name="nombre" value={data.nombre} readOnly />
						<label htmlFor="apellidos">Apellidos:</label>
						<input className="form-input" type="text" id="apellidos" name="apellidos" value={data.apellidos} readOnly />
					</div>
					<div className='form-part2'>
						<label style={{ marginRight: -8 }} htmlFor="fecha_nacimiento">Fecha Nacimiento:</label>
						<input className="form-input" type="date" id="fecha_nacimiento" name="fecha_nacimiento" value={data.fecha_nacimiento} readOnly />
						<label htmlFor="nie">NIE:</label>
						<input className="form-input" type="text" id="nie" name="nie" value={data.nie} readOnly />
					</div>
					<div className='form-part2'>
						<label htmlFor="direccion">Dirección:</label>
						<input className="form-input" type="text" id="direccion" name="direccion" value={data.direccion} readOnly />
						<label htmlFor="telefono">Teléfono:</label>
						<input className="form-input" type="number" id="telefono" name="telefono" value={data.telefono} readOnly />
					</div>
					<div className='form-part2'>
						<label htmlFor='tiempo_marchena'>Tiempo en Marchena:</label>
						<input className="form-input" type='number' id='tiempo_marchena' name='tiempo_marchena' value={data.tiempo_marchena} readOnly />
						<label htmlFor='tiempo_espana'>Tiempo en España:</label>
						<input className="form-input" type='number' id='tiempo_espana' name='tiempo_espana' value={data.tiempo_espana} readOnly />
					</div>
					<div className='form-part2'>
						<label htmlFor='nivel_espanol'>Nivel de Español:</label>
						<input className="form-input" type='text' id='nivel_espanol' name='nivel_espanol' value={data.nivel_espanol} readOnly />
						<label htmlFor='nivel_estudios'>Nivel de Estudios:</label>
						<input className="form-input" type='text' id='nivel_estudios' name='nivel_estudios' value={data.nivel_estudios} readOnly />
					</div>
					<div className='form-part2'>
						<label htmlFor='situacion_laboral'>Situación Laboral:</label>
						<input className="form-input" type='text' id='situacion_laboral' name='situacion_laboral' value={data.situacion_laboral} readOnly />
						<label htmlFor='profesion'>Profesión:</label>
						<input className="form-input" type='text' id='profesion' name='profesion' value={data.profesion} readOnly />
					</div>
					<div className='form-part2'>
						<label htmlFor='familiares'>Familiares a Cargo:</label>
						<input className="form-input" type='text' id='familiares' name='familiares' value={data.familiares} readOnly />
						<label htmlFor='tipo_vivienda'>Tipo de Vivienda:</label>
						<input className="form-input" type='text' id='tipo_vivienda' name='tipo_vivienda' value={data.tipo_vivienda} readOnly />
						<label htmlFor='comparte_vivienda'>Comparte Vivienda:</label>
						<input className="form-input" type='text' id='comparte_vivienda' name='comparte_vivienda' value={data.comparte_vivienda} readOnly />
					</div>
					<div className='form-part2'>
						<label htmlFor='respuesta' >Respuesta:</label>
						<input className="form-input" type='text' id='respuesta' name='respuesta' value={data.respuesta} readOnly />
						<label htmlFor='derivacion'>Derivación:</label>
						<input className="form-input" type='text' id='derivacion' name='derivacion' value={data.derivacion} readOnly />
					</div>
					<div className='form-part2' style={{ alignItems: 'flex-start' }}>
						<label style={{ marginRight: -140 }} htmlFor='asistencias'>Asistencias:</label>
						<div className='form-input'>
							{asistencia.map((asistencia, index) =>
								<p style={{ margin: 3 }} key={index}> <span style={{ fontWeight: 'bold' }}>{asistencia.fecha}: </span> {asistencia.motivo} </p>
							)}
						</div>
					</div>
					<button style={{ marginTop: 0 }} className="form-button" onClick={() => navigate("archives", { state: { key: "value" } })}>Ver Documentos</button>
				</div>
			)}
		</div>
	)
}
