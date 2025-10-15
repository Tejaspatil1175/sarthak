# AI-BOM-Converter

<div align="center">

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Hackathon](https://img.shields.io/badge/hackathon-L&T-blue.svg)
![Tech Stack](https://img.shields.io/badge/stack-MERN%20%2B%20AI-orange.svg)

**An AI-Powered BOM Converter that automates the transformation of eBOM (Engineering BOM) into mBOM (Manufacturing BOM)**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Team](#-team)

</div>

---

##  Problem Statement

In digital manufacturing, converting **eBOM (Engineering Bill of Materials)** to **mBOM (Manufacturing Bill of Materials)** is a critical but time-consuming process. Design engineers create eBOMs with CAD data and part structures, but manufacturing teams need additional details like routing steps, work centers, suppliers, costs, and lead times.

**Manual conversion is:**
-  Time-consuming
-  Error-prone
-  Inefficient for large-scale production

**Our Solution:** AI-BOM-Converter automates this entire process using AI/ML, making it fast, accurate, and intelligent.

---

## What Does It Do?

```
eBOM (Engineering BOM)          →  AI Processing  →  mBOM (Manufacturing BOM)
━━━━━━━━━━━━━━━━━━━━━━━━━━━        ━━━━━━━━━━━━━       ━━━━━━━━━━━━━━━━━━━━━━━━━
Part No | Description | Qty       Smart Analysis      Part No | Work Center | Operation
Engine  | Assembly    | 1         Restructuring        Engine  | Assembly    | OP-001
Piston  | Component   | 4         Add Manufacturing   Piston  | Machining   | OP-002
Bolt    | Fastener    | 16        Details              Bolt    | Fastening   | OP-003
                                  Cost Optimization
```

---

##  Features

### Core Functionality
-  **Upload eBOM** - Support for Excel, CSV, and JSON formats
-  **AI-Powered Conversion** - Intelligent restructuring using TensorFlow + LangChain
-  **Manufacturing Details** - Auto-adds work centers, routing, suppliers, costs
-  **Export mBOM** - Download as Excel, CSV, or JSON
-  **Visual Dashboard** - Track conversions and view history

### AI Capabilities
-  Part-to-process mapping using machine learning
-  Intelligent component classification
-  Cost and lead time prediction
-  Routing optimization
-  Missing component detection

### Additional Features
-  User authentication (JWT)
-  BOM versioning & history
-  Batch processing support
-  Responsive design
-  RESTful API

---

##  Tech Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Multer** - File upload handling
- **JWT** - Authentication

### AI Engine
- **Python 3.9+** - Programming language
- **Flask** - Microservice framework
- **TensorFlow** - Machine learning
- **LangChain** - LLM orchestration
- **Pandas** - Data processing
- **OpenAI API** - Language model

### DevOps
- **MongoDB Atlas** - Cloud database
- **Vercel** - Frontend hosting
- **Render/Railway** - Backend hosting
- **Docker** - Containerization

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- Python 3.9+
- MongoDB (local or Atlas)
- OpenAI API Key (or other LLM provider)

### Installation

```bash
# Clone the repository
git clone https://github.com/sarthak-team/ai-bom-converter.git
cd ai-bom-converter

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install AI engine dependencies
cd ../ai-engine
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Configuration

Create `.env` file in root directory:

```env
# Backend
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bom-converter
JWT_SECRET=your_jwt_secret_key_here
AI_ENGINE_URL=http://localhost:8000

# AI Engine
OPENAI_API_KEY=your_openai_api_key_here
FLASK_PORT=8000

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

```bash
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Start AI Engine
cd ai-engine
python main.py

# Terminal 3: Start Backend
cd backend
npm run dev

# Terminal 4: Start Frontend
cd frontend
npm start
```

Access the application at `http://localhost:3000`

---

## Project Structure

```
ai-bom-converter/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main app component
│   └── package.json
│
├── backend/                  # Node.js + Express API
│   ├── routes/              # API routes
│   ├── controllers/         # Route controllers
│   ├── models/              # MongoDB models
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Helper functions
│   ├── server.js            # Entry point
│   └── package.json
│
├── ai-engine/               # Python AI microservice
│   ├── models/              # ML models
│   ├── utils/               # Helper functions
│   ├── main.py              # Flask app
│   └── requirements.txt
│
├── docs/                    # Documentation
└── .env.example            # Environment template
```

---

## Documentation

- [Setup Guide](docs/SETUP_GUIDE.md) - Detailed installation instructions
- [Architecture](docs/ARCHITECTURE.md) - System design and data flow
- [API Documentation](docs/API_DOCUMENTATION.md) - Complete API reference
- [Project Structure](docs/PROJECT_STRUCTURE.md) - File organization details
- [Contributing](docs/CONTRIBUTING.md) - Contribution guidelines

### For Hackathon
- [Pitch Deck Outline](docs/PITCH_DECK_OUTLINE.md)
- [Demo Script](docs/DEMO_SCRIPT.md)
- [Features Roadmap](docs/FEATURES_ROADMAP.md)
- [Hackathon Checklist](docs/HACKATHON_CHECKLIST.md)

---

## Demo

### Sample Conversion

**Input eBOM:**
| Part No | Description | Qty | Level |
|---------|-------------|-----|-------|
| A101    | Engine      | 1   | 1     |
| B202    | Piston      | 4   | 2     |
| C303    | Bolt        | 16  | 3     |

**Output mBOM:**
| Part No | Description | Qty | Work Center | Operation | Supplier | Cost | Lead Time |
|---------|-------------|-----|-------------|-----------|----------|------|-----------|
| A101    | Engine      | 1   | Assembly    | OP-001    | VendorX  | 5000 | 2 days    |
| B202    | Piston      | 4   | Machining   | OP-002    | VendorY  | 1200 | 1 day     |
| C303    | Bolt        | 16  | Fastening   | OP-003    | VendorZ  | 100  | 1 day     |

---

##  Architecture

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  React Frontend │ (Upload, Display, Export)
└────────┬────────┘
         │ REST API
         ▼
┌─────────────────┐
│ Node.js Backend │ (API, Auth, File Handling)
└────────┬────────┘
         │
         ├────────────────────┐
         ▼                    ▼
┌──────────────────┐   ┌──────────────┐
│ MongoDB Database │   │ Python AI    │
│  (Store BOMs)    │   │   Engine     │
└──────────────────┘   │ (TensorFlow, │
                       │  LangChain)  │
                       └──────────────┘
```

---

##  Team Sarthak

- **Team Name:** Sarthak
- **Project:** AI-BOM-Converter
- **Hackathon:** L&T Digital Manufacturing Challenge

### Team Members
- Member 1 - Full Stack Developer
- Member 2 - AI/ML Engineer
- Member 3 - Frontend Developer
- Member 4 - Backend Developer

---

##  Development Timeline

| Day | Tasks |
|-----|-------|
| **Day 1** | Setup MERN stack, UI for upload  |
| **Day 2** | Build parser + basic conversion  |
| **Day 3** | Integrate AI layer + output mBOM  |
| **Day 4** | Add export + dashboard |
| **Day 5** | Polish UI, prepare demo & presentation  |

---

## API Endpoints

### BOM Operations
```
POST   /api/bom/upload        - Upload eBOM file
GET    /api/bom/:id           - Get converted mBOM
GET    /api/bom/list          - List all conversions
DELETE /api/bom/:id           - Delete BOM
POST   /api/bom/export/:id    - Export mBOM
```

### Authentication
```
POST   /api/auth/register     - Register user
POST   /api/auth/login        - Login user
GET    /api/auth/profile      - Get user profile
```

See [API Documentation](docs/API_DOCUMENTATION.md) for detailed information.

---



---

##  Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel deploy
```

### Backend (Render)
```bash
cd backend
# Push to GitHub
# Connect Render to your repository
```

### AI Engine (Railway/Docker)
```bash
cd ai-engine
docker build -t ai-bom-engine .
docker run -p 8000:8000 ai-bom-engine
```

---

##  Hackathon Evaluation Criteria

 **Industry Relevance** - Solves real manufacturing problem
 **AI Innovation** - Smart use of TensorFlow + LangChain
 **Scalability** - Production-ready architecture
 **UI/UX** - Clean, intuitive interface
 **Demo Quality** - Live conversion demonstration

---

##  Future Enhancements

-  ERP system integration (SAP, Oracle)
-  Advanced ML models for cost prediction
-  Advanced analytics dashboard
-  Multi-language support
-  Mobile application
-  Real-time collaboration features
-  BOM visualization with graphs

---

##  Acknowledgments

- L&T for organizing the Digital Manufacturing Challenge
- OpenAI for providing AI capabilities
- MongoDB Atlas for database hosting
- The open-source community

---