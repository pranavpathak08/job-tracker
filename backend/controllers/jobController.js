const { poolPromise, sql } = require('../config/db');

exports.createJob = async (req, res) => {
  const { title, company, notes, deadline } = req.body;
  const createdBy = req.user.userId;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('title', sql.NVarChar, title)
      .input('company', sql.NVarChar, company)
      .input('notes', sql.Text, notes)
      .input('deadline', sql.Date, deadline)
      .input('createdBy', sql.Int, createdBy)
      .query(`
        INSERT INTO Jobs (title, company, notes, deadline, createdBy)
        VALUES (@title, @company, @notes, @deadline, @createdBy)
      `);

    res.status(201).json({ message: 'Job created successfully' });
  } catch (err) {
    console.error('❌ Job creation error:', err);
    res.status(500).json({ error: 'Server error during job creation' });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .query(`SELECT id, title, company, notes, deadline, createdAt FROM Jobs ORDER BY createdAt DESC`);

    res.status(200).json({ jobs: result.recordset });
  } catch (err) {
    console.error('❌ Error fetching jobs:', err);
    res.status(500).json({ error: 'Server error while fetching jobs' });
  }
};

exports.updateJob = async (req, res) => {
  const jobId = parseInt(req.params.jobId);
  const { title, company, deadline, notes } = req.body;

  try {
    const pool = await poolPromise;

    // Check if job exists
    const check = await pool.request()
      .input('jobId', sql.Int, jobId)
      .query(`SELECT id FROM Jobs WHERE id = @jobId`);

    if (check.recordset.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Update job
    await pool.request()
      .input('jobId', sql.Int, jobId)
      .input('title', sql.NVarChar, title)
      .input('company', sql.NVarChar, company)
      .input('deadline', sql.Date, deadline)
      .input('notes', sql.Text, notes)
      .query(`
        UPDATE Jobs
        SET 
          title = @title,
          company = @company,
          deadline = @deadline,
          notes = @notes
        WHERE id = @jobId
      `);

    res.status(200).json({ message: 'Job updated successfully' });

  } catch (err) {
    console.error('❌ Error updating job:', err);
    res.status(500).json({ message: 'Server error while updating job' });
  }
};


exports.deleteJob = async (req, res) => {
  const jobId = parseInt(req.params.jobId);

  try {
    const pool = await poolPromise;

    // Optional: Check if job exists
    const check = await pool.request()
      .input('jobId', sql.Int, jobId)
      .query(`SELECT id FROM Jobs WHERE id = @jobId`);

    if (check.recordset.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Optional: Check if users have applied (you can skip this if not needed)
    const applied = await pool.request()
      .input('jobId', sql.Int, jobId)
      .query(`SELECT * FROM Applications WHERE jobId = @jobId`);

    if (applied.recordset.length > 0) {
      return res.status(400).json({ message: 'Cannot delete job — users have already applied' });
    }

    // Delete job
    await pool.request()
      .input('jobId', sql.Int, jobId)
      .query(`DELETE FROM Jobs WHERE id = @jobId`);

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting job:', err);
    res.status(500).json({ message: 'Server error while deleting job' });
  }
};

