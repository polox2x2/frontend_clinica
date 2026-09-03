import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const renderProtectedRoute = (allowedRoles) => {
  return render(
    <MemoryRouter initialEntries={['/private']}>
      <Routes>
        <Route path="/private" element={<ProtectedRoute allowedRoles={allowedRoles} />}>
          <Route index element={<div>Contenido privado</div>} />
        </Route>
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/dashboard" element={<div>Dashboard admin</div>} />
        <Route path="/dashboard/mi-portal" element={<div>Portal paciente</div>} />
        <Route path="/dashboard/mis-citas" element={<div>Citas medico</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects unauthenticated users to login', () => {
    useAuth.mockReturnValue({ user: null });

    renderProtectedRoute();

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders the outlet when the user role is allowed', () => {
    useAuth.mockReturnValue({ user: { role: 'ADMIN' } });

    renderProtectedRoute(['ADMIN']);

    expect(screen.getByText('Contenido privado')).toBeInTheDocument();
  });

  it('redirects patients to their portal when role is not allowed', () => {
    useAuth.mockReturnValue({ user: { role: 'PATIENT' } });

    renderProtectedRoute(['ADMIN']);

    expect(screen.getByText('Portal paciente')).toBeInTheDocument();
  });
});
