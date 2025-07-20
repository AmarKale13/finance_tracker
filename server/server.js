// server.js (at project root)
require('dotenv').config();
const express = require('express');
const connectDB = require('./utils/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(require('cors')());

// Routes (we’ll add these in Step 3)
// app.use('/api/auth', require('./server/routes/authRoutes'));
app.use('/api/test', require('./routes/test'));
// server/server.js
// … existing imports & middleware …
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
