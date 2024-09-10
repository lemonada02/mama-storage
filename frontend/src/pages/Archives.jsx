import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';
import api from '../api';
import '../styles/Styles.css';

export default function Archives() {
    const navigate = useNavigate();
    const location = useLocation();
    const personaId = parseInt(location.pathname.split('/')[2]);

    const [persona, setPersona] = useState(null);  // Inicializado en null para manejar la condición de carga.
    const [archivos, setArchivos] = useState([]);
    const [añadirArchivo, setAñadirArchivo] = useState(false);
    const [editarArchivo, setEditarArchivo] = useState(false);
    const [archivoEditado, setArchivoEditado] = useState({});
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

    const [listaNombres, setListaNombres] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responsePersona = await api.get(`/api/personas/list/`);  // Ajustado para obtener una persona específica.
                setPersona(responsePersona.data.filter((item) => item.id === personaId)[0]);

                const responseArchivos = await api.get(`/api/archivos/list/`);
                const archivosFiltrados = responseArchivos.data.filter((item) => item.persona === personaId);
                setArchivos(archivosFiltrados);

                const nombres = archivosFiltrados.map((archivo) => archivo.nombre);
                setListaNombres(nombres);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [personaId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nombre', e.target[0].value);
        formData.append('archivo', e.target[1].files[0]);
        formData.append('persona', personaId);

        try {
            if (listaNombres.some((nombre) => nombre === e.target[0].value)) {
                alert("Ya existe un archivo con ese nombre");
                return;
            } else {
                await api.post(`/api/archivos/list/`, formData);
                setAñadirArchivo(false);
                const response = await api.get(`/api/archivos/list/`);  // Obtener la lista actualizada de archivos
                const archivosFiltrados = response.data.filter((item) => item.persona === personaId);
                setArchivos(archivosFiltrados);
            }
        } catch (error) {
            error.response.data.detail ? console.error(error.response.data.detail) : console.error(error);
        }
    };

    const deleteArchivo = async (id) => {
        try {
            const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este archivo?");
            if (isConfirmed) {
                await api.delete(`/api/archivos/delete/${id}/`);
                const response = await api.get(`/api/archivos/list/`);  // Obtener la lista actualizada de archivos
                const archivosFiltrados = response.data.filter((item) => item.persona === personaId);
                setArchivos(archivosFiltrados);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const editArchivo = (id) => {
        const archivo = archivos.find((item) => item.id === id);
        setArchivoEditado(archivo);
        setEditarArchivo(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nombre', archivoEditado.nombre);
        if (archivoSeleccionado) {
            formData.append('archivo', archivoSeleccionado);
        }
        formData.append('persona', archivoEditado.persona);

        try {
            await api.put(`/api/archivos/update/${archivoEditado.id}/`, formData);
            const response = await api.get(`/api/archivos/list/`);  // Obtener la lista actualizada de archivos
            const archivosFiltrados = response.data.filter((item) => item.persona === personaId);
            setArchivos(archivosFiltrados);
            setEditarArchivo(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditChange = (e) => {
        setArchivoEditado({ ...archivoEditado, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setArchivoSeleccionado(e.target.files[0]);
    };

    if (!persona) {
        return <div>Loading...</div>;
    }

    return (
        <div className="form-container2" style={{ maxWidth: 1200, height: '75vh' }}>
            <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                <button style={{ marginRight: 750, fontSize: 16 }} className="returning-button" onClick={() => navigate(`/details/${personaId}`)}>
                    &larr; Volver
                </button>
                <button style={{ fontSize: 16, width: 250, color: '#111' }} className="form-button" onClick={() => setAñadirArchivo(true)}>
                    Añadir archivo
                </button>
            </div>
            <h1 style={{ marginTop: 20, marginBottom: 5 }}>Archivos de <span style={{ fontWeight: 'bold', color: "#4c9c3c" }}>{persona.nombre} {persona.apellidos}</span></h1>
            <hr style={{ borderWidth: 2, borderColor: "#99cd32", width: "80%", marginBottom: 10 }} />
            {editarArchivo ? (
                <form style={{ display: 'flex', flexDirection: 'column', width: 600, marginTop: 30 }} onSubmit={handleEditSubmit}>
                    <input required className="form-input" type="text" name="nombre" value={archivoEditado.nombre} style={{ marginBottom: 10 }} onChange={handleEditChange} />
                    <input className="form-input" type="file" style={{ marginBottom: 20 }} onChange={handleFileChange} />
                    <div className="form-part" style={{ marginLeft: 100 }}>
                        <button type="submit" className="form-button" style={{ width: 150, color: '#111' }}>Editar</button>
                        <button className="form-button" type="button" style={{ width: 150, backgroundColor: '#d74141', color: '#111' }} onClick={() => setEditarArchivo(false)}>Cancelar</button>
                    </div>
                </form>
            ) : añadirArchivo ? (
                <form style={{ display: 'flex', flexDirection: 'column', width: 600, marginTop: 30 }} onSubmit={handleSubmit}>
                    <input required className="form-input" type="text" placeholder="Nombre del archivo" style={{ marginBottom: 10 }} />
                    <input required className="form-input" type="file" name="archivo" style={{ marginBottom: 20 }} />
                    <div className="form-part" style={{ marginLeft: 100 }}>
                        <button type="submit" className="form-button" style={{ width: 150, color: '#111' }}>Añadir</button>
                        <button className="form-button" type="button" style={{ width: 150, backgroundColor: '#d74141', color: '#111' }} onClick={() => setAñadirArchivo(false)}>Cancelar</button>
                    </div>
                </form>
            ) : archivos.length === 0 ? (
                <h2>No hay archivos para mostrar</h2>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', overflow: 'auto', width: 1200, scrollbarWidth: 'thin', scrollbarColor: '#99cd32 #fff', padding: 10 }}>
                    {archivos.map((archivo) => (
                        <div key={archivo.id} className="card-container2">
                            <img src="/pdf.png" alt="pdf" style={{ width: 75 }} />
                            <h2 style={{ marginBottom: 5 }}>{archivo.nombre}</h2>
                            <div>
                            <a href={archivo.archivo} download={archivo.nombre} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#111' }}>
                                    <button className="table-button2" style={{ backgroundColor: "#5cafeb", marginRight: 5 }}>
                                        <FontAwesomeIcon icon={faDownload} className="fa-lg" style={{ color: "#111" }} />
                                    </button>
                                </a>
                                <button style={{ marginRight: 5 }} className="table-button2" onClick={() => editArchivo(archivo.id)}>
                                    <FontAwesomeIcon icon={faEdit} className="fa-lg" style={{ color: "#111" }} />
                                </button>
                                <button className="table-button" onClick={() => deleteArchivo(archivo.id)}>
                                    <FontAwesomeIcon icon={faTrash} className="fa-lg" style={{ color: "#111" }} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
