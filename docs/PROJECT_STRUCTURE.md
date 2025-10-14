# 📁 Project Structure

This document provides a detailed explanation of the AI-BOM-Converter project structure, including the purpose of each directory and key files.

---

## 🗂️ Root Directory Structure

```
ai-bom-converter/
├── frontend/                 # React frontend application
├── backend/                  # Node.js + Express API server
├── ai-engine/               # Python AI/ML microservice
├── docs/                    # Documentation files
├── .gitignore              # Git ignore rules
├── .env.example            # Environment variables template
├── README.md               # Main project documentation
└── docker-compose.yml      # Docker orchestration (optional)
```

---

## 🎨 Frontend Structure (`/frontend`)

```
frontend/
├── public/                          # Static public assets
│   ├── index.html                   # HTML template
│   ├── favicon.ico                  # Website icon
│   ├── logo192.png                  # App logo
│   └── manifest.json                # PWA manifest
│
├── src/                             # Source code
│   ├── components/                  # Reusable React components
│   │   ├── common/                  # Common UI components
│   │   │   ├── Button.jsx           # Custom button component
│   │   │   ├── Input.jsx            # Input field component
│   │   │   ├── Modal.jsx            # Modal dialog component
│   │   │   ├── Loader.jsx           # Loading spinner
│   │   │   ├── Toast.jsx            # Notification component
│   │   │   └── Table.jsx            # Data table component
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.jsx           # App header/navbar
│   │   │   ├── Footer.jsx           # App footer
│   │   │   ├── Sidebar.jsx          # Sidebar navigation
│   │   │   └── Layout.jsx           # Main layout wrapper
│   │   │
│   │   ├── bom/                     # BOM-specific components
│   │   │   ├── BOMUploader.jsx      # File upload component
│   │   │   ├── BOMTable.jsx         # BOM data table display
│   │   │   ├── BOMPreview.jsx       # eBOM preview component
│   │   │   ├── BOMComparison.jsx    # eBOM vs mBOM comparison
│   │   │   ├── BOMExport.jsx        # Export functionality
│   │   │   └── BOMHistory.jsx       # Conversion history list
│   │   │
│   │   ├── dashboard/               # Dashboard components
│   │   │   ├── StatsCard.jsx        # Statistics card
│   │   │   ├── ConversionChart.jsx  # Conversion analytics chart
│   │   │   └── RecentActivity.jsx   # Recent conversions list
│   │   │
│   │   └── auth/                    # Authentication components
│   │       ├── LoginForm.jsx        # Login form
│   │       ├── RegisterForm.jsx     # Registration form
│   │       └── ProtectedRoute.jsx   # Route protection wrapper
│   │
│   ├── pages/                       # Page components (routes)
│   │   ├── Home.jsx                 # Landing page
│   │   ├── Dashboard.jsx            # User dashboard
│   │   ├── Upload.jsx               # BOM upload page
│   │   ├── Conversion.jsx           # Conversion processing page
│   │   ├── History.jsx              # Conversion history page
│   │   ├── Profile.jsx              # User profile page
│   │   ├── Login.jsx                # Login page
│   │   ├── Register.jsx             # Registration page
│   │   └── NotFound.jsx             # 404 page
│   │
│   ├── services/                    # API service layer
│   │   ├── api.js                   # Axios instance configuration
│   │   ├── bomService.js            # BOM-related API calls
│   │   ├── authService.js           # Authentication API calls
│   │   └── userService.js           # User profile API calls
│   │
│   ├── store/                       # State management (Zustand)
│   │   ├── authStore.js             # Authentication state
│   │   ├── bomStore.js              # BOM data state
│   │   └── uiStore.js               # UI state (modals, toasts)
│   │
│   ├── utils/                       # Utility functions
│   │   ├── constants.js             # App constants
│   │   ├── formatters.js            # Data formatting functions
│   │   ├── validators.js            # Input validation
│   │   ├── fileHandlers.js          # File processing utilities
│   │   └── helpers.js               # General helper functions
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.js               # Authentication hook
│   │   ├── useBOM.js                # BOM operations hook
│   │   └── useDebounce.js           # Debounce hook
│   │
│   ├── styles/                      # Global styles
│   │   ├── index.css                # Global CSS + Tailwind imports
│   │   └── tailwind.config.js       # Tailwind configuration
│   │
│   ├── App.jsx                      # Main App component
│   ├── index.js                     # React entry point
│   └── routes.js                    # Route definitions
│
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
└── .eslintrc.json                   # ESLint configuration
```

### Key Frontend Files Explained

| File | Purpose |
|------|---------|
| **App.jsx** | Root component, contains routing and global providers |
| **services/api.js** | Centralized Axios configuration with interceptors |
| **services/bomService.js** | All BOM-related API endpoints (upload, convert, export) |
| **store/authStore.js** | Global authentication state using Zustand |
| **components/bom/BOMUploader.jsx** | Drag-and-drop file upload with validation |
| **components/bom/BOMTable.jsx** | Interactive table for displaying BOM data |

---

## ⚙️ Backend Structure (`/backend`)

```
backend/
├── routes/                          # API route definitions
│   ├── authRoutes.js                # Authentication routes
│   ├── bomRoutes.js                 # BOM operations routes
│   ├── userRoutes.js                # User management routes
│   └── index.js                     # Route aggregator
│
├── controllers/                     # Request handlers
│   ├── authController.js            # Authentication logic
│   ├── bomController.js             # BOM processing logic
│   └── userController.js            # User operations logic
│
├── models/                          # MongoDB schemas
│   ├── User.js                      # User model
│   ├── BOM.js                       # BOM document model
│   └── Conversion.js                # Conversion history model
│
├── middleware/                      # Custom middleware
│   ├── auth.js                      # JWT authentication middleware
│   ├── errorHandler.js              # Global error handler
│   ├── validateRequest.js           # Request validation middleware
│   ├── uploadMiddleware.js          # File upload configuration
│   └── rateLimiter.js               # Rate limiting middleware
│
├── services/                        # Business logic layer
│   ├── aiService.js                 # Communication with AI engine
│   ├── bomParser.js                 # eBOM file parsing logic
│   ├── bomGenerator.js              # mBOM generation logic
│   └── emailService.js              # Email notifications (optional)
│
├── utils/                           # Utility functions
│   ├── logger.js                    # Winston logger configuration
│   ├── validators.js                # Data validation helpers
│   ├── fileHelpers.js               # File handling utilities
│   ├── dbHelpers.js                 # Database helper functions
│   └── constants.js                 # Application constants
│
├── config/                          # Configuration files
│   ├── database.js                  # MongoDB connection
│   ├── logger.js                    # Logger configuration
│   └── multer.js                    # File upload configuration
│
├── uploads/                         # Uploaded files directory (gitignored)
│   └── .gitkeep                     # Keep directory in git
│
├── logs/                            # Application logs (gitignored)
│   └── .gitkeep
│
├── tests/                           # Test files
│   ├── unit/                        # Unit tests
│   │   ├── bomParser.test.js
│   │   └── validators.test.js
│   ├── integration/                 # Integration tests
│   │   └── bomRoutes.test.js
│   └── setup.js                     # Test setup configuration
│
├── server.js                        # Application entry point
├── app.js                           # Express app configuration
├── package.json                     # Dependencies and scripts
└── .eslintrc.json                   # ESLint configuration
```

### Key Backend Files Explained

| File | Purpose |
|------|---------|
| **server.js** | Entry point - starts the server and connects to database |
| **app.js** | Express configuration - middleware, routes, error handling |
| **routes/bomRoutes.js** | Defines BOM endpoints: upload, convert, export, list, delete |
| **controllers/bomController.js** | Handles BOM business logic, calls AI service |
| **services/aiService.js** | Makes HTTP requests to Python AI engine |
| **models/BOM.js** | MongoDB schema for storing eBOM and mBOM data |
| **middleware/auth.js** | Verifies JWT tokens and protects routes |

---

## 🧠 AI Engine Structure (`/ai-engine`)

```
ai-engine/
├── models/                          # ML models
│   ├── bom_classifier.h5            # TensorFlow model (gitignored)
│   ├── part_embeddings.pkl          # Pre-trained embeddings
│   └── training/                    # Model training scripts
│       ├── train_classifier.py      # Training script
│       └── evaluate_model.py        # Evaluation script
│
├── utils/                           # Utility functions
│   ├── parser.py                    # BOM file parsing utilities
│   ├── preprocessor.py              # Data preprocessing functions
│   ├── postprocessor.py             # Output formatting functions
│   └── validators.py                # Input validation
│
├── services/                        # Service layer
│   ├── langchain_service.py         # LangChain integration
│   ├── tensorflow_service.py        # TensorFlow model inference
│   ├── openai_service.py            # OpenAI API integration
│   └── optimization_service.py      # BOM optimization logic
│
├── routes/                          # Flask routes
│   ├── conversion_routes.py         # Conversion endpoints
│   └── health_routes.py             # Health check endpoints
│
├── config/                          # Configuration
│   ├── settings.py                  # App settings
│   └── prompts.py                   # LLM prompt templates
│
├── tests/                           # Test files
│   ├── test_parser.py               # Parser tests
│   ├── test_conversion.py           # Conversion logic tests
│   └── test_api.py                  # API endpoint tests
│
├── data/                            # Sample data (optional)
│   ├── sample_ebom.csv              # Sample eBOM file
│   └── sample_mbom.csv              # Sample mBOM file
│
├── main.py                          # Flask application entry point
├── requirements.txt                 # Python dependencies
├── Dockerfile                       # Docker configuration
└── .env.example                     # Environment variables template
```

### Key AI Engine Files Explained

| File | Purpose |
|------|---------|
| **main.py** | Flask app initialization, route registration |
| **services/langchain_service.py** | Uses LangChain to structure BOM conversion with LLM |
| **services/tensorflow_service.py** | ML model for part classification and prediction |
| **utils/parser.py** | Parses CSV/Excel files into structured data |
| **config/prompts.py** | Stores prompt templates for LLM interactions |
| **routes/conversion_routes.py** | POST /convert endpoint implementation |

---

## 📚 Documentation Structure (`/docs`)

```
docs/
├── SETUP_GUIDE.md                   # Installation instructions
├── ARCHITECTURE.md                  # System architecture
├── API_DOCUMENTATION.md             # API reference
├── PROJECT_STRUCTURE.md             # This file
├── CONTRIBUTING.md                  # Contribution guidelines
├── CHANGELOG.md                     # Version history
├── PITCH_DECK_OUTLINE.md            # Presentation guide
├── DEMO_SCRIPT.md                   # Demo walkthrough
├── FEATURES_ROADMAP.md              # Feature planning
├── HACKATHON_CHECKLIST.md           # Task checklist
└── images/                          # Documentation images
    ├── architecture.png
    └── flow-diagram.png
```

---

## 🔄 Data Flow Through Structure

### Upload Flow
```
User (Frontend)
    → BOMUploader.jsx
    → bomService.uploadBOM()
    → Backend: POST /api/bom/upload
    → bomController.processBOM()
    → aiService.convertBOM()
    → Python AI Engine: POST /convert
    → TensorFlow + LangChain Processing
    → Return mBOM
    → Save to MongoDB
    → Return to Frontend
    → Display in BOMTable.jsx
```

### File Organization Principles

1. **Separation of Concerns**: Each directory has a single responsibility
2. **Modularity**: Components and services are self-contained
3. **Scalability**: Easy to add new features without restructuring
4. **Maintainability**: Clear naming and organization
5. **Testability**: Test files mirror source structure

---

## 🚀 Getting Started with the Structure

### For Frontend Development
```bash
cd frontend
npm install
npm start
```
Work primarily in `src/components/` and `src/pages/`

### For Backend Development
```bash
cd backend
npm install
npm run dev
```
Work primarily in `routes/`, `controllers/`, and `services/`

### For AI Engine Development
```bash
cd ai-engine
pip install -r requirements.txt
python main.py
```
Work primarily in `services/` and `utils/`

---

## 📝 Notes

- All configuration files should be placed in their respective directories
- Environment-specific files (`.env`) are gitignored
- Uploaded files and logs are gitignored
- ML models are gitignored (too large for git)
- Use `docs/` for all documentation and guides
- Keep the structure consistent across all team members

---

**Last Updated**: October 14, 2025
**Team**: Sarthak
**Project**: AI-BOM-Converter
