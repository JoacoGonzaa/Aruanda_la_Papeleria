import { Routes, Route } from 'react-router-dom';
import TiendaCliente from './pages/TiendaCliente';
import PanelAdmin from './pages/PanelAdmin';

function App() {
  // Detecta si es el sitio del administrador
  const esAdminSite = import.meta.env.VITE_IS_ADMIN === 'true';

  return (
    <Routes>
      {esAdminSite ? (
        <>
          {/* En la web de administración, la raíz "/" muestra el panel directamente */}
          <Route path="/" element={<PanelAdmin />} />
          <Route path="/tienda" element={<TiendaCliente />} />
        </>
      ) : (
        <>
          {/* En la web de clientes, se mantiene todo exactamente como antes */}
          <Route path="/" element={<TiendaCliente />} />
          <Route path="/admin" element={<PanelAdmin />} />
        </>
      )}
    </Routes>
  );
}

export default App;