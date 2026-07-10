import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';

export default function PanelAdmin() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    obtenerProductos();
  }, []);

  async function obtenerProductos() {
    const { data } = await supabase
      .from('Productos')
      .select('*')
      .order('created_at', { ascending: false });
    setProductos(data || []);
    setCargando(false);
  }

  const guardarProducto = async (e) => {
    e.preventDefault();
    if (!nombre || !precio || !imagen) return alert("Por favor llena los campos requeridos");
    setSubiendo(true);

    try {
      const nombreArchivo = `${Date.now()}_${imagen.name}`;
      const { error: uploadError } = await supabase.storage
        .from('fotos-productos')
        .upload(nombreArchivo, imagen);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('fotos-productos')
        .getPublicUrl(nombreArchivo);

      const { error: dbError } = await supabase
        .from('Productos')
        .insert([{ nombre, precio: parseFloat(precio), categoria, imagen_url: urlData.publicUrl }]);

      if (dbError) throw dbError;

      alert("🎉 ¡Producto registrado exitosamente!");
      setNombre(''); setPrecio(''); setCategoria(''); setImagen(null);
      e.target.reset();
      obtenerProductos();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setSubiendo(false);
    }
  };

  const eliminarProducto = async (id, nombreProd) => {
    if (!window.confirm(`¿Seguro que quieres eliminar definitivamente "${nombreProd}"?`)) return;
    const { error } = await supabase.from('Productos').delete().eq('id', id);
    if (error) alert(error.message);
    else { obtenerProductos(); }
  };

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '40px 20px', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#0f172a', margin: 0, fontSize: '28px', fontWeight: '800' }}>🔐 Panel de Inventario</h1>
          <a href="/" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '14px', fontWeight: '600', backgroundColor: 'white', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            👀 Ver Tienda
          </a>
        </div>
        
        {/* FORMULARIO */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '40px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px' }}>✨ Añadir Nuevo Artículo</h2>
          
          <form onSubmit={guardarProducto} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Nombre del Producto *</label>
              <input type="text" placeholder="Ej: Cuaderno Universitario Raya" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Precio *</label>
              <input type="number" step="0.01" placeholder="0.00" value={precio} onChange={e => setPrecio(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Categoría</label>
              <input type="text" placeholder="Ej: Escritorio, Escolar" value={categoria} onChange={e => setCategoria(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px' }} />
            </div>

            <div style={{ gridColumn: 'span 2', marginTop: '5px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Fotografía del Producto *</label>
              <input type="file" accept="image/*" onChange={e => setImagen(e.target.files[0])} required style={{ fontSize: '14px', color: '#64748b' }} />
            </div>

            <div style={{ gridColumn: 'span 2', marginTop: '10px', textAlign: 'right' }}>
              <button type="submit" disabled={subiendo} style={{ backgroundColor: '#1e3a8a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'background-color 0.2s', opacity: subiendo ? 0.7 : 1 }}>
                {subiendo ? 'Subiendo datos...' : '🚀 Registrar Artículo'}
              </button>
            </div>
          </form>
        </div>

        {/* TABLA DE PRODUCTOS */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
            <h3 style={{ margin: 0, color: '#1e293b', fontSize: '16px' }}>Inventario en Base de Datos ({productos.length})</h3>
          </div>
          
          {cargando ? <p style={{ padding: '20px', color: '#64748b', textAlign: 'center' }}>Cargando inventario...</p> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '14px 24px', color: '#64748b', fontWeight: '600' }}>Miniatura</th>
                    <th style={{ padding: '14px 24px', color: '#64748b', fontWeight: '600' }}>Nombre</th>
                    <th style={{ padding: '14px 24px', color: '#64748b', fontWeight: '600' }}>Precio</th>
                    <th style={{ padding: '14px 24px', color: '#64748b', fontWeight: '600' }}>Categoría</th>
                    <th style={{ padding: '14px 24px', color: '#64748b', fontWeight: '600', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '10px 24px' }}>
                        <img src={p.imagen_url} alt="" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                      </td>
                      <td style={{ padding: '14px 24px', fontWeight: '600', color: '#0f172a' }}>{p.nombre}</td>
                      <td style={{ padding: '14px 24px', color: '#0f172a', fontWeight: '600' }}>${p.precio.toFixed(2)}</td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', color: '#475569' }}>{p.categoria || 'Misma'}</span>
                      </td>
                      <td style={{ padding: '14px 24px', textAlign: 'center' }}>
                        <button onClick={() => eliminarProducto(p.id, p.nombre)} style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}>
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}