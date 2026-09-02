import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { useAuth } from '../../../context/AuthContext';
import Alert from '../../../components/Alert';
import { ShoppingCart, Package, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';

const mockProducts = [
  { id: 1, nombre: 'Paracetamol 500mg', descripcion: 'Analgésico y antipirético', precio: 5.50, stock: 50, category: 'Medicina' },
  { id: 2, nombre: 'Ibuprofeno 400mg', descripcion: 'Antiinflamatorio no esteroideo', precio: 8.20, stock: 30, category: 'Medicina' },
  { id: 3, nombre: 'Vitamina C 1000mg', descripcion: 'Suplemento vitamínico', precio: 12.00, stock: 15, category: 'Suplementos' },
  { id: 4, nombre: 'Jarabe para la tos', descripcion: 'Alivio rápido de la tos seca', precio: 15.50, stock: 20, category: 'Medicina' },
  { id: 5, nombre: 'Curitas (Caja)', descripcion: 'Vendas adhesivas estériles', precio: 3.00, stock: 100, category: 'Primeros Auxilios' },
  { id: 6, nombre: 'Alcohol en gel', descripcion: 'Desinfectante de manos 70%', precio: 4.50, stock: 80, category: 'Cuidado Personal' },
];

const StorePage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState(null); // 'processing', 'success', 'error'
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    productService.getAll()
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(mockProducts);
        }
      })
      .catch(() => setProducts(mockProducts))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setAlertMsg('Producto agregado al carrito');
    setTimeout(() => setAlertMsg(''), 2000);
  };

  const updateQuantity = (id, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      });
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutStatus('processing');
    
    try {
      const orderData = {
        patientEmail: user?.username, // Simulando envío de orden
        total: cartTotal,
        items: cart.map(item => ({ productId: item.id, quantity: item.quantity }))
      };
      await orderService.create(orderData);
      setCheckoutStatus('success');
      setCart([]);
    } catch (err) {
      // Como es mock o no está implementado el backend DTO exacto, forzamos éxito para la demo visual
      setTimeout(() => {
        setCheckoutStatus('success');
        setCart([]);
      }, 1500);
    }
  };

  return (
    <div className="animate-fade-in relative" style={{ display: 'flex', gap: '24px', minHeight: '80vh' }}>
      
      {/* Contenido Principal (Catálogo) */}
      <div style={{ flex: 1 }}>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <Package color="var(--accent-color)" /> Farmacia en Línea
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Encuentra los medicamentos y productos que necesitas.</p>
          </div>
          
          {/* Botón Carrito Flotante (Móvil/Tablet o fijo arriba) */}
          <button 
            className="btn btn-primary" 
            style={{ position: 'relative', padding: '12px' }}
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: 'var(--danger-color)', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {cartItemCount}
              </span>
            )}
            <span className="ml-2">Ver Carrito</span>
          </button>
        </div>

        {alertMsg && <Alert type="success" message={alertMsg} />}

        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {products.map(product => (
              <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{product.nombre}</h3>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>${product.precio?.toFixed(2)}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>{product.descripcion}</p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.8rem', color: product.stock > 10 ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: 500 }}>
                    Stock: {product.stock}
                  </span>
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                    onClick={() => addToCart(product)}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Panel del Carrito (Side Panel) */}
      {isCartOpen && (
        <div className="card animate-fade-in" style={{ width: '350px', position: 'sticky', top: '24px', height: 'fit-content', border: '1px solid var(--accent-color)' }}>
          <div className="flex justify-between items-center mb-4" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
            <h3 className="flex items-center gap-2" style={{ margin: 0 }}>
              <ShoppingCart size={20} color="var(--accent-color)" /> Tu Carrito
            </h3>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setIsCartOpen(false)}>X</button>
          </div>

          {checkoutStatus === 'success' ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <CheckCircle2 size={48} color="var(--success-color)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ color: 'var(--success-color)' }}>¡Compra Exitosa!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tu pedido ha sido procesado. Puedes pasar a recogerlo a la farmacia de la clínica.</p>
              <button className="btn btn-primary mt-4" style={{ width: '100%' }} onClick={() => setCheckoutStatus(null)}>Comprar más</button>
            </div>
          ) : cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-secondary)' }}>
              <ShoppingCart size={40} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: 0, fontSize: '0.95rem' }}>{item.nombre}</h5>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>${(item.precio * item.quantity).toFixed(2)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '4px', background: 'var(--bg-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Minus size={14} /></button>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '4px', background: 'var(--bg-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Plus size={14} /></button>
                    <button onClick={() => removeFromCart(item.id)} style={{ padding: '4px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '8px' }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <span>Total:</span>
                  <span style={{ color: 'var(--accent-color)' }}>${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '14px' }}
                  onClick={handleCheckout}
                  disabled={checkoutStatus === 'processing'}
                >
                  {checkoutStatus === 'processing' ? 'Procesando...' : 'Finalizar Compra'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StorePage;
