import React, { useEffect, useState } from 'react';
import { doctorService } from '../services/doctorService';
import { Stethoscope, Plus } from 'lucide-react';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getAll();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title flex items-center gap-2">
          <Stethoscope color="var(--accent-color)" /> Gestión de Médicos
        </h1>
        <button className="btn btn-primary">
          <Plus size={18} /> Nuevo Médico
        </button>
      </div>

      <div className="card">
        {loading ? (
          <p>Cargando médicos...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Especialidad</th>
                  <th>Colegiatura</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center'}}>No hay médicos registrados</td>
                  </tr>
                ) : (
                  doctors.map(doctor => (
                    <tr key={doctor.id}>
                      <td>{doctor.id}</td>
                      <td>{doctor.nombre} {doctor.apellido}</td>
                      <td><span className="badge badge-success">{doctor.especialidad?.nombre || 'General'}</span></td>
                      <td>{doctor.colegiatura}</td>
                      <td>
                        <button className="btn" style={{padding: '6px 12px', fontSize: '0.8rem'}}>Editar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
