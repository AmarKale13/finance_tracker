const express = require('express');
const router = express.Router();
const multer  = require('multer');
const pdfParse = require('pdf-parse');
const auth = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');
const { parseReceiptText } = require('../utils/receiptParser');

// 1. GET all transactions
const upload = multer({ storage: multer.memoryStorage() });

router.post('/parse', upload.single('receipt'), async (req, res) => {
  try {
    const buffer = req.file.buffer;  // image/pdf buffer
    const result = await parseReceiptText(buffer);
    res.json(result);  // { date, amount, category?, note? }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to parse receipt' });
  }
});
// server/routes/transactionRoutes.js
router.post(
  '/upload-pdf',auth,
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      console.warn('No file received in upload-pdf');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const { text = '' } = await pdfParse(req.file.buffer);
      const raw = text.trim();
      if (!raw) {
        console.warn('PDF-parse extracted no text (likely a scan)');
        return res.status(400).json({ error: 'PDF contains no selectable text—please use the “Parse Receipt” option for scanned images' });
      }

      // each non‑empty line should map to exactly 4 parts
      const lines = raw.split('\n').map(l => l.trim()).filter(l => l);
      const docs = [];
      for (let line of lines) {
        if (line.toLowerCase().startsWith('date ')) continue;
        const parts = line.split(/\s+/);
        if (parts.length < 4) {
          console.warn('Skipping malformed line:', line);
          continue;
        }
        // const [dateStr, amountStr, type, category] = parts;
        const [dateStr, amountStr, typeRaw, categoryRaw] = parts;
        const date = new Date(dateStr);
        const amount = parseFloat(amountStr);
        const type = typeRaw.toLowerCase();
        if (!date.getTime() || !amount || !['expense','income'].includes(type)) {
          console.warn('Skipping invalid data line:', rawLine);
          continue;
        }

        docs.push({
          user:     req.user.id,                     // <-- attach user
          date,
          amount,
          type,
          category:
            categoryRaw.charAt(0).toUpperCase() +
            categoryRaw.slice(1).toLowerCase()
        });
      
      }

      if (docs.length === 0) {
        console.warn('No valid transaction lines found in PDF');
        return res.status(400).json({ error: 'No valid transactions found in PDF' });
      }

      const inserted = await Transaction.insertMany(docs);
      return res.json({ insertedCount: inserted.length });

    } catch (err) {
      console.error('Error in /upload-pdf:', err);
      return res.status(500).json({ error: 'Server failed to parse or save PDF transactions' });
    }
  }
);


router.get('/', auth, async (req, res) => {
  const txns = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
  res.json(txns);
});

// 2. POST new transaction
router.post('/', auth, async (req, res) => {
  const { amount, type, category, note, date } = req.body;
  const tx = new Transaction({ user: req.user.id, amount, type, category, note, date });
  const saved = await tx.save();
  res.json(saved);
});

// 3. DELETE transaction
router.delete('/:id', auth, async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Deleted' });
});

module.exports = router;
