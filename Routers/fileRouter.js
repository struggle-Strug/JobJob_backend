const express = require('express');
const multer = require('multer');
const FileCtr = require('../Controllers/fileController/FileCtr');

const router = express.Router();

// Configure multer for file storage
const upload = multer({ dest: './uploads' });

// Route for image upload
router.post('/',  FileCtr.uploadFile);

module.exports = router;
