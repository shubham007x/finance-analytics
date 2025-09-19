const multer = require('multer');
const path = require('path');
const AIParser = require('../middleware/aiParser');
const Transaction = require('../models/Transaction');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'text/csv', 'text/plain'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, CSV, and TXT files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).slice(1).toLowerCase();
    
    // Parse the document with AI
    const parsedTransactions = await AIParser.parseDocument(filePath, fileExtension);

    // Clear existing transactions to start fresh
    await Transaction.deleteMany({});

    // Save transactions to database
    const savedTransactions = [];
    for (const transactionData of parsedTransactions) {
      try {
        const transaction = new Transaction({
          ...transactionData,
          originalText: `Parsed from ${req.file.originalname}`,
        });
        const saved = await transaction.save();
        savedTransactions.push(saved);
      } catch (error) {
        console.error('Error saving transaction:', error);
      }
    }

    res.json({
      message: 'File uploaded and parsed successfully',
      filename: req.file.filename,
      transactionsFound: savedTransactions.length,
      transactions: savedTransactions,
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Error processing file',
      error: error.message 
    });
  }
};

module.exports = {
  upload,
  uploadFile,
};
