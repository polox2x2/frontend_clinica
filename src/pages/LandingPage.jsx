import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../features/medico/services/doctorService';
import { productService } from '../features/farmacia/services/productService';
import { Stethoscope, ShoppingBag, ArrowRight, HeartPulse, Activity, ShieldCheck, Star, Pill } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Información inventada para hacer el landing más presentable
  const features = [
    { icon: <HeartPulse size={24} color="var(--accent-color)" />, title: "Cuidado Integral", desc: "Abordamos tu salud de manera holística, combinando medicina preventiva y tratamientos avanzados." },
    { icon: <ShieldCheck size={24} color="var(--success-color)" />, title: "Seguridad y Confianza", desc: "Nuestros protocolos garantizan la máxima seguridad y confidencialidad en todos tus procedimientos." },
    { icon: <Activity size={24} color="var(--warning-color)" />, title: "Tecnología Moderna", desc: "Equipamiento de última generación para diagnósticos precisos y rápidos." }
  ];

  // Doctores mock por si el backend está vacío
  const mockDoctors = [
    { id: 'm1', nombre: 'Valeria', apellido: 'Montes', especialidad: { nombre: 'Cardiología' }, colegiatura: 'CMP-45892' },
    { id: 'm2', nombre: 'Andrés', apellido: 'García', especialidad: { nombre: 'Pediatría' }, colegiatura: 'CMP-99231' },
    { id: 'm3', nombre: 'Lucía', apellido: 'Ríos', especialidad: { nombre: 'Dermatología' }, colegiatura: 'CMP-12944' }
  ];

  // Productos mock por si el backend está vacío
  const mockProducts = [
    { id: 'p1', nombre: 'Crema Hidratante Facial', descripcion: 'Dermatológicamente probada para pieles sensibles.', precio: '24.50', stock: 15 },
    { id: 'p2', nombre: 'Vitaminas C + Zinc', descripcion: 'Refuerza tu sistema inmunológico de forma natural.', precio: '12.00', stock: 42 },
    { id: 'p3', nombre: 'Termómetro Digital', descripcion: 'Lectura rápida y precisa en 5 segundos.', precio: '8.90', stock: 5 },
    { id: 'p4', nombre: 'Jarabe Pediátrico', descripcion: 'Alivio rápido para la tos seca en niños.', precio: '15.20', stock: 20 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docs, prods] = await Promise.all([
          doctorService.getAll().catch(() => []),
          productService.getAll().catch(() => [])
        ]);
        
        // Si hay datos en la BD los usamos, sino usamos los mocks
        setDoctors(docs.length > 0 ? docs.slice(0, 3) : mockDoctors);
        setProducts(prods.length > 0 ? prods.slice(0, 4) : mockProducts);
      } catch (error) {
        console.error('Error fetching landing data', error);
        setDoctors(mockDoctors);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
      
      {/* Hero Minimalista */}
      <section style={{
        padding: '100px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decoraciones suaves de fondo */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px', background: 'rgba(212, 163, 115, 0.05)', borderRadius: '50%', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '300px', height: '300px', background: 'rgba(140, 179, 157, 0.08)', borderRadius: '50%', zIndex: 0 }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(212, 163, 115, 0.1)', color: 'var(--accent-color)', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '24px' }}>
            Bienvenido a tu nueva clínica
          </span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 300, marginBottom: '24px', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            Salud y bienestar en <br/><span style={{ fontWeight: 600, color: 'var(--accent-color)' }}>armonía contigo</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
            Un espacio diseñado para brindarte tranquilidad, cuidado experto y los mejores productos para ti y tu familia.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn btn-primary" style={{ padding: '14px 28px' }} onClick={() => navigate('/login')}>
              Acceder a mi portal <ArrowRight size={18} />
            </button>
            <button className="btn" style={{ padding: '14px 28px', backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)' }} onClick={() => {
              document.getElementById('doctores').scrollIntoView({ behavior: 'smooth' });
            }}>
              Conocer al equipo
            </button>
          </div>
        </div>
      </section>

      {/* Características (Inventadas para Landing) */}
      <section style={{ padding: '60px 40px', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {features.map((feat, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                {feat.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sección Doctores */}
      <section id="doctores" style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--text-primary)' }}>
                Especialistas a tu <span style={{ fontWeight: 600 }}>disposición</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Profesionales altamente capacitados y humanos.</p>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {doctors.map(doc => (
              <div key={doc.id} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '600', color: 'var(--accent-color)' }}>
                  {doc.nombre?.charAt(0)}{doc.apellido?.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Dr. {doc.nombre} {doc.apellido}</h3>
                  <div style={{ color: 'var(--success-color)', fontSize: '0.9rem', fontWeight: 500 }}>
                    {doc.especialidad?.nombre || 'General'}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                    CMP: {doc.colegiatura}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Reservación */}
      <section style={{ padding: '80px 40px', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid rgba(0,0,0,0.02)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', backgroundColor: 'var(--glass-bg)', padding: '60px 40px', borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--accent-color)', marginBottom: '16px' }}>
            Agenda tu cita hoy mismo
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px' }}>
            No esperes más para cuidar de tu salud. Regístrate como paciente o inicia sesión para elegir a tu especialista y el horario que mejor se adapte a ti.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }} onClick={() => navigate('/login')}>
              Iniciar Sesión para Reservar
            </button>
            <button className="btn" style={{ padding: '16px 32px', fontSize: '1.1rem', backgroundColor: '#fff', border: '1px solid var(--glass-border)' }} onClick={() => navigate('/register')}>
              Crear cuenta de paciente
            </button>
          </div>
        </div>
      </section>

      {/* Sección Farmacia / Tienda */}
      <section style={{ padding: '80px 40px', backgroundColor: '#fff', borderTop: '1px solid rgba(0,0,0,0.02)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--text-primary)' }}>
                Nuestra <span style={{ fontWeight: 600 }}>Farmacia</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Productos seleccionados para tu bienestar diario.</p>
            </div>
            <button className="btn" style={{ color: 'var(--accent-color)' }}>Ver catálogo completo</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
            {products.map(prod => (
              <div key={prod.id} className="glass-panel" style={{ padding: '24px', backgroundColor: 'var(--bg-primary)', border: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ padding: '8px', background: '#fff', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                    <Pill size={20} color="var(--success-color)" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--warning-color)' }}>
                    <Star size={14} fill="currentColor" /> 4.9
                  </div>
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', fontWeight: 500 }}>{prod.nombre}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', minHeight: '40px' }}>
                  {prod.descripcion}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    ${prod.precio}
                  </span>
                  <button className="btn" style={{ padding: '6px 12px', fontSize: '0.85rem', background: '#fff', border: '1px solid var(--glass-border)' }}>
                    Añadir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
