const path = require('path')
const multer = require('multer')


//diskStorge() : Returns a StorageEngine implementation configured to store files on the local file system.

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/resumes/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({ storage });
module.exports = upload;