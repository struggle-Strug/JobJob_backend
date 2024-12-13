const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir); // Directory to save uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage }).single('file');

// Controller function for file upload
exports.uploadFile = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            // Log the error for debugging
            console.error('Upload error:', err);
            return res.status(400).json({ message: 'Error uploading file.', error: err.message }); // Include error message
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Construct the file URL
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        // Return the file URL in the response
        res.status(200).json({ message: 'File uploaded successfully!', fileUrl });
    });
};
