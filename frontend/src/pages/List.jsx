import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faInfoCircle, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import api from '../api'
import '../styles/Styles.css'


export default function List() {

    const navigate = useNavigate();
    const [data, setData] = useState();
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const result = await api.get('api/personas/list/');

            const data2 = result.data.map((item) => {
                const asistencias = item.asistencias.split(',').map((asistencia) => {
                    return asistencia.split(':')[0];
                });

                if (asistencias.length === 1) {
                    return { ...item, lastVisit: asistencias[0] };
                } else if (asistencias.length === 0) {
                    return { ...item, lastVisit: null };
                } else {
                    const lastVisit = asistencias.reduce((a, b) => {
                        return new Date(a) > new Date(b) ? a : b;
                    });
                    return { ...item, lastVisit };
                }
            });

            const sortedData = data2.sort((a, b) => {
                return (new Date(a.lastVisit) - new Date(b.lastVisit));
            });
            sortedData.reverse();

            if (search) {
                const filtered = sortedData.filter((item) => {
                    const fullName = item.nombre + ' ' + item.apellidos;
                    const backName = item.apellidos + ' ' + item.nombre;
                    return item.nombre.toLowerCase().startsWith(search.toLowerCase()) || item.apellidos.toLowerCase().startsWith(search.toLowerCase()) || fullName.toLowerCase().startsWith(search.toLowerCase()) || backName.toLowerCase().startsWith(search.toLowerCase());
                });
                setData(filtered);
                return;
            } else {
                setData(sortedData);
            }
        };
        fetchData();
    }, [search]);

    const handleChange = (e) => {
        setSearch(e.target.value);
    };

    const deletePersona = async (id) => {
        const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este elemento?");
        if (isConfirmed) {
            try {
                await api.delete(`/api/personas/delete/${id}/`);
                setData(data.filter((item) => item.id !== id));
            } catch (error) {
                console.error("Error al eliminar el elemento:", error);
            }
        }
    };

    return (
        <div className='form-container2' style={{ height: '75vh' }}>
            <button type="button" className='returning-button' onClick={() => navigate("/")}>
                &larr; Volver al Inicio
            </button>
            <h1 style={{ marginTop: 0, marginBottom: 5 }}>Listado de Visitas</h1>
            <hr style={{ borderWidth: 2, borderColor: "#99cd32", width: "80%" }} />

            <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'center', width: "80%", backgroundColor: "#e0e0e0" }} className='form-input'>
                <FontAwesomeIcon icon={faSearch} className='fa-lg' style={{ color: "#333" }} />
                <input placeholder='Introduzca Nombre o Apellido' value={search} onChange={handleChange} className='form-input' style={{ marginRight: 20, marginLeft: 20 }} />
                <FontAwesomeIcon icon={faSearch} className='fa-lg' style={{ color: "#333" }} />
            </div>

            <div style={{ overflow: 'auto', height: 400, scrollbarWidth: 'thin', scrollbarColor: '#99cd32 #fff' }}>
                <table>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: '#89bd22', zIndex: 1 }}>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Última Visita</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((item) => {
                            return (
                                <tr key={item.id}>
                                    <td>{item.nombre}</td>
                                    <td>{item.apellidos}</td>
                                    <td>{item.lastVisit}</td>
                                    <td style={{}}>
                                        <button className='table-button3' onClick={() => navigate(`/details/${item.id}`)}>
                                            <FontAwesomeIcon icon={faInfoCircle} className='fa-lg' style={{color: "#111"}}/>
                                        </button>
                                        <button className='table-button2' onClick={() => navigate(`/details/${item.id}/edit`)}>
                                            <FontAwesomeIcon icon={faEdit} className='fa-lg' style={{color: "#111"}}/>
                                        </button>
                                        <button className='table-button' onClick={() => deletePersona(item.id)}>
                                            <FontAwesomeIcon icon={faTrash} className='fa-lg' style={{color: "#111"}}/>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
