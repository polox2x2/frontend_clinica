import React from 'react';

// Muestra de solo lectura los datos generales de un paciente
const PatientInfo = ({ patient }) => {
  if (!patient) return <p style={{color: 'var(--text-secondary)'}}>No hay datos del paciente.</p>;

  return (
    <div className="card">
      <h3 className="mb-4">Información General</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <span className="form-label">Nombre Completo</span>
          <div style={{ fontWeight: 600 }}>{patient.nombre} {patient.apellido}</div>
        </div>
        <div>
          <span className="form-label">Documento</span>
          <div style={{ fontWeight: 600 }}>{patient.documento || 'No especificado'}</div>
        </div>
        <div>
          <span className="form-label">Teléfono</span>
          <div style={{ fontWeight: 600 }}>{patient.telefono || 'No especificado'}</div>
        </div>
        <div>
          <span className="form-label">Fecha de Nacimiento</span>
          <div style={{ fontWeight: 600 }}>{patient.fechaNacimiento || 'No especificada'}</div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
