const API_URL = 'http://localhost:5000/facturas';

// Asegúrate de escribir 'export const'
export const deleteInvoiceById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar la factura');
  return response.ok;
};