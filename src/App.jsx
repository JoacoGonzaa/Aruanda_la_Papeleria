import { Routes, Route } from 'react-router-dom';
import TiendaCliente from './pages/TiendaCliente';
import PanelAdmin from './pages/PanelAdmin';

function App() {
  return (
    <Routes>
      {/* La raíz "/" cargará la tienda de clientes */}
      <Route path="/" element={<TiendaCliente />} />
      
      {/* Esta ruta "/admin" cargará tu panel */}
      <Route path="/chanchi" element={<PanelAdmin />} />

      {/* RUTA DE RESPALDO: Si entras a la página de administración directa, 
          también responderá en la raíz del sitio admin */}
      <Route path="/chanchi-directo" element={<PanelAdmin />} />
    </Routes>
  );
}

export default App;