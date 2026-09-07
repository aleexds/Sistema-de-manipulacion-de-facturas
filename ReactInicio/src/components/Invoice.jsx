export function Invoice({ invoice, onBack, onDeleteInvoice }) {
  if (!invoice) return null;

  // Cálculos derivados del estado
  const subtotal = invoice.items.reduce(
    (acc, item) => acc + item.cantidad * item.precio,
    0
  );
  const impuesto = subtotal * (invoice.impuestoPorcentaje / 100);
  const total = subtotal + impuesto;

  return (
    <div>
      <button onClick={onBack}>← Volver al listado</button>
      {' '}
      {/* ✅ Botón Eliminar en la vista detalle */}
      <button onClick={() => onDeleteInvoice(invoice.id)}>Eliminar Factura</button>
      
      <h2>FACTURA #{invoice.numeroFactura}</h2>
      <p><strong>Fecha de Emisión:</strong> {invoice.fecha}</p>

      <hr />

      <div>
        <h3>Emisor</h3>
        <p><strong>Nombre:</strong> {invoice.emisor.nombre}</p>
        <p><strong>ID Fiscal:</strong> {invoice.emisor.idFiscal}</p>
      </div>

      <div>
        <h3>Cliente</h3>
        <p><strong>Nombre:</strong> {invoice.cliente.nombre}</p>
        <p><strong>Correo/Dirección:</strong> {invoice.cliente.correo}</p>
      </div>

      <hr />

      <h3>Detalle de Ítems</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id}>
              <td>{item.descripcion}</td>
              <td>{item.cantidad}</td>
              <td>${item.precio}</td>
              <td>${(item.cantidad * item.precio).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <div>
        <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
        <p><strong>Impuesto ({invoice.impuestoPorcentaje}%):</strong> ${impuesto.toFixed(2)}</p>
        <p><strong>Total a Pagar:</strong> ${total.toFixed(2)}</p>
      </div>
    </div>
  );
}