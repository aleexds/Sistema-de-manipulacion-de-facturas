import { useState, useEffect } from 'react';
import { InvoiceList } from './components/InvoiceList';
import { InvoiceForm } from './components/InvoiceForm';
import { Invoice } from './components/Invoice';

export default function App() {
  const [invoices, setInvoices] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'create' | 'view'
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Cargar facturas desde el backend simulado
  const fetchInvoices = () => {
    fetch('http://localhost:5000/facturas')
      .then((res) => res.json())
      .then((data) => setInvoices(data))
      .catch((err) => console.error('Error cargando facturas:', err));
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSelectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setView('view');
  };

  const handleInvoiceCreated = (newInvoice) => {
    setInvoices([...invoices, newInvoice]);
    setSelectedInvoice(newInvoice);
    setView('view');
  };

  // ✅ NUEVA FUNCIÓN: Eliminar factura
  const handleDeleteInvoice = (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta factura?');
    if (!confirmDelete) return;

    fetch(`http://localhost:5000/facturas/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          // Filtrar la factura eliminada del estado local
          setInvoices((prev) => prev.filter((inv) => inv.id !== id));
          if (selectedInvoice && selectedInvoice.id === id) {
            setSelectedInvoice(null);
            setView('list');
          }
          alert('Factura eliminada correctamente.');
        } else {
          alert('Ocurrió un error al intentar eliminar la factura.');
        }
      })
      .catch((err) => console.error('Error eliminando factura:', err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Sistema de Manipulación de Facturas</h1>
      <hr />

      {view === 'list' && (
        <InvoiceList
          invoices={invoices}
          onSelectInvoice={handleSelectInvoice}
          onCreateNew={() => setView('create')}
          onDeleteInvoice={handleDeleteInvoice} // ✅ Pasar prop
        />
      )}

      {view === 'create' && (
        <InvoiceForm
          onInvoiceCreated={handleInvoiceCreated}
          onCancel={() => setView('list')}
        />
      )}

      {view === 'view' && (
        <Invoice
          invoice={selectedInvoice}
          onBack={() => setView('list')}
          onDeleteInvoice={handleDeleteInvoice} // ✅ Pasar prop
        />
      )}
    </div>
  );
}