import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { patientService } from '../features/paciente/services/patientService';
import { UserPlus, ArrowLeft } from 'lucide-react';
import Alert from '../components/Alert';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    telefono: '',
    fechaNacimiento: '',
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.nombre || !formData.apellido || !formData.documento || !formData.email || !formData.password) {
      return setError('Los campos Nombre, Apellido, Documento, Correo y Contraseña son obligatorios.');
    }

    setLoading(true);
    try {
      // Guarda al paciente en la base de datos (Backend real)
      await patientService.create(formData);
      
      // Inicia sesión automáticamente con el correo recién creado
      login(formData.email, formData.password);
      navigate('/dashboard/mi-portal');
      
    } catch (err) {
      setError('Hubo un problema al crear tu cuenta. Verifica que el correo o documento no estén ya registrados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', padding: '20px' }}>
      <div className="glass-panel" style={{ padding: '40px', maxWidth: '500px', width: '100%' }}>
        
        <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <ArrowLeft size={18} /> Volver
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <UserPlus size={48} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
          <h1 style={{ marginBottom: '8px', fontSize: '1.8rem' }}>Crea tu Cuenta</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Regístrate como paciente para reservar citas médicas.</p>
        </div>

        <Alert type="error" message={error} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Datos de Acceso */}
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: 0, color: 'var(--accent-color)' }}>Datos de Acceso</h4>
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} placeholder="Ej. juan@correo.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" />
            </div>
          </div>

          {/* Datos Personales */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Nombre</label>
              <input type="text" name="nombre" className="form-input" value={formData.nombre} onChange={handleChange} placeholder="Ej. Ana" />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Apellido</label>
              <input type="text" name="apellido" className="form-input" value={formData.apellido} onChange={handleChange} placeholder="Ej. López" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Documento de Identidad</label>
            <input type="text" name="documento" className="form-input" value={formData.documento} onChange={handleChange} placeholder="Ej. 12345678" />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Teléfono</label>
              <input type="tel" name="telefono" className="form-input" value={formData.telefono} onChange={handleChange} placeholder="Ej. 555-0192" />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Nacimiento</label>
              <input type="date" name="fechaNacimiento" className="form-input" value={formData.fechaNacimiento} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '16px', padding: '14px' }} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
