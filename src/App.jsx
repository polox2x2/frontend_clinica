import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import UsersPage from './features/usuario/pages/UsersPage';
import PatientsPage from './features/paciente/pages/PatientsPage';
import DoctorsPage from './features/medico/pages/DoctorsPage';
import SchedulesPage from './features/horario/pages/SchedulesPage';
import AppointmentsPage from './features/cita/pages/AppointmentsPage';
import PharmacyPage from './features/farmacia/pages/PharmacyPage';
import PatientPortal from './features/paciente/pages/PatientPortal';
import StorePage from './features/farmacia/pages/StorePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas Privadas */}
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route index element={<Dashboard />} />
                <Route path="usuarios/*" element={<UsersPage />} />
                <Route path="pacientes/*" element={<PatientsPage />} />
                <Route path="medicos/*" element={<DoctorsPage />} />
                <Route path="horarios/*" element={<SchedulesPage />} />
                <Route path="citas/*" element={<AppointmentsPage />} />
                <Route path="farmacia/*" element={<PharmacyPage />} />
              </Route>

              {/* Patient Routes */}
              <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
                <Route path="mi-portal/*" element={<PatientPortal />} />
                <Route path="tienda/*" element={<StorePage />} />
              </Route>

              {/* Doctor Routes (placeholder for now) */}
              <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
                <Route path="mis-citas/*" element={<div className="animate-fade-in p-8"><h1>Mis Citas (Doctor)</h1><p>Vista en desarrollo...</p></div>} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
