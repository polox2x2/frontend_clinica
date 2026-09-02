import React, { useEffect, useState } from 'react';
import { patientService } from '../services/patientService';
import { appointmentService } from '../../cita/services/appointmentService';
import PatientInfo from '../components/PatientInfo';
import ReservationForm from '../../cita/components/ReservationForm';
import Alert from '../../../components/Alert';
import { User, CalendarCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const PatientPortal = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Tab management
  const [activeTab, setActiveTab] = useState('citas');

  // Appointments state
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  useEffect(() => {
    const fetchCurrentPatient = async () => {
      try {
        const patients = await patientService.getAll();
        if (patients && patients.length > 0) {
          // Buscamos al paciente basándonos en el correo del usuario logueado
          const found = patients.find(p => p.email === user?.username) || patients[0];
          setPatient(found);
        } else {
          // Mock data in case DB is empty for demo purposes
          setPatient({
            id: 1, nombre: user?.name || 'Paciente', apellido: 'Demo', documento: '00000000', telefono: '555-5555'
          });
        }
      } catch (err) {
        setPatient({
          id: 1, nombre: user?.name || 'Paciente', apellido: 'Demo', documento: '00000000', telefono: '555-5555'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentPatient();
  }, [user]);

  // Fetch appointments when patient is loaded and tab is 'citas'
  useEffect(() => {
    if (patient && activeTab === 'citas') {
      setLoadingAppointments(true);
      appointmentService.getAll()
        .then(data => {
          if (data && Array.isArray(data)) {
            // Filtrar las citas que pertenecen a este paciente
            setAppointments(data.filter(a => a.paciente?.id === patient.id));
          }
        })
        .catch(err => console.error("Error al cargar citas:", err))
        .finally(() => setLoadingAppointments(false));
    }
  }, [patient, activeTab]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title flex items-center gap-2">
            <User color="var(--accent-color)" /> ¡Hola, {patient?.nombre}!
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Bienvenido a tu portal. Aquí puedes gestionar tu salud.
          </p>
        </div>
      </div>

      <Alert type="error" message={error} />

      {loading ? (
        <p>Cargando tu portal...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <PatientInfo patient={patient} />
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
            <button 
              className={`btn ${activeTab === 'citas' ? 'btn-primary' : ''}`}
              style={{ backgroundColor: activeTab !== 'citas' && '#fff', border: activeTab !== 'citas' && '1px solid var(--glass-border)' }}
              onClick={() => setActiveTab('citas')}
            >
              <CalendarCheck size={18} /> Mis Citas Programadas
            </button>
            <button 
              className={`btn ${activeTab === 'agendar' ? 'btn-primary' : ''}`}
              style={{ backgroundColor: activeTab !== 'agendar' && '#fff', border: activeTab !== 'agendar' && '1px solid var(--glass-border)' }}
              onClick={() => setActiveTab('agendar')}
            >
              Agendar Nueva Cita
            </button>
          </div>

          {activeTab === 'citas' && (
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>Próximas Citas</h3>
              
              {loadingAppointments ? (
                <p style={{ color: 'var(--text-secondary)' }}>Cargando tus citas...</p>
              ) : appointments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {appointments.map(app => (
                    <div key={app.id} style={{ padding: '16px', border: '1px solid var(--glass-border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
                      <div>
                        <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{app.fecha}</h4>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          Dr(a). {app.medico?.nombre} {app.medico?.apellido}
                        </p>
                      </div>
                      <div>
                        <span style={{ padding: '6px 12px', backgroundColor: 'rgba(212, 163, 115, 0.1)', color: 'var(--accent-color)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                          {app.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>Por el momento no tienes citas agendadas.</p>
              )}
            </div>
          )}

          {activeTab === 'agendar' && patient && (
            <ReservationForm 
              patientId={patient.id} 
              onReservationSuccess={() => setActiveTab('citas')} 
            />
          )}

        </div>
      )}
    </div>
  );
};

export default PatientPortal;
