import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import logo from '../assets/Logo_Aruanda_LP.jpeg';
import { Link } from 'react-router-dom';
// ... dentro de tu JSX:
<Link to="/admin" style={{ color: '#94a3b8', fontSize: '12px' }}>⚙️ Acceso Interno</Link>

export default function TiendaCliente() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerProductos() {
      const { data } = await supabase.from('Productos').select('*');
      setProductos(data || []);
      setCargando(false);
    }
    obtenerProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    setCarrito((currCarrito) => {
      const existe = currCarrito.find(item => item.id === producto.id);
      if (existe) {
        return currCarrito.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...currCarrito, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(curr => curr.filter(item => item.id !== id));
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0).toFixed(2);
  };

  const enviarPedidoWhatsApp = () => {
    const telefono = "56964500721"; // ⚠️ Pon tu número real aquí
    let mensaje = "🛒 *¡Hola! Me gustaría hacer el siguiente pedido:*\n\n";
    carrito.forEach(item => {
      mensaje += `▪️ *${item.cantidad}x* ${item.nombre} - $${(item.precio * item.cantidad).toFixed(2)}\n`;
    });
    mensaje += `\n💰 *Total Estimado:* $${calcularTotal()}\n\n¿Tienen disponibilidad de estos artículos?`;

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ 
      backgroundColor: '#0a0f1d', 
      minHeight: '100vh', 
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: '#f8fafc',
      position: 'relative',
      overflowX: 'hidden',
      paddingBottom: '60px'
    }}>
      
      {/* LUCES AMBIENTALES DE FONDO COMPLETO */}
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.18)', filter: 'blur(120px)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', top: '30%', right: '-150px', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(147, 51, 234, 0.12)', filter: 'blur(150px)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-100px', left: '10%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.1)', filter: 'blur(130px)', pointerEvents: 'none' }}></div>

      {/* HEADER CON LOGO Y TEXTO ORIGINAL */}
      <header style={{ 
        backdropFilter: 'blur(16px)', 
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(15, 23, 42, 0.7)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '20px 40px', 
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              padding: '2px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              boxShadow: '0 0 15px rgba(37, 99, 235, 0.4)'
            }}>
              <img src={logo} alt="Logo" style={{ height: '50px', width: '50px', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
            </div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>
               Aruanda La Papelería
            </h1>
          </div>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '14px', color: '#cbd5e1' }}>Haz tu pedido en línea y retira en tienda</p>
        </div>
      </header>

      {/* CONTENIDO EXPANDIDO PARA OCUPAR TODO EL ESPACIO */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', padding: '0 40px', maxWidth: '1400px', margin: '40px auto 0 auto' }}>
        
        {/* SECCIÓN IZQUIERDA: CATÁLOGO */}
        <div style={{ flex: '3', minWidth: '320px' }}>
          <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '700', marginBottom: '24px', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
            📚 Nuestro Catálogo
          </h2>
          
          {cargando ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
              Cargando espectaculares productos...
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {productos.map(p => (
                <div key={p.id} className="futuristic-card" style={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.55)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ position: 'relative', backgroundColor: '#0f172a', height: '160px', overflow: 'hidden' }}>
                    <img src={p.imagen_url} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9, transition: 'transform 0.4s' }} className="card-img" />
                    {p.categoria && (
                      <span style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        left: '10px', 
                        backgroundColor: 'rgba(30, 58, 138, 0.85)', 
                        color: 'white', 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        textTransform: 'uppercase'
                      }}>
                        {p.categoria}
                      </span>
                    )}
                  </div>
                  
                  <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>{p.nombre}</h4>
                    </div>
                    <div>
                      <p style={{ color: '#38bdf8', fontWeight: '700', fontSize: '20px', margin: '0 0 12px 0' }}>${p.precio.toFixed(2)}</p>
                      <button onClick={() => agregarAlCarrito(p)} style={{ 
                        backgroundColor: '#2563eb', 
                        color: 'white', 
                        border: 'none', 
                        padding: '10px 12px', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        width: '100%', 
                        fontWeight: '600', 
                        fontSize: '14px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '8px', 
                        transition: 'background-color 0.2s' 
                      }} className="add-btn">
                        🛒 Añadir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECCIÓN DERECHA: EL CARRITO */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.65)', 
            padding: '24px', 
            borderRadius: '16px', 
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)', 
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            position: 'sticky', 
            top: '110px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              🛍️ Lista de Compra ({carrito.reduce((a, b) => a + b.cantidad, 0)})
            </h3>
            
            {carrito.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
                <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>🛒</span>
                Tu carrito está vacío.<br/>¡Añade productos para empezar!
              </div>
            ) : (
              <div>
                <div style={{ maxHeight: '320px', overflowY: 'auto', paddingRight: '5px' }}>
                  {carrito.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ marginRight: '10px' }}>
                        <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '14px' }}>{item.nombre}</span>
                        <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
                          {item.cantidad} x ${item.precio.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: '700', color: '#38bdf8', fontSize: '14px' }}>${(item.precio * item.cantidad).toFixed(2)}</span>
                        <button onClick={() => eliminarDelCarrito(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', padding: '4px' }} title="Quitar">❌</button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ marginTop: '20px', backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8', fontWeight: '600' }}>Total a pagar:</span>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: '#4ade80' }}>${calcularTotal()}</span>
                  </div>
                </div>

                <button onClick={enviarPedidoWhatsApp} style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', cursor: 'pointer', width: '100%', fontWeight: '700', fontSize: '15px', marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)', transition: 'all 0.2s ease' }} className="checkout-btn">
                  💬 Enviar Pedido a WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}