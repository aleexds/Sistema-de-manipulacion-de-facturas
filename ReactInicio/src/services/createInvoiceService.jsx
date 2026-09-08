const API_URL = 'http://localhost:5000/facturas';

// IMPORTANTE: Debe incluir 'export const'
export const createInvoice = async (invoiceData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoiceData),
  });

  if (!response.ok) {
    throw new Error('Error al guardar la factura');
  }

  return await response.json();
};