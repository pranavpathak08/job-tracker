const { poolPromise, sql } = require('../config/db');

exports.applyToJob = async (req, res) => {
  const userId = req.user.userId;
  const jobId = parseInt(req.params.jobId);

  try {
    const pool = await poolPromise;

    // Check if job exists
    const jobCheck = await pool.request()
      .input('jobId', sql.Int, jobId)
      .query(`SELECT id FROM Jobs WHERE id = @jobId`);

    if (jobCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user has already applied
    const alreadyApplied = await pool.request()
      .input('userId', sql.Int, userId)
      .input('jobId', sql.Int, jobId)
      .query(`SELECT * FROM Applications WHERE userId = @userId AND jobId = @jobId`);

    if (alreadyApplied.recordset.length > 0) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    //Getting resume file path
    const resumePath = req.file ? req.file.path : null;

    if (!resumePath) {
      return res.status(400).json({ message: "Resume is required."})
    }

    // Insert new application
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('jobId', sql.Int, jobId)
      .input('status', sql.VarChar, 'Applied')
      .input('resumePath', sql.NVarChar, resumePath)
      .query(`INSERT INTO Applications (userId, jobId, status, resumePath) VALUES (@userId, @jobId, @status, @resumePath)`);

    res.status(201).json({ message: 'Application submitted successfully' });

  } catch (err) {
    console.error('❌ Apply Error:', err);
    res.status(500).json({ message: 'Server error while applying' });
  }
};


exports.getMyApplications = async (req, res) => {
    const userId = req.user.userId;
  
    try {
      const pool = await poolPromise;
  
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT 
            a.jobId,
            j.title,
            j.company,
            j.deadline,
            a.status,
            a.appliedAt,
            a.resumePath
          FROM Applications a
          JOIN Jobs j ON a.jobId = j.id
          WHERE a.userId = @userId
          ORDER BY a.appliedAt DESC
        `);
  
      res.status(200).json({ applications: result.recordset });
    } catch (err) {
      console.error('❌ Error fetching applications:', err);
      res.status(500).json({ message: 'Server error while fetching applications' });
    }
  };
  

exports.getApplicantsByJob = async (req, res) => {
  const jobId = parseInt(req.params.jobId);

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('jobId', sql.Int, jobId)
      .query(`
        SELECT 
          a.id AS applicationId,
          a.userId,
          u.name AS applicantName,
          u.email,
          a.status,
          a.appliedAt,
          a.resumePath
        FROM Applications a
        JOIN Users u ON a.userId = u.id
        WHERE a.jobId = @jobId
        ORDER BY a.appliedAt DESC
      `);

    res.status(200).json({ applicants: result.recordset });
  } catch (err) {
    console.error('❌ Error fetching applicants:', err);
    res.status(500).json({ message: 'Server error while fetching applicants' });
  }
};
  

exports.updateApplicationStatus = async (req, res) => {
  const applicationId = parseInt(req.params.applicationId);
  const { status } = req.body;

  // Allowed statuses
  const allowedStatuses = ['Applied', 'Interviewing', 'Offered', 'Rejected'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const pool = await poolPromise;

    // Check if application exists
    const check = await pool.request()
      .input('applicationId', sql.Int, applicationId)
      .query(`SELECT * FROM Applications WHERE id = @applicationId`);

    if (check.recordset.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update status
    await pool.request()
      .input('applicationId', sql.Int, applicationId)
      .input('status', sql.VarChar, status)
      .query(`
        UPDATE Applications 
        SET status = @status 
        WHERE id = @applicationId
      `);

    res.status(200).json({ message: 'Application status updated successfully' });

  } catch (err) {
    console.error('❌ Error updating status:', err);
    res.status(500).json({ message: 'Server error while updating status' });
  }

};