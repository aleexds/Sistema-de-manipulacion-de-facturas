import { useState, useEffect } from 'react';
import './App.css';
import { getInvoiceById } from './services/getInvoiceByIdService';
import { deleteInvoiceById } from './services/deleteInvoiceService';
import { InvoiceForm } from './components/InvoiceForm';
import { Invoice } from './components/Invoice';

export default function App() {
  const [searchId, setSearchId] = useState('');
  const [activeId, setActiveId] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('search');

  useEffect(() => {
    if (!activeId) return;

    const fetchInvoice = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getInvoiceById(activeId);
        if (data) {
          setInvoice(data);
        } else {
          setInvoice(null);
          setError(`No se encontró ninguna factura con el ID: "${activeId}"`);
        }
      } catch {
        setError('Error al conectar con el servidor.');
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [activeId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveId(searchId.trim());
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta factura?')) return;
    try {
      await deleteInvoiceById(id);
      alert('Factura eliminada correctamente.');
      handleBackToList();
    } catch {
      alert('Error al intentar eliminar la factura.');
    }
  };

  const handleInvoiceCreated = (newInvoice) => {
    setView('search');
    setSearchId(newInvoice.id);
    setActiveId(newInvoice.id);
  };

  // ✅ Función para restablecer la vista inicial del buscador
  const handleBackToList = () => {
    setActiveId('');
    setSearchId('');
    setInvoice(null);
    setError(null);
  };

  return (
    <div className="app-container">
      <header className="header-title no-print">
        <h1>Buscador de Facturas por ID</h1>
        <button
          className="btn btn-primary"
          onClick={() => setView(view === 'search' ? 'create' : 'search')}
        >
          {view === 'search' ? '+ Crear Nueva Factura' : '← Ir al Buscador'}
        </button>
      </header>

      {view === 'create' ? (
        <InvoiceForm
          onInvoiceCreated={handleInvoiceCreated}
          onCancel={() => setView('search')}
        />
      ) : (
        <div>
          {/* Formulario de búsqueda por ID */}
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="search-input"
              placeholder="Ingresa el ID exacto de la factura (ej: 1, 101, fac-01)..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Buscar por ID
            </button>
          </form>

          {/* Mensaje cuando la página arranca limpia */}
          {!activeId && !loading && (
            <div className="form-card" style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>
                Ingresa un ID en la barra superior para consultar los detalles de una factura.
              </p>
            </div>
          )}

          {/* Indicador de carga */}
          {loading && (
            <div className="form-card" style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p style={{ color: 'var(--accent-blue)' }}>Consultando backend...</p>
            </div>
          )}

          {/* Mensaje de Error / No Encontrado */}
          {error && !loading && (
            <div className="form-card" style={{ textAlign: 'center', marginTop: '2rem', borderColor: 'var(--accent-red)' }}>
              <p style={{ color: 'var(--accent-red)' }}>{error}</p>
            </div>
          )}

          {/* Resultado de la búsqueda */}
          {invoice && !loading && (
            <div style={{ marginTop: '2rem' }}>
              <Invoice
                invoice={invoice}
                onDeleteInvoice={handleDelete}
                onBack={handleBackToList} /* ✅ Prop vinculada */
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}