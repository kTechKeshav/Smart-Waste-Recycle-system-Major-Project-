import uvicorn
from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from predict_utils import load_model_and_predict

app = FastAPI(
    title="Smart Recycle System",
    description="Waste Classification API using MobileNetV2",
    version="1.0.0"
)

# -----------------------------------------------------
# CORS (Allow frontend to communicate with backend)
# -----------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     # Allow all (safe for local development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------
# Serve static frontend files
# -----------------------------------------------------
app.mount("/static", StaticFiles(directory="static"), name="static")


# -----------------------------------------------------
# Serve index.html at root
# -----------------------------------------------------
@app.get("/")
def serve_home():
    return FileResponse("static/index.html")


# -----------------------------------------------------
# Main prediction route
# -----------------------------------------------------
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accepts an uploaded image and returns the classification result.
    """

    try:
        # DIRECTLY pass file to prediction (NO temp saving)
        result = await load_model_and_predict(file)
        return result
    except Exception as e:
        return {"error": str(e)}


# -----------------------------------------------------
# Run server
# -----------------------------------------------------
if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
