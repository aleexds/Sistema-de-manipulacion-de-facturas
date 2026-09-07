import { useState, useEffect } from 'react';
import './App.css'; // ✅ Importar hoja de estilos
import { InvoiceList } from './components/InvoiceList';
import { InvoiceForm } from './components/InvoiceForm';
import { Invoice } from './components/Invoice';

export default function App() {
  const [invoices, setInvoices] = useState([]);
  const [view, setView] = useState('list');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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

  const handleDeleteInvoice = (id) => {
    const confirmDelete = window.confirm('¿Deseas eliminar esta factura?');
    if (!confirmDelete) return;

    fetch(`http://localhost:5000/facturas/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          setInvoices((prev) => prev.filter((inv) => inv.id !== id));
          if (selectedInvoice && selectedInvoice.id === id) {
            setSelectedInvoice(null);
            setView('list');
          }
        }
      });
  };

  return (
    <div className="app-container">
      <header className="header-title no-print">
        <h1>Sistema de Facturación</h1>
      </header>

      {view === 'list' && (
        <InvoiceList
          invoices={invoices}
          onSelectInvoice={handleSelectInvoice}
          onCreateNew={() => setView('create')}
          onDeleteInvoice={handleDeleteInvoice}
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
          onDeleteInvoice={handleDeleteInvoice}
        />
      )}
    </div>
  );
}