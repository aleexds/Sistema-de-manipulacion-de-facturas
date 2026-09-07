import { useState } from 'react';

export function InvoiceForm({ onInvoiceCreated, onCancel }) {
  const [numeroFactura, setNumeroFactura] = useState('');
  const [fecha, setFecha] = useState('');
  const [emisor, setEmisor] = useState({ nombre: '', idFiscal: '' });
  const [cliente, setCliente] = useState({ nombre: '', correo: '' });
  const [impuestoPorcentaje, setImpuestoPorcentaje] = useState(13);
  
  // ✅ Usamos un ID fijo para el primer ítem inicial
  const [items, setItems] = useState([
    { id: 'item-1', descripcion: '', cantidad: 1, precio: 0 }
  ]);

  // Manejo de ítems dinámicos
  const handleAddItem = () => {
    setItems([
      ...items,
      // ✅ Generador único estándar del navegador
      { id: crypto.randomUUID(), descripcion: '', cantidad: 1, precio: 0 }
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length === 1) {
      alert('La factura debe tener al menos un ítem.');
      return;
    }
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
      alert('Por favor completa todos los campos obligatorios del emisor y cliente.');
      return;
    }

    const hasInvalidItem = items.some(
      (item) => !item.descripcion || item.cantidad <= 0 || item.precio < 0
    );

    if (hasInvalidItem) {
      alert('Revisa los ítems. Todos deben tener descripción, cantidad > 0 y precio válido.');
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
        alert('¡Factura guardada con éxito!');
        onInvoiceCreated(savedInvoice);
      })
      .catch((err) => console.error('Error guardando factura:', err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Nueva Factura</h2>

      <fieldset>
        <legend>Datos Generales</legend>
        <label>
          Número de Factura:
          <input
            type="text"
            value={numeroFactura}
            onChange={(e) => setNumeroFactura(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Fecha:
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Datos del Emisor</legend>
        <label>
          Nombre Empresa:
          <input
            type="text"
            value={emisor.nombre}
            onChange={(e) => setEmisor({ ...emisor, nombre: e.target.value })}
            required
          />
        </label>
        <br />
        <label>
          RUC / ID Fiscal:
          <input
            type="text"
            value={emisor.idFiscal}
            onChange={(e) => setEmisor({ ...emisor, idFiscal: e.target.value })}
            required
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Datos del Cliente</legend>
        <label>
          Nombre Cliente:
          <input
            type="text"
            value={cliente.nombre}
            onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
            required
          />
        </label>
        <br />
        <label>
          Correo / Dirección:
          <input
            type="text"
            value={cliente.correo}
            onChange={(e) => setCliente({ ...cliente, correo: e.target.value })}
            required
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Ítems de la Factura</legend>
        {items.map((item, index) => (
          <div key={item.id} style={{ marginBottom: '10px' }}>
            <span>#{index + 1} </span>
            <input
              type="text"
              placeholder="Descripción"
              value={item.descripcion}
              onChange={(e) => handleItemChange(item.id, 'descripcion', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Cant"
              min="1"
              value={item.cantidad}
              onChange={(e) => handleItemChange(item.id, 'cantidad', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Precio Unitario"
              min="0"
              step="0.01"
              value={item.precio}
              onChange={(e) => handleItemChange(item.id, 'precio', e.target.value)}
              required
            />
            <button type="button" onClick={() => handleRemoveItem(item.id)}>
              Eliminar
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>
          + Agregar Ítem
        </button>
      </fieldset>

      <fieldset>
        <legend>Impuesto</legend>
        <label>
          % IVA / Impuesto:
          <input
            type="number"
            value={impuestoPorcentaje}
            onChange={(e) => setImpuestoPorcentaje(e.target.value)}
          />
        </label>
      </fieldset>

      <br />
      <button type="submit">Guardar Factura</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
}