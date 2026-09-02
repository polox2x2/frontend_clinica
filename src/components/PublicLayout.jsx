import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Activity, LogIn } from 'lucide-react';

const PublicLayout = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Navbar Pública */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 40px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--glass-border)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Activity size={28} color="var(--accent-color)" />
          <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '500', color: 'var(--text-primary)' }}>
            Clínica Integral
          </h1>
        </div>
        
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <NavLink to="/" style={({isActive}) => ({ color: isActive ? 'var(--accent-color)' : 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 })}>
            Inicio
          </NavLink>
          {/* Aquí podrían ir anclas a las secciones en la misma página */}
          
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
            style={{ padding: '8px 24px', borderRadius: '24px' }}
          >
            <LogIn size={18} /> Acceder al Portal
          </button>
        </div>
      </nav>

      {/* Contenido Público */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer Básico */}
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        borderTop: '1px solid var(--glass-border)',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-secondary)'
      }}>
        © {new Date().getFullYear()} Clínica Integral. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default PublicLayout;
