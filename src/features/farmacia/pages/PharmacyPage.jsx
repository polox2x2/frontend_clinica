import React, { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { Pill, Plus } from 'lucide-react';

const PharmacyPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title flex items-center gap-2">
          <Pill color="var(--accent-color)" /> Farmacia - Inventario
        </h1>
        <button className="btn btn-primary">
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      <div className="card">
        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{textAlign: 'center'}}>No hay productos registrados</td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.nombre}</td>
                      <td>{product.descripcion}</td>
                      <td>${product.precio}</td>
                      <td><span className={`badge ${product.stock > 10 ? 'badge-success' : 'badge-danger'}`}>{product.stock}</span></td>
                      <td>
                        <button className="btn" style={{padding: '6px 12px', fontSize: '0.8rem'}}>Editar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyPage;
