import React, { useState, useEffect } from 'react';
import { Activity, Users, CalendarClock, Pill } from 'lucide-react';
import { patientService } from '../features/paciente/services/patientService';
import { appointmentService } from '../features/cita/services/appointmentService';
import { productService } from '../features/farmacia/services/productService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    appointmentsToday: 0,
    lowStockProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Obtenemos todos los datos de las APIs vinculadas
        const [patientsData, appointmentsData, productsData] = await Promise.all([
          patientService.getAll().catch(() => []),
          appointmentService.getAll().catch(() => []),
          productService.getAll().catch(() => [])
        ]);

        // Filtramos las citas de hoy (comparando fechas locales)
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointmentsData.filter(app => {
          if (!app.fecha) return false;
          return app.fecha.startsWith(today); // Asumiendo formato ISO o YYYY-MM-DD
        });

        // Filtramos productos con bajo stock (ejemplo: stock <= 10)
        const lowStock = productsData.filter(prod => prod.stock <= 10);

        setStats({
          patients: patientsData.length,
          appointmentsToday: todayAppointments.length,
          lowStockProducts: lowStock.length
        });
      } catch (error) {
        console.error("Error al cargar los datos del dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Dashboard Principal</h1>
      
      {loading ? (
        <p>Cargando estadísticas en tiempo real...</p>
      ) : (
        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          {/* Tarjeta de Pacientes */}
          <div className="card" style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-color)' }}>
              <Users size={32} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-primary)' }}>{stats.patients}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Pacientes Totales</p>
            </div>
          </div>

          {/* Tarjeta de Citas */}
          <div className="card" style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--success-color)' }}>
              <CalendarClock size={32} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-primary)' }}>{stats.appointmentsToday}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Citas de Hoy</p>
            </div>
          </div>

          {/* Tarjeta de Inventario */}
          <div className="card" style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--danger-color)' }}>
              <Pill size={32} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-primary)' }}>{stats.lowStockProducts}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Prod. Bajo Stock</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="glass-panel mt-4" style={{ padding: '32px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity color="var(--accent-color)" /> Visión General del Sistema
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Este panel está conectado directamente a las APIs del backend. Utiliza el menú lateral para gestionar detalladamente usuarios, pacientes, agenda médica, citas y el inventario de la farmacia.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
