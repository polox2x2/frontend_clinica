import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, ArrowLeft } from 'lucide-react';
import Alert from '../components/Alert';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!credentials.username || !credentials.password) {
      return setError('Por favor ingresa tu usuario y contraseña.');
    }

    // El sistema detecta el rol internamente
    const user = login(credentials.username, credentials.password);

    // Redireccionamiento automático según el rol detectado
    if (user.role === 'ADMIN') {
      navigate('/dashboard');
    } else if (user.role === 'DOCTOR') {
      navigate('/dashboard/mis-citas');
    } else {
      navigate('/dashboard/mi-portal');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', padding: '20px' }}>
      <div className="glass-panel" style={{ padding: '40px', maxWidth: '400px', width: '100%' }}>
        
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <ArrowLeft size={18} /> Volver al Inicio
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(212, 163, 115, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <LogIn size={32} color="var(--accent-color)" />
          </div>
          <h1 style={{ marginBottom: '8px', fontSize: '1.8rem' }}>Iniciar Sesión</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Ingresa tus credenciales para acceder.</p>
        </div>

        <Alert type="error" message={error} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Usuario o Correo</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Ingresa tu usuario"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '16px', padding: '14px', width: '100%' }}>
            Entrar
          </button>
        </form>

        <div style={{ marginTop: '32px', color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>
          ¿Eres un nuevo paciente? <span style={{ color: 'var(--accent-color)', cursor: 'pointer', fontWeight: 500 }} onClick={() => navigate('/register')}>Regístrate aquí</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
