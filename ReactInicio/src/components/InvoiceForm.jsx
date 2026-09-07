import { useState } from 'react';

export function InvoiceForm({ onInvoiceCreated, onCancel }) {
  const [numeroFactura, setNumeroFactura] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [emisor, setEmisor] = useState({ nombre: 'TechStore S.A.', idFiscal: '3-101-123456' });
  const [cliente, setCliente] = useState({ nombre: '', correo: '' });
  const [impuestoPorcentaje, setImpuestoPorcentaje] = useState(13);
  
  const [items, setItems] = useState([
    { id: 'item-1', descripcion: '', cantidad: 1, precio: 0 }
  ]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: crypto.randomUUID(), descripcion: '', cantidad: 1, precio: 0 }
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length === 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]: field === 'descripcion' ? value : Number(value)
          };
        }
        return item;
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!numeroFactura || !fecha || !emisor.nombre || !cliente.nombre) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const newInvoice = {
      numeroFactura,
      fecha,
      emisor,
      cliente,
      items,
      impuestoPorcentaje: Number(impuestoPorcentaje)
    };

    fetch('http://localhost:5000/facturas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInvoice)
    })
      .then((res) => res.json())
      .then((savedInvoice) => {
        onInvoiceCreated(savedInvoice);
      })
      .catch((err) => console.error('Error guardando factura:', err));
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2 style={{ marginTop: 0, color: 'var(--accent-blue)' }}>Crear Nueva Factura</h2>

      <h3>Datos Principales</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Nº Factura</label>
          <input
            type="text"
            placeholder="Ej: FAC-100"
            value={numeroFactura}
            onChange={(e) => setNumeroFactura(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Fecha de Emisión</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
      </div>

      <h3>Datos del Emisor y Cliente</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Empresa Emisora</label>
          <input
            type="text"
            value={emisor.nombre}
            onChange={(e) => setEmisor({ ...emisor, nombre: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>RUC / ID Fiscal Emisor</label>
          <input
            type="text"
            value={emisor.idFiscal}
            onChange={(e) => setEmisor({ ...emisor, idFiscal: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Nombre del Cliente</label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={cliente.nombre}
            onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Correo / Dirección Cliente</label>
          <input
            type="text"
            placeholder="juan@ejemplo.com"
            value={cliente.correo}
            onChange={(e) => setCliente({ ...cliente, correo: e.target.value })}
            required
          />
        </div>
      </div>

      <h3>Ítems de la Factura</h3>
      {items.map((item) => (
        <div key={item.id} className="item-row">
          <input
            type="text"
            placeholder="Descripción del producto/servicio"
            style={{ flex: 3 }}
            value={item.descripcion}
            onChange={(e) => handleItemChange(item.id, 'descripcion', e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Cant."
            min="1"
            style={{ flex: 1 }}
            value={item.cantidad}
            onChange={(e) => handleItemChange(item.id, 'cantidad', e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Precio"
            min="0"
            step="0.01"
            style={{ flex: 1 }}
            value={item.precio}
            onChange={(e) => handleItemChange(item.id, 'precio', e.target.value)}
            required
          />
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => handleRemoveItem(item.id)}
          >
            X
          </button>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-secondary"
        style={{ marginBottom: '1.5rem' }}
        onClick={handleAddItem}
      >
        + Agregar Producto
      </button>

      <div className="form-group" style={{ maxWidth: '200px', marginBottom: '1.5rem' }}>
        <label>Impuesto (% IVA)</label>
        <input
          type="number"
          value={impuestoPorcentaje}
          onChange={(e) => setImpuestoPorcentaje(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit" className="btn btn-primary">
          Guardar Factura
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}