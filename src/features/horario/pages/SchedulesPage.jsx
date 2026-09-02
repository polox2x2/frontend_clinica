import React, { useEffect, useState } from 'react';
import { scheduleService } from '../services/scheduleService';
import { CalendarClock, Plus } from 'lucide-react';

const SchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await scheduleService.getAll();
        setSchedules(data);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title flex items-center gap-2">
          <CalendarClock color="var(--accent-color)" /> Gestión de Horarios
        </h1>
        <button className="btn btn-primary">
          <Plus size={18} /> Nuevo Horario
        </button>
      </div>

      <div className="card">
        {loading ? (
          <p>Cargando horarios...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Médico</th>
                  <th>Día</th>
                  <th>Hora Inicio</th>
                  <th>Hora Fin</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{textAlign: 'center'}}>No hay horarios registrados</td>
                  </tr>
                ) : (
                  schedules.map(schedule => (
                    <tr key={schedule.id}>
                      <td>{schedule.id}</td>
                      <td>{schedule.medico?.nombre} {schedule.medico?.apellido}</td>
                      <td>{schedule.dia}</td>
                      <td>{schedule.horaInicio}</td>
                      <td>{schedule.horaFin}</td>
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

export default SchedulesPage;
