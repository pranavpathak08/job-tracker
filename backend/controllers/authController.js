const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { poolPromise, sql } = require('../config/db');

exports.registerStep1 = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const pool = await poolPromise;

    const existingUser = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT id FROM Users WHERE email = @email');

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .query(`
        INSERT INTO Users (name, email, password)
        OUTPUT INSERTED.id
        VALUES (@name, @email, @password)
      `);

    const userId = result.recordset[0].id;

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      message: 'User registered. Proceed to complete profile.',
      userId,
      token
    });
  } catch (err) {
    console.error('❌ Registration Error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.completeProfile = async (req, res) => {
  const { currentlyDoing, about, experience, place, company } = req.body;
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .input('currentlyDoing', sql.NVarChar, currentlyDoing || '')
      .input('about', sql.Text, about || '')
      .input('experience', sql.Text, experience || '')
      .input('place', sql.NVarChar, place || '')
      .input('company', sql.NVarChar, company || '')
      .query(`
        UPDATE Users
        SET currentlyDoing = @currentlyDoing,
            about = @about,
            experience = @experience,
            place = @place,
            company = @company
        WHERE id = @id
      `);

    res.status(200).json({ message: 'Profile completed successfully' });
  } catch (err) {
    console.error('❌ Profile Update Error:', err);
    res.status(500).json({ error: 'Server error during profile update' });
  }
};





exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const pool = await poolPromise;
  
      const userQuery = await pool.request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM Users WHERE email = @email');
  
      if (userQuery.recordset.length === 0) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const user = userQuery.recordset[0];
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const payload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '2h'
      });
  
      res.status(200).json({ token, user: payload });
    } catch (err) {
      console.error('❌ Login Error:', err);
      res.status(500).json({ error: 'Server error during login' });
    }
  };
  