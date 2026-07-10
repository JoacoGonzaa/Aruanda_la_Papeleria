import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TiendaCliente from './pages/TiendaCliente';
import PanelAdmin from './pages/PanelAdmin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta para los clientes (Página principal) */}
        <Route path="/" element={<TiendaCliente />} />
        
        {/* Ruta secreta/exclusiva para el administrador */}
        <Route path="/admin" element={<PanelAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;