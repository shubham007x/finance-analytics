# 🤖 AI-Powered Finance Tracker

A full-stack MERN application that uses AI to parse bank statements and provides intelligent financial insights through an intuitive dashboard.
<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/03e6dbee-30d4-492f-b792-a6b0c99f90d0" />
<img width="1917" height="911" alt="image" src="https://github.com/user-attachments/assets/ef442f74-b8db-4918-9f16-8cb506cb3765" />
<img width="1918" height="915" alt="image" src="https://github.com/user-attachments/assets/7a6e5d1c-0724-4e35-a5f5-4dc91dd56716" />






## 🌟 Features

### 📤 **Smart File Upload**
- Drag & drop interface for PDF, CSV, and TXT files
- File validation and size limits (5MB max)
- Support for multiple bank statement formats
- Real-time upload progress and status feedback

### 🧠 **AI-Powered Parsing**
- **Perplexity AI integration** for intelligent transaction extraction
- Automatic transaction categorization (Food, Utilities, Entertainment, etc.)
- Smart merchant name detection
- Income vs. expense classification
- Handles various bank statement formats automatically

### 📊 **Comprehensive Dashboard**
- **Financial Health Metrics**: Savings rate, expense ratio, budget status
- **Summary Cards**: Total income, expenses, net balance, transaction count
- **Interactive Charts**: Pie charts and bar graphs for spending analysis
- **Smart Recommendations**: Personalized financial advice based on spending patterns
- **Real-time Insights**: Daily averages, largest expenses, budget alerts

### 💳 **Transaction Management**
- Complete CRUD operations (Create, Read, Update, Delete)
- Inline editing with form validation
- Sortable columns with advanced filtering
- AI-generated vs. manually-edited indicators
- Bulk transaction processing

### 🎨 **Modern UI/UX**
- **Tailwind CSS** for responsive design
- Smooth animations and micro-interactions
- Mobile-first responsive layout
- Dark/light theme support
- Professional gradient designs

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Beautiful, composable charts
- **Lucide React** - Clean, consistent icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Multer** - File upload middleware
- **PDF-Parse** - PDF text extraction
- **CSV-Parser** - CSV file processing

### AI Integration
- **Perplexity API** - Advanced language model for transaction parsing
- Smart prompt engineering for accurate categorization
- Fallback error handling for parsing failures

## 🚀 Quick Start

### Prerequisites
- Node.js (≥16.0.0)
- MongoDB (local or Atlas)
- Perplexity API key

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/finance-analytics.git
cd finance-tracker
```

### 2. Backend Setup
```bash
cd server
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

### 4. Environment Configuration

Create `server/.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/finance-tracker

# AI Service
PERPLEXITY_API_KEY=your_perplexity_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS (for production)
CORS_ORIGIN=https://your-frontend-domain.com
```

Create `client/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 6. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 📁 Project Structure

```
finance-tracker/
├── client/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/      # Financial overview
│   │   │   ├── FileUpload/     # File upload component
│   │   │   ├── TransactionTable/ # Transaction management
│   │   │   └── Charts/         # Data visualizations
│   │   ├── services/
│   │   │   └── api.js          # API service layer
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Express Backend
│   ├── controllers/            # Request handlers
│   ├── models/
│   │   └── Transaction.js      # MongoDB schema
│   ├── routes/
│   │   ├── transactions.js     # Transaction routes
│   │   └── upload.js           # File upload routes
│   ├── services/
│   │   └── aiService.js        # Perplexity AI integration
│   ├── middleware/             # Custom middleware
│   ├── uploads/                # Temporary file storage
│   ├── server.js               # Main server file
│   └── package.json
├── sample-statements/          # Test data
├── .gitignore
└── README.md
```

## 🔧 API Documentation

### Upload Endpoint
```http
POST /api/upload
Content-Type: multipart/form-data

# Form data
bankStatement: file (PDF/CSV/TXT, max 5MB)
```

### Transaction Endpoints
```http
GET /api/transactions              # Get all transactions
PUT /api/transactions/:id          # Update transaction
DELETE /api/transactions/:id       # Delete transaction
GET /api/transactions/summary      # Get financial summary
```

### Response Examples

**Upload Success:**
```json
{
  "message": "File processed successfully",
  "transactions": [...],
  "count": 25
}
```

**Financial Summary:**
```json
{
  "totalIncome": 5500.00,
  "totalExpenses": 3200.45,
  "netBalance": 2299.55,
  "transactionCount": 25,
  "categoryBreakdown": {
    "food": 650.20,
    "utilities": 245.80,
    "entertainment": 180.50
  }
}
```

## 🧪 Testing

### Sample Bank Statements

The project includes sample bank statements in different formats:

1. **CSV Format** (`sample_statement_1.csv`)
   - Personal banking transactions
   - Income and expense entries
   - Various merchant categories

2. **TXT Format** (`sample_statement_2.txt`)
   - Business banking format
   - Professional services and expenses
   - Equipment and operational costs

3. **Credit Card Format** (`sample_statement_3.txt`)
   - Monthly credit card statement
   - Subscription services and retail purchases
   - Payment and balance information

### How to Test
1. Download sample statements from `/sample-statements/` folder
2. Use the drag-and-drop interface to upload
3. Watch AI parse and categorize transactions
4. Verify results and edit any incorrect categorizations

## 🚀 Deployment

### Environment Setup

**Production Backend (.env.production):**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker
PERPLEXITY_API_KEY=your_production_api_key
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com
```

### Deployment Options

#### 1. **Vercel (Frontend) + Railway (Backend)**

**Frontend:**
```bash
cd client
npm run build
vercel --prod
```

**Backend:**
1. Push to GitHub
2. Connect Railway to repository
3. Set environment variables
4. Deploy automatically

#### 2. **Netlify + Render**

**Frontend (Netlify):**
```bash
cd client
npm run build
netlify deploy --prod --dir=dist
```

**Backend (Render):**
1. Connect GitHub repository
2. Configure environment variables
3. Deploy web service

#### 3. **Heroku (Full Stack)**

```bash
# Backend
cd server
heroku create your-app-api
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set PERPLEXITY_API_KEY=your_api_key
git push heroku main

# Frontend
cd client
# Update API endpoint to Heroku backend
npm run build
# Deploy to Netlify/Vercel
```

## 🔒 Security Features

- **File Validation**: Type and size checking
- **Input Sanitization**: SQL injection prevention
- **CORS Configuration**: Cross-origin request control
- **Environment Variables**: Secure API key storage
- **Error Handling**: Graceful error responses
- **Rate Limiting**: API abuse prevention (configurable)

## 🎯 AI Integration Details

### Perplexity API Implementation
- **Model**: `llama-3.1-sonar-small-128k-online`
- **Temperature**: 0.1 (for consistent parsing)
- **Max Tokens**: 4000
- **Prompt Engineering**: Optimized for financial data extraction

### Transaction Categorization
The AI automatically categorizes transactions into:
- 🍕 **Food**: Restaurants, groceries, coffee shops
- ⚡ **Utilities**: Electric, gas, water, internet bills
- 🎬 **Entertainment**: Movies, streaming, games
- 🚗 **Transport**: Gas, rideshare, public transport
- 🏥 **Healthcare**: Medical, pharmacy, insurance
- 🛒 **Shopping**: Retail, online purchases, equipment
- 💰 **Income**: Salary, freelance, business payments
- 📋 **Other**: Miscellaneous transactions

### Error Handling
- Fallback parsing for unsupported formats
- Manual correction interface for AI errors
- Confidence scoring for transaction accuracy
- User feedback integration for improved parsing

## 🔧 Development

### Adding New Features

1. **Backend Route:**
```javascript
// server/routes/newFeature.js
router.get('/new-endpoint', async (req, res) => {
  // Implementation
});
```

2. **Frontend Component:**
```jsx
// client/src/components/NewFeature.jsx
const NewFeature = () => {
  // Component logic
  return <div>New Feature</div>;
};
```

### Custom Categories
To add new transaction categories:

1. Update the enum in `server/models/Transaction.js`
2. Add category colors in dashboard components
3. Update AI prompts in `server/services/aiService.js`

### Styling Guidelines
- Use Tailwind utility classes
- Follow component naming conventions
- Maintain responsive design principles
- Use CSS custom properties for themes

## 🐛 Troubleshooting

### Common Issues

**1. Proxy 404 Errors**
```bash
# Check Vite config
# Restart both servers
# Verify backend is running on port 5000
```

**2. MongoDB Connection Errors**
```bash
# Check MongoDB service status
# Verify connection string
# Check network connectivity
```

**3. File Upload Failures**
```bash
# Check file size limits
# Verify file formats
# Check upload directory permissions
```

**4. AI Parsing Errors**
```bash
# Verify Perplexity API key
# Check API quota limits
# Review error logs
```

### Debug Mode
Enable debug logging:
```env
DEBUG=true
LOG_LEVEL=debug
```

## 📈 Performance Optimization

- **Frontend**: Code splitting, lazy loading, image optimization
- **Backend**: Database indexing, query optimization, caching
- **AI Calls**: Request batching, response caching, error retry logic
- **File Processing**: Stream processing, memory management

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write comprehensive tests
- Update documentation
- Maintain backward compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- **Perplexity AI** for powerful language model capabilities
- **MongoDB** for flexible document storage
- **Tailwind CSS** for beautiful, responsive designs
- **React Community** for excellent ecosystem
- **Open Source Contributors** for inspiring examples

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/ai-finance-tracker/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-finance-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-finance-tracker/discussions)
- **Email**: your.email@example.com

---

**Built with ❤️ using MERN Stack + AI**

*Transform your financial data into actionable insights with the power of artificial intelligence.*
