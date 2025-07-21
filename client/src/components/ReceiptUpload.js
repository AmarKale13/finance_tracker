// src/components/ReceiptUpload.jsx
import React, { useState } from 'react';
import { parseReceipt } from '../services/TransactionService';
import './ReceiptUpload.css';

export default function ReceiptUpload({ onDataExtracted }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('receipt', file);
      const res = await parseReceipt(formData);
      // Pass the extracted { date, amount, category, note } back up
      onDataExtracted(res);
    } catch (err) {
      console.error(err);
      alert('Receipt parsing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="receipt-upload-form" onSubmit={handleSubmit}>
        <h3>Upload receipt here!</h3>
      <label className="receipt-chooser">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />
        {file ? file.name : 'Choose image'}
      </label>
      <button type="submit" disabled={loading || !file}>
        {loading ? 'Scanning…' : 'Submit'}
      </button>
    </form>
  );
}
