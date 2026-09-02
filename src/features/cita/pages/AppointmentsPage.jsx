import React, { useEffect, useState } from 'react';
import { appointmentService } from '../services/appointmentService';
import { CalendarDays, Plus } from 'lucide-react';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAll();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title flex items-center gap-2">
          <CalendarDays color="var(--accent-color)" /> Gestión de Citas
        </h1>
        <button className="btn btn-primary">
          <Plus size={18} /> Nueva Cita
        </button>
      </div>

      <div className="card">
        {loading ? (
          <p>Cargando citas...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Paciente</th>
                  <th>Médico</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{textAlign: 'center'}}>No hay citas registradas</td>
                  </tr>
                ) : (
                  appointments.map(appointment => (
                    <tr key={appointment.id}>
                      <td>{appointment.id}</td>
                      <td>{appointment.fecha}</td>
                      <td>{appointment.paciente?.nombre}</td>
                      <td>{appointment.medico?.nombre}</td>
                      <td><span className={`badge ${appointment.estado === 'Confirmada' ? 'badge-success' : 'badge-primary'}`}>{appointment.estado}</span></td>
                      <td>
                        <button className="btn" style={{padding: '6px 12px', fontSize: '0.8rem'}}>Detalles</button>
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

export default AppointmentsPage;
