import { useState } from 'react';

export function InvoiceList({ invoices, onSelectInvoice, onCreateNew, onDeleteInvoice }) {
  const [searchTerm, setSearchTerm] = useState('');

  const calculateTotal = (items, taxRate) => {
    const subtotal = items.reduce((acc, item) => acc + item.cantidad * item.precio, 0);
    return subtotal + subtotal * ((taxRate || 0) / 100);
  };

  // Filtrar facturas según el término de búsqueda
  const filteredInvoices = invoices.filter((inv) =>
    inv.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cálculos de métricas globales
  const totalFacturado = invoices.reduce(
    (acc, inv) => acc + calculateTotal(inv.items, inv.impuestoPorcentaje),
    0
  );

  return (
    <div>
      {/* Sección de Métricas */}
      <div className="metrics-grid">
        <div className="metric-card">
          <span>Facturas Emitidas</span>
          <h3>{invoices.length}</h3>
        </div>
        <div className="metric-card">
          <span>Total Facturado</span>
          <h3>${totalFacturado.toFixed(2)}</h3>
        </div>
        <div className="metric-card">
          <span>Promedio por Factura</span>
          <h3>${(invoices.length ? totalFacturado / invoices.length : 0).toFixed(2)}</h3>
        </div>
      </div>

      {/* Bar de Controles */}
      <div className="controls-bar">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Buscar por Nº factura o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={onCreateNew}>
          + Nueva Factura
        </button>
      </div>

      {/* Listado o Estado Vacío */}
      {filteredInvoices.length === 0 ? (
        <div className="form-card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No se encontraron facturas.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Nº Factura</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td><strong>#{inv.numeroFactura}</strong></td>
                  <td>{inv.cliente.nombre}</td>
                  <td>{inv.fecha}</td>
                  <td style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>
                    ${calculateTotal(inv.items, inv.impuestoPorcentaje).toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ marginRight: '0.5rem' }}
                      onClick={() => onSelectInvoice(inv)}
                    >
                      Ver Detalle
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => onDeleteInvoice(inv.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}