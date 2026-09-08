const API_URL = 'http://localhost:5000/facturas';

export const getInvoiceById = async (id) => {
  if (!id) return null;
  const response = await fetch(`${API_URL}/${id}`);
  console.log(response);
  
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Error al buscar la factura');
  }
  return await response.json();
};