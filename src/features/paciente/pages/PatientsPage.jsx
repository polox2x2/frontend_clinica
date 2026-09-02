import React, { useEffect, useState } from 'react';
import { patientService } from '../services/patientService';
import { UserPlus, Plus } from 'lucide-react';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await patientService.getAll();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title flex items-center gap-2">
          <UserPlus color="var(--accent-color)" /> Gestión de Pacientes
        </h1>
        <button className="btn btn-primary">
          <Plus size={18} /> Nuevo Paciente
        </button>
      </div>

      <div className="card">
        {loading ? (
          <p>Cargando pacientes...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Documento</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center'}}>No hay pacientes registrados</td>
                  </tr>
                ) : (
                  patients.map(patient => (
                    <tr key={patient.id}>
                      <td>{patient.id}</td>
                      <td>{patient.nombre} {patient.apellido}</td>
                      <td>{patient.documento}</td>
                      <td>{patient.telefono}</td>
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

export default PatientsPage;
