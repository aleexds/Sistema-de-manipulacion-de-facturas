export function InvoiceList({ invoices, onSelectInvoice, onCreateNew, onDeleteInvoice }) {
  // Manejo de estado vacío
  if (!invoices || invoices.length === 0) {
    return (
      <div>
        <h2>Listado de Facturas</h2>
        <button onClick={onCreateNew}>+ Crear Primera Factura</button>
        <p>No hay facturas registradas.</p>
      </div>
    );
  }

  // Función helper para calcular el total acumulado
  const calculateTotal = (items, taxRate) => {
    const subtotal = items.reduce((acc, item) => acc + item.cantidad * item.precio, 0);
    return subtotal + subtotal * ((taxRate || 0) / 100);
  };

  return (
    <div>
      <h2>Listado de Facturas</h2>
      <button onClick={onCreateNew}>+ Crear Nueva Factura</button>
      <br /><br />

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Nº Factura</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.numeroFactura}</td>
              <td>{inv.cliente.nombre}</td>
              <td>{inv.fecha}</td>
              <td>${calculateTotal(inv.items, inv.impuestoPorcentaje).toFixed(2)}</td>
              <td>
                <button onClick={() => onSelectInvoice(inv)}>Ver Detalle</button>
                {' '}
                {/* ✅ Botón Eliminar */}
                <button onClick={() => onDeleteInvoice(inv.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}