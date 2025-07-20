const express = require('express');
const router = express.Router();
const multer  = require('multer');
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
