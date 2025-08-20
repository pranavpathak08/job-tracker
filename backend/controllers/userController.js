const { poolPromise, sql } = require('../config/db');

exports.getUserProfile = async (req, res) => {
  const userId = req.user.userId; // Comes from authMiddleware

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT 
          id, name, email, currentlyDoing, about, experience, place, company, createdAt
        FROM Users
        WHERE id = @userId
      `);

    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error('❌ Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error while fetching user profile' });
  }
};
