import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

import '../styles/Styles.css';

export default function Create() {

    const [dniList, setDniList] = useState([]);

    useEffect(() => {
        const fetchDniList = async () => {
            try {
                const response = await api.get('/api/personas/list/');
                const lista = response.data.map((persona) => persona.nie);
                setDniList(lista);
            } catch (error) {
                alert('Error al obtener los datos');
            }
        };
        fetchDniList();
    }, []);

    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        fecha_nacimiento: '',
        nie: '',
        direccion: '',
        telefono: '',
        tiempo_marchena: '',
        tiempo_espana: '',
        nivel_espanol: '',
        nivel_estudios: '',
        situacion_laboral: '',
        profesion: '',
        familiares: '',
        tipo_vivienda: '',
        comparte_vivienda: '',
        respuesta: '',
        derivacion: '',
        asistencias: '',
        usuario: 1
    });

    const navigate = useNavigate();
    const [asistencia, setAsistencia] = useState({ fecha: '', motivo: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAsistenciaChange = (e) => {
        const { name, value } = e.target;
        setAsistencia({
            ...asistencia,
            [name]: value
        });
    };

    const addAsistencia = () => {
        const nuevaAsistencia = `${asistencia.fecha}: ${asistencia.motivo}`;
        setFormData({
            ...formData,
            asistencias: formData.asistencias ? `${formData.asistencias},${nuevaAsistencia}` : nuevaAsistencia
        });
        setAsistencia({ fecha: '', motivo: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (dniList.some(dni => dni === formData.nie)) {
                alert('El NIE ya está registrado');
                return;
            } else{
                if (formData.telefono === '') {
                    formData.telefono = null;
                }
                await api.post('/api/personas/list/', formData);
                navigate('/');
                console.log("Formulario enviado", formData);
            }
        } catch (error) {
            alert(error);
            console.log(formData);
        } 
    };

    return (
        <form onSubmit={handleSubmit} className='form-container2'>
            <button type= "button" className='returning-button' onClick={() => navigate("/")}>
                &larr; Volver al Inicio
            </button>
            <h1>Formulario de Registro</h1>
            <hr style={{ borderWidth: 2, borderColor: "#99cd32", width: "80%" }} />
            {/* Datos */}
            <h2>Datos Básicos</h2>
            <div className='form-part'>
                <input required className="form-input" type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
                <input required className="form-input" type="text" name="apellidos" placeholder="Apellidos" value={formData.apellidos} onChange={handleChange} />
                <input required className="form-input" type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} />
            </div>
            <div className='form-part'>
                <input required className="form-input" type="text" name="nie" placeholder="NIE" value={formData.nie} onChange={handleChange} />
                <input style={{ flex: "140%" }} className="form-input" type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} />
                <input className="form-input" type="number" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
            </div>
            {/* Info Idioma */}
            <h2>Información Idioma</h2>
            <div className='form-part'>
                <input required className="form-input" type="number" name="tiempo_marchena" placeholder="Tiempo en Marchena" value={formData.tiempo_marchena} onChange={handleChange} />
                <input required className="form-input" type="number" name="tiempo_espana" placeholder="Tiempo en España" value={formData.tiempo_espana} onChange={handleChange} />
                <select required className="form-input" name="nivel_espanol" value={formData.nivel_espanol} onChange={handleChange}>
                    <option value="" hidden>Nivel de Español</option>
                    <option value="Nulo">Nulo</option>
                    <option value="Bajo">Bajo</option>
                    <option value="Medio">Medio</option>
                    <option value="Alto">Alto</option>
                </select>
            </div>
            {/* Info Laboral */}
            <h2>Información Laboral</h2>
            <div className='form-part'>
                <select required className="form-input" name="nivel_estudios" value={formData.nivel_estudios} onChange={handleChange}>
                    <option value="" hidden>Nivel de estudios</option>
                    <option value="Sin estudios">Sin estudios</option>
                    <option value="Primarios">Primarios</option>
                    <option value="Secundarios">Secundarios</option>
                    <option value="Universitarios">Universitarios</option>
                </select>
                <select required className="form-input" name="situacion_laboral" value={formData.situacion_laboral} onChange={handleChange}>
                    <option value="" hidden>Situación laboral</option>
                    <option value="Busqueda de empleo">Búsqueda de empleo</option>
                    <option value="Esporadicamente">Esporádicamente</option>
                    <option value="Trabaja habitualmente">Trabaja habitualmente</option>
                    <option value="No trabaja">No trabaja</option>
                </select>
                <input className="form-input" type="text" name="profesion" placeholder="Profesión" value={formData.profesion} onChange={handleChange} />
            </div>
            {/* Datos Familiares */}
            <h2>Datos Familiares</h2>
            <div className='form-part'>
                <input className="form-input" type="text" name="familiares" placeholder="Familiares a Cargo" value={formData.familiares} onChange={handleChange} />
                <select className="form-input" name="tipo_vivienda" value={formData.tipo_vivienda} onChange={handleChange}>
                    <option value="" hidden>Tipo de vivienda</option>
                    <option value="Alquiler">Alquiler</option>
                    <option value="Propiedad">Propiedad</option>
                </select>
                <select className="form-input" name="comparte_vivienda" value={formData.comparte_vivienda} onChange={handleChange}>
                    <option value="" hidden>Comparte vivienda</option>
                    <option value="Vive solo">Vive solo</option>
                    <option value="Con familiar">Con familiar</option>
                    <option value="No familiar">No familiar</option>
                    <option value="Otros">Otros</option>
                </select>
            </div>
            {/* Otros Datos */}
            <h2>Otros Datos</h2>
            <div className='form-part'>
                <textarea className="form-input" name="respuesta" placeholder="Respuesta" value={formData.respuesta} onChange={handleChange}></textarea>
                <textarea className="form-input" name="derivacion" placeholder="Derivación" value={formData.derivacion} onChange={handleChange}></textarea>
            </div>
            {/* Asistencias */}
            <h2>Asistencias</h2>
            <div className='form-part'>
                <input className="form-input" type="date" name="fecha" value={asistencia.fecha} onChange={handleAsistenciaChange} />
                <textarea className="form-input" name="motivo" placeholder="Motivo Asistencias" value={asistencia.motivo} onChange={handleAsistenciaChange} />
                <button type="button" style={{ fontSize: 16, flex: "15%" }} className='form-button' onClick={addAsistencia}>Agregar Asistencia</button>
            </div>
            <ul>
                {formData.asistencias.split(',').map((asist, index) => (
                    <li style={{fontSize:18}} key={index}>{asist}</li>
                ))}
            </ul>
            <button className="form-button" type="submit">Enviar</button>
        </form>
    );
};