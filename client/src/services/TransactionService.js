// client/src/services/transactionService.js
import axios from 'axios';
import api from './api';
export const getTransactions = () => api.get('/transactions');
export const addTransaction  = (data) => api.post('/transactions', data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);
export const parseReceipt = formData =>
  api.post('/transactions/parse', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  .then(res => res.data); 

  export function uploadTransactionPDF(file) {
  const form = new FormData();
  form.append('file', file);
  // adjust endpoint as needed
  return api.post('/transactions/upload-pdf', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}