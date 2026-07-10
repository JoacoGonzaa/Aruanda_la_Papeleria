import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TiendaCliente from './pages/TiendaCliente';
import PanelAdmin from './pages/PanelAdmin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<TiendaCliente />} />
  <Route path="/admin" element={<AdminPanel />} /> {/* O el nombre que tenga tu componente */}
</Routes>
    </BrowserRouter>
  );
}

export default App;