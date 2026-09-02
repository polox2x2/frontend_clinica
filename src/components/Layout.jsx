import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, UserPlus, Stethoscope, CalendarClock, 
  CalendarDays, Pill, Activity, LogOut, User
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Activity size={28} color="var(--accent-color)" />
          <h1>Clínica Integral</h1>
        </div>
        
        <nav className="nav-links">
          {/* Enlaces de Administrador */}
          {user?.role === 'ADMIN' && (
            <>
              <NavLink to="/dashboard" end className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <Activity size={20} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/dashboard/usuarios" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <Users size={20} />
                <span>Usuarios</span>
              </NavLink>
              <NavLink to="/dashboard/pacientes" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <UserPlus size={20} />
                <span>Pacientes</span>
              </NavLink>
              <NavLink to="/dashboard/medicos" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <Stethoscope size={20} />
                <span>Médicos</span>
              </NavLink>
              <NavLink to="/dashboard/horarios" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <CalendarClock size={20} />
                <span>Horarios</span>
              </NavLink>
              <NavLink to="/dashboard/citas" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <CalendarDays size={20} />
                <span>Citas</span>
              </NavLink>
              <NavLink to="/dashboard/farmacia" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <Pill size={20} />
                <span>Farmacia</span>
              </NavLink>
            </>
          )}

          {/* Enlaces de Paciente */}
          {user?.role === 'PATIENT' && (
            <>
              <NavLink to="/dashboard/mi-portal" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <User size={20} />
                <span>Mi Portal</span>
              </NavLink>
              <NavLink to="/dashboard/tienda" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
                <Pill size={20} />
                <span>Farmacia</span>
              </NavLink>
            </>
          )}

          {/* Enlaces de Doctor */}
          {user?.role === 'DOCTOR' && (
            <NavLink to="/dashboard/mis-citas" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <CalendarDays size={20} />
              <span>Mis Citas</span>
            </NavLink>
          )}
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="search-bar"></div>
          <div className="user-profile flex items-center gap-4">
            <span style={{ fontWeight: 500 }}>{user?.name} ({user?.role})</span>
            <button className="btn" onClick={handleLogout} style={{ padding: '8px', color: 'var(--danger-color)', background: 'rgba(239, 68, 68, 0.1)' }}>
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default Layout;
