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


exports.updateUserProfile = async (req, res) => {
  const userId = req.user.userId;
  const { name, currentlyDoing, about, experience, place, company } = req.body;

  try {
    const pool = await poolPromise;

    //Checking if user exists
    const check = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`SELECT id from Users where id = @userId`);
    
    if (check.recordset.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    //Update user profile
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('name', sql.NVarChar, name)
      .input('currentlyDoing', sql.NVarChar, currentlyDoing || '')
      .input('about', sql.Text, about || '')
      .input('experience', sql.Text, experience || '')
      .input('place', sql.NVarChar, place || '')
      .input('company', sql.NVarChar, company || '')
      .query(`
        UPDATE Users
        SET
          name = @name,
          currentlyDoing = @currentlyDoing,
          about = @about,
          experience = @experience,
          place = @place,
          company = @company
        WHERE id = @userId
      `);
    
    res.status(200).json({ message: "Profile Updated Successfully" });
  } catch (err) {
    console.error("Error in updating profile", err);
    res.status(500).json({ message: "Server error while updating user profile" });
  }
}