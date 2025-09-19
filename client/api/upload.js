import multer from 'multer';
import path from 'path';
import AIParser from './aiParser';
import Transaction from './models/Transaction';
import connectDatabase from './config/database';

connectDatabase();

// Configure multer for memory storage (serverless compatible)
const storage = multer.memoryStorage();

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    // Use multer middleware
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const fileBuffer = req.file.buffer;
      const fileExtension = path.extname(req.file.originalname).slice(1).toLowerCase();

      try {
        // Parse the document with AI using buffer
        const parsedTransactions = await AIParser.parseDocumentFromBuffer(fileBuffer, fileExtension);

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

        res.status(200).json({
          message: 'File uploaded and parsed successfully',
          filename: req.file.originalname,
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
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable body parser for multer
  },
};
