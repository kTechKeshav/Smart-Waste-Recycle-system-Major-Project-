# Smart Recycle System

**Turn Waste into Sustainable Solutions.**

The Smart Recycle System is an AI-powered platform that helps users identify recyclable materials and provides creative DIY reuse ideas. It uses a microservices architecture to process images and generate intelligent recommendations.

## 🏗️ System Architecture

The project consists of three main components:

1.  **Frontend (`/frontend`)**:
    - A React + Vite + Tailwind CSS application.
    - Provides a modern, responsive UI for users to upload waste images.
    - Communicates with the Node.js Backend.

2.  **Backend (`/backend`)**:
    - A Node.js + Express server acting as an **API Gateway**.
    - Handles file uploads and orchestrates calls to AI services.
    - Runs on Port `4000` by default.

3.  **AI Services** (External Dependencies):
    - **Classification Service** (Port `8000`): Identifies waste type from images.
    - **Recommendation Service** (Port `5000`): Generates reuse guides.
    - *Note: These services must be running locally for the full analysis flow to work.*

## 🚀 Getting Started

To run the full application locally, you need to start the Frontend, the Backend, and the AI Services.

### 1. Start the Backend
```bash
cd backend
npm install
npm run server
```
Server will start on `http://localhost:4000`.

### 2. Start the Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend will be accessible via the link provided in the terminal (usually `http://localhost:5173`).

### 3. Start AI Services
*Ensure the Python/AI microservices (not included in this repo structure) are running on ports 8000 and 5000.*

## 🤝 Contribution
1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
