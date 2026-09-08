import { useState } from 'react';
import { createInvoice } from '../services/createInvoiceService';

export function InvoiceForm({ onInvoiceCreated, onCancel }) {
  // 1. Añadimos el estado para el ID personalizado
  const [customId, setCustomId] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. Armamos la factura incluyendo la propiedad 'id'
    const newInvoice = {
      id: customId.trim(), // 👈 Aquí se asigna tu ID personalizado
      numeroFactura,
      fecha,
      emisor,
      cliente,
      items,
      impuestoPorcentaje: Number(impuestoPorcentaje)
    };

    try {
      const savedInvoice = await createInvoice(newInvoice);
      alert('Factura creada exitosamente.');
      onInvoiceCreated(savedInvoice);
    } catch {
      alert('Ocurrió un error al intentar crear la factura (comprueba que el ID no esté repetido).');
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2 style={{ marginTop: 0, color: 'var(--accent-blue)' }}>Crear Nueva Factura</h2>

      <div className="form-grid">
        {/* 3. Nuevo campo de entrada para el ID de búsqueda */}
        <div className="form-group">
          <label>ID de Registro (Buscador)</label>
          <input
            type="text"
            placeholder="Ej: 101, fac-01, etc."
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            required
          />
        </div>

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
          <label>Nombre del Cliente</label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={cliente.nombre}
            onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
            required
          />
        </div>
      </div>

      <h3>Ítems de la Factura</h3>
      {items.map((item) => (
        <div key={item.id} className="item-row">
          <input
            type="text"
            placeholder="Descripción"
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
          min="0"
          max="100"
          required
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit" className="btn btn-primary">
          Guardar y Mostrar
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}