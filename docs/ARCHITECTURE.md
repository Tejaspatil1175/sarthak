#  Architecture Documentation

Complete system architecture and design documentation for AI-BOM-Converter.

---

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Component Details](#component-details)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [AI/ML Architecture](#aiml-architecture)
- [Security Architecture](#security-architecture)
- [Scalability Considerations](#scalability-considerations)

---

## 🌐 System Overview

AI-BOM-Converter is a three-tier web application that automates the conversion of Engineering Bill of Materials (eBOM) to Manufacturing Bill of Materials (mBOM) using artificial intelligence.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER LAYER                           │
│                    (Web Browser / Mobile)                   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                        │
│              React.js Single Page Application               │
│        (Components, State Management, Routing)              │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API / JSON
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                         │
│               Node.js + Express.js Backend                  │
│     (Authentication, Business Logic, File Handling)         │
└────────┬────────────────────────┬────────────────────────────┘
         │                        │
         │ Mongoose ODM           │ HTTP/REST
         │                        │
         ▼                        ▼
┌──────────────────┐    ┌─────────────────────────────┐
│  DATA LAYER      │    │      AI/ML LAYER            │
│                  │    │                             │
│  MongoDB         │    │  Python Flask Service       │
│  (BOMs, Users,   │    │  (TensorFlow + LangChain)   │
│   Conversions)   │    │                             │
└──────────────────┘    └─────────────────────────────┘
                                  │
                                  │ API Calls
                                  ▼
                        ┌─────────────────────┐
                        │  External Services  │
                        │  (OpenAI, etc.)     │
                        └─────────────────────┘
```

---

##  AI/ML Architecture

### Model Pipeline

```
Input eBOM Data
    ↓
┌──────────────────────┐
│  Data Preprocessing  │
│  - Clean data        │
│  - Normalize format  │
│  - Handle missing    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  Part Classification │
│  (TensorFlow Model)  │
│  - Predict category  │
│  - Assign work center│
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  LLM Processing      │
│  (LangChain)         │
│  - Generate details  │
│  - Map suppliers     │
│  - Calculate costs   │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  Optimization        │
│  - Route planning    │
│  - Cost minimization │
│  - Validation        │
└──────────┬───────────┘
           ↓
    mBOM Output
```

### LangChain Prompt Strategy

```python
# Example Prompt Template
prompt_template = """
You are a manufacturing engineer assistant. Convert the following eBOM to mBOM.

eBOM Data:
{ebom_data}

Instructions:
1. Analyze each part and its hierarchy
2. Determine appropriate work center (Assembly, Machining, Welding, etc.)
3. Assign operation numbers (OP-001, OP-002, etc.)
4. Suggest suitable suppliers based on part type
5. Estimate cost and lead time
6. Maintain parent-child relationships

Output format: JSON array with these fields:
- partNo, description, quantity, workCenter, operation, supplier, cost, leadTime

mBOM:
"""
```

### TensorFlow Model Architecture

```
Input Layer (Feature Vector)
    ↓
Dense Layer (128 units, ReLU)
    ↓
Dropout (0.3)
    ↓
Dense Layer (64 units, ReLU)
    ↓
Dropout (0.2)
    ↓
Dense Layer (32 units, ReLU)
    ↓
Output Layer (N classes, Softmax)
    ↓
Part Category Prediction
```

---

##  Security Architecture

### Authentication & Authorization

**JWT Token Structure**:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "user",
    "iat": 1697452800,
    "exp": 1698057600
  }
}
```

**Security Layers**:

```
┌─────────────────────────────────────┐
│     Client (Browser)                │
│  - HTTPS Only                       │
│  - Token in memory                  │
└────────────┬────────────────────────┘
             │ Encrypted Transport
             ▼
┌─────────────────────────────────────┐
│     API Gateway / Load Balancer     │
│  - SSL/TLS Termination              │
│  - DDoS Protection                  │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│     Backend API                     │
│  - JWT Verification                 │
│  - Rate Limiting                    │
│  - Input Validation                 │
│  - Helmet Security Headers          │
│  - CORS Configuration               │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│     Database                        │
│  - Authentication Required          │
│  - IP Whitelist                     │
│  - Encrypted at Rest                │
└─────────────────────────────────────┘
```

### Security Measures

| Layer | Security Implementation |
|-------|------------------------|
| **Transport** | HTTPS/TLS 1.3, HSTS |
| **Authentication** | JWT with expiry, Bcrypt password hashing |
| **Authorization** | Role-based access control (RBAC) |
| **Input Validation** | Express-validator, sanitization |
| **Rate Limiting** | Express-rate-limit (100 req/15min) |
| **CORS** | Configured whitelist |
| **Headers** | Helmet.js security headers |
| **File Upload** | Type validation, size limits |
| **Database** | MongoDB auth, parameterized queries |
| **Secrets** | Environment variables, never in code |

---

## Scalability Considerations

### Horizontal Scaling Strategy

```
                    Load Balancer
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   Frontend-1       Frontend-2       Frontend-3
   (Vercel)         (Vercel)         (Vercel)
        │                │                │
        └────────────────┼────────────────┘
                         │
                    Load Balancer
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   Backend-1        Backend-2        Backend-3
   (Render)         (Render)         (Render)
        │                │                │
        └────────────────┼────────────────┘
                         │
                    Load Balancer
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   AI-Engine-1      AI-Engine-2      AI-Engine-3
   (Railway)        (Railway)        (Railway)
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
                MongoDB Cluster (Sharded)
```

### Performance Optimizations

#### Frontend
- Code splitting (React.lazy)
- Lazy loading images
- Memoization (React.memo, useMemo)
- Debouncing user inputs
- Service worker for caching
- CDN for static assets

#### Backend
- Connection pooling (MongoDB)
- Response compression (gzip)
- Query optimization (indexes)
- Caching (Redis - optional)
- Async/await for non-blocking I/O
- Clustering (PM2)

#### AI Engine
- Model caching in memory
- Batch processing for multiple BOMs
- Queue system for long-running tasks
- GPU acceleration (if available)
- Response caching for similar inputs

### Scalability Metrics

| Component | Current Capacity | Scaled Capacity |
|-----------|-----------------|-----------------|
| **Frontend** | 1000 concurrent users | 100,000+ (CDN) |
| **Backend** | 50 req/sec | 5000+ req/sec |
| **AI Engine** | 10 conversions/min | 1000+ conversions/min |
| **Database** | 100GB data | Unlimited (sharding) |

---

## Future Architecture Enhancements

### Planned Improvements

1. **Microservices Architecture**
   - Split backend into smaller services
   - Service mesh (Istio)
   - Independent scaling

2. **Message Queue**
   - RabbitMQ/Kafka for async processing
   - Background job processing
   - Event-driven architecture

3. **Caching Layer**
   - Redis for session management
   - Cache frequently converted BOMs
   - API response caching

4. **Real-time Features**
   - WebSocket for live updates
   - Collaborative BOM editing
   - Real-time notifications

5. **Advanced AI**
   - Custom trained models
   - Reinforcement learning for optimization
   - Multi-model ensemble

---

**Last Updated**: October 14, 2025  
**Team**: Sarthak  
**Project**: AI-BOM-Converter  
**Version**: 1.0
