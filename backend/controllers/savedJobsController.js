const { pool } = require('mssql');
const { poolPromise, sql } = require('../config/db');

//Save a job
exports.saveJob = async (req, res) => {
    const userId = req.user.userId;
    const jobId = parseInt(req.params.jobId);

    try {
        const pool = await poolPromise;

        //Check if job exists
        const jobCheck = await pool.request()
            .input('jobId', sql.Int, jobId)
            .query(`SELECT id FROM Jobs WHERE id = @jobId`);
        
        if (jobCheck.recordset.length === 0) {
            return res.status(404).json({ message: "Job not found" });
        }

        //Check if already saved
        const alreadySaved = await pool.request()
            .input('userId', sql.Int, userId)
            .input('jobId', sql.Int, jobId)
            .query(`SELECT * from SavedJobs WHERE userId = @userId AND jobId = @jobId`);
        
        if (alreadySaved.recordset.length > 0) {
            return res.status(400).json({ message: "Job already saved" });
        }

        //Save the job
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('jobId', sql.Int, jobId)
            .query(`INSERT into SavedJobs (userId, jobId) VALUES (@userId, @jobId)`);
        
        res.status(201).json({ message: "Job saved successfully" });
    } catch (err) {
        console.error("Error in saving job", err);
        res.status(500).json({ message: "Server error while saving job" });
    }
}


//Unsave a job
exports.unsaveJob = async (req, res) => {
    const userId = req.user.userId;
    const jobId = parseInt(req.params.jobId);

    try {
        const pool = await poolPromise;

        const result = pool.request()
            .input('userId', sql.Int, userId)
            .input('jobId', sql.Int, jobId)
            .query(`DELETE FROM SavedJobs WHERE userId = @userId AND jobId = @jobId`);

        res.status(200).json({ message: "Job removed from saved" });
        
    } catch (err) {
        console.error("Unsave job error", err);
        res.status(500).json({ message: "Server error while unsaving job" });
    }
}

//Get all saved jobs for a user
exports.getSavedJobs = async (req, res) => {
    const userId = req.user.userId;
    
    try {
        const pool = await poolPromise;
    
        const result = await pool.request()
          .input('userId', sql.Int, userId)
          .query(`
            SELECT 
              j.id,
              j.title,
              j.company,
              j.notes,
              j.deadline,
              j.createdAt,
              s.savedAt
            FROM SavedJobs s
            JOIN Jobs j ON s.jobId = j.id
            WHERE s.userId = @userId
            ORDER BY s.savedAt DESC
          `);
    
        res.status(200).json({ savedJobs: result.recordset });
    
    } catch (err) {
    console.error('❌ Error fetching saved jobs:', err);
    res.status(500).json({ message: 'Server error while fetching saved jobs' });
    }
}

// Check if a specific job is saved by user
exports.checkIfSaved = async (req, res) => {
    const userId = req.user.userId;
    const jobId = parseInt(req.params.jobId);
  
    try {
        const pool = await poolPromise;
  
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('jobId', sql.Int, jobId)
            .query(`SELECT id FROM SavedJobs WHERE userId = @userId AND jobId = @jobId`);
  
        res.status(200).json({ isSaved: result.recordset.length > 0 });
  
    } catch (err) {
        console.error('❌ Error checking saved status:', err);
        res.status(500).json({ message: 'Server error while checking saved status' });
    }
}