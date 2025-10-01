require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path')
const app = express();
const { poolPromise } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const userRoutes = require('./routes/userRoutes');
// const testRoutes = require('./routes/testRoutes');

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api', applicationRoutes);
app.use('/api', userRoutes);
// app.use('/api/test', testRoutes);

app.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT 1 AS result');
    res.json({ message: 'API Running ✅', dbResult: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ error: 'DB error', details: err.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
