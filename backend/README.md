# Smart Recycle System - Backend

The central API Orchestrator for the Smart Recycle System. This Node.js/Express server handles client requests, uploads, and coordinates with specialized AI microservices for waste classification and recommendation generation.

## 🚀 Technologies

- **Node.js**: Runtime environment
- **Express**: Web framework
- **Multer**: Middleware for handling `multipart/form-data` (file uploads)
- **Axios**: For communicating with AI microservices
- **MongoDB**: Database (configured via Mongoose)
- **Cors**: Cross-Origin Resource Sharing

## ⚙️ Architecture

This backend serves as a gateway that connects the Frontend to two specialized internal services:
1.  **Classification Service** (Running on port `8000`): Analyzes images to detect waste types.
2.  **Recommendation Service** (Running on port `5000`): Provides recycling guides and reuse ideas based on detected labels.

## 📦 Installation

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    - Create a `.env` file in the root of the `backend` folder.
    - Add your port and database config (if applicable):
      ```env
      PORT=4000
      MONGODB_URI=your_mongodb_connection_string
      ```

4.  Start the Server:
    ```bash
    npm run server
    ```
    This runs the server using `nodemon` for development.

## 🔗 API Endpoints

### `POST /api/recycle/analyze`
Accepts image uploads and returns comprehensive analysis.

- **Payload**: `multipart/form-data` with key `images` (array of files).
- **Process**:
    1.  Uploads images.
    2.  Forwards images to **Classification Service** (Port 8000).
    3.  Fetches guides from **Recommendation Service** (Port 5000).
    4.  Aggregates and returns JSON response.

## ⚠️ Prerequisites

For the system to work fully, ensure the separate AI services are running locally on their respective ports (`8000` and `5000`).
