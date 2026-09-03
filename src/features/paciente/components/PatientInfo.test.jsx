import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PatientInfo from './PatientInfo';

describe('PatientInfo', () => {
  it('shows an empty state when patient data is missing', () => {
    render(<PatientInfo />);

    expect(screen.getByText('No hay datos del paciente.')).toBeInTheDocument();
  });

  it('renders patient data', () => {
    render(
      <PatientInfo
        patient={{
          nombre: 'Ana',
          apellido: 'Lopez',
          documento: '12345678',
          telefono: '555-0192',
          fechaNacimiento: '1995-03-20',
        }}
      />
    );

    expect(screen.getByText('Ana Lopez')).toBeInTheDocument();
    expect(screen.getByText('12345678')).toBeInTheDocument();
    expect(screen.getByText('555-0192')).toBeInTheDocument();
    expect(screen.getByText('1995-03-20')).toBeInTheDocument();
  });

  it('shows fallback text for optional missing fields', () => {
    render(<PatientInfo patient={{ nombre: 'Ana', apellido: 'Lopez' }} />);

    expect(screen.getAllByText('No especificado')).toHaveLength(2);
    expect(screen.getByText('No especificada')).toBeInTheDocument();
  });
});
