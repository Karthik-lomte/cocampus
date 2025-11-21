const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';

    // Organize uploads by type
    if (file.fieldname === 'assignment') {
      uploadPath += 'assignments/';
    } else if (file.fieldname === 'certificate') {
      uploadPath += 'certificates/';
    } else if (file.fieldname === 'document') {
      uploadPath += 'documents/';
    } else if (file.fieldname === 'profilePicture') {
      uploadPath += 'profiles/';
    } else if (file.fieldname === 'notice') {
      uploadPath += 'notices/';
    } else {
      uploadPath += 'misc/';
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|txt/;

  // Check extension
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  // Check mime type
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOC, XLS, PPT, ZIP files are allowed'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024 // Default 50MB
  },
  fileFilter: fileFilter
});

// Export upload middleware variants
module.exports = {
  // Single file upload
  uploadSingle: (fieldName) => upload.single(fieldName),

  // Multiple files upload
  uploadMultiple: (fieldName, maxCount = 5) => upload.array(fieldName, maxCount),

  // Multiple fields
  uploadFields: (fields) => upload.fields(fields),

  // Handle upload errors
  handleUploadError: (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: 'error',
          message: 'File too large. Maximum size is 50MB'
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          status: 'error',
          message: 'Too many files'
        });
      }
    }

    if (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }

    next();
  }
};
