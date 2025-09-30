const express = require('express');
const router = express.Router();
const { registerStep1, completeProfile,  login } = require('../controllers/authController');

router.post('/register', registerStep1);
router.put('/complete-profile/:id', completeProfile);
router.post('/login', login);

module.exports = router;
