const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: `Welcome, ${req.user.name}! You are authenticated.` });
});

router.get('/admin-only', authMiddleware, roleMiddleware('admin'), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.name}!` });
});

module.exports = router;
    