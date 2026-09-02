import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

// Muestra mensajes de error, éxito o información al usuario
const Alert = ({ type = 'info', message }) => {
  if (!message) return null;

  const styles = {
    error: { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', icon: <AlertCircle size={20} /> },
    success: { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', icon: <CheckCircle size={20} /> },
    info: { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-color)', icon: <Info size={20} /> }
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
      borderRadius: '8px', marginBottom: '16px', background: currentStyle.bg, color: currentStyle.color
    }}>
      {currentStyle.icon}
      <span style={{ fontWeight: 500 }}>{message}</span>
    </div>
  );
};

export default Alert;
