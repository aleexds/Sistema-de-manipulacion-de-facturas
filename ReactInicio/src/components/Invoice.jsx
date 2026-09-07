export function Invoice({ invoice, onBack, onDeleteInvoice }) {
  if (!invoice) return null;

  const subtotal = invoice.items.reduce(
    (acc, item) => acc + item.cantidad * item.precio,
    0
  );
  const impuesto = subtotal * (invoice.impuestoPorcentaje / 100);
  const total = subtotal + impuesto;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Botones de acción (se ocultan automáticamente al imprimir) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          ← Volver al listado
        </button>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ Imprimir / Guardar PDF
          </button>
          <button className="btn btn-danger" onClick={() => onDeleteInvoice(invoice.id)}>
            Eliminar Factura
          </button>
        </div>
      </div>

      {/* Hoja de la Factura Real */}
      <div className="invoice-paper">
        <div className="invoice-header">
          <div>
            <h1 style={{ margin: 0, color: '#0f172a' }}>{invoice.emisor.nombre}</h1>
            <p style={{ margin: '0.2rem 0', color: '#64748b' }}>ID Fiscal: {invoice.emisor.idFiscal}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: 0, color: '#2563eb' }}>FACTURA</h2>
            <p style={{ margin: '0.2rem 0', fontWeight: 'bold' }}>#{invoice.numeroFactura}</p>
            <p style={{ margin: 0, color: '#64748b' }}>Fecha: {invoice.fecha}</p>
          </div>
        </div>

        <div className="invoice-grid">
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b' }}>FACTURADO A:</h4>
            <strong style={{ fontSize: '1.1rem' }}>{invoice.cliente.nombre}</strong>
            <p style={{ margin: '0.2rem 0', color: '#475569' }}>{invoice.cliente.correo}</p>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th style={{ textAlign: 'center' }}>Cantidad</th>
              <th style={{ textAlign: 'right' }}>Precio Unitario</th>
              <th style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td>{item.descripcion}</td>
                <td style={{ textAlign: 'center' }}>{item.cantidad}</td>
                <td style={{ textAlign: 'right' }}>${item.precio.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>${(item.cantidad * item.precio).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-totals">
          <div className="totals-box">
            <div className="totals-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="totals-row">
              <span>IVA ({invoice.impuestoPorcentaje}%):</span>
              <span>${impuesto.toFixed(2)}</span>
            </div>
            <div className="totals-row grand-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}