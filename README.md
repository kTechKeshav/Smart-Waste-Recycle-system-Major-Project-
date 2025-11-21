# Smart Recycle System — Major Project

A compact computer-vision powered web app for sorting recyclable materials (plastic, paper, glass, metal, cardboard, trash). This repository contains the training code, dataset layout, a Keras model, and a lightweight Flask backend that serves predictions for a static frontend.

---

## Key Features

- **Image classification**: Pretrained Keras model (`models/model.keras`) that classifies waste into six categories.
- **Web UI**: Static frontend in `static/` (`index.html`, `script.js`, `style.css`) to upload or capture images and show predictions.
- **Flask API**: Backend server (`backend/app.py`) exposes a `/predict` endpoint for model inference.
- **Training pipeline**: Utilities and training scripts in `backend/` (`train.py`, `split_dataset.py`, `predict_utils.py`).
- **Reproducible dataset layout**: `data/` contains `train/`, `val/`, and `test/` folders organized by class.

---

## Repository Structure

- `backend/` : Flask app, training scripts, model metadata and helper utilities
	- `app.py` — small Flask server to serve predictions
	- `predict_utils.py` — image preprocessing and helper functions
	- `train.py` — training script for model development
	- `split_dataset.py` — utility to split raw images into train/val/test
	- `model_meta.json` — model metadata (labels, preprocessing)
- `models/` : trained model files
	- `model.keras` — exported Keras model used by the backend
- `static/` : frontend files (HTML/CSS/JS)
- `data/` : prepared dataset (`train/`, `val/`, `test/`) with class subfolders
- `data_raw/` : raw images organized by class (source for dataset preparation)
- `Dockerfile` : containerization configuration
- `README.md` : this file

---

## Quick Start (Run Locally)

Prerequisites

- Python 3.8+ and `pip`
- Recommended: virtual environment (venv or conda)

Install dependencies

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

Start the Flask backend (development)

```powershell
cd backend
python app.py
```

Open the frontend

Open `static/index.html` in a browser (or host it via a simple HTTP server). The frontend will call the backend `/predict` endpoint to get predictions.

Example API call (curl)

```powershell
curl -X POST "http://127.0.0.1:5000/predict" -F "file=@path\to\image.jpg"
```

Response (JSON)

```json
{
	"predictions": [
		{"label": "plastic", "probability": 0.92},
		{"label": "paper", "probability": 0.03}
	]
}
```

---

## Model & Metadata

- Primary model: `models/model.keras` (Keras SavedModel/HDF5 — check `backend/model_meta.json` for label order and preprocessing details).
- If you retrain the model, ensure you export with the same input size and preprocessing steps used by `predict_utils.py`.

---

## Training & Dataset

- Use `backend/split_dataset.py` to split images from `data_raw/` into `data/{train,val,test}`.
- Basic training script: `backend/train.py`. Edit parameters inside or expose them as CLI args to experiment.
- Notebook: `backend/notebook.ipynb` contains exploratory work and model analysis.

Tips

- Keep class folders balanced for better performance.
- Use data augmentation in `train.py` if dataset is small.

---

## Docker

There is a `Dockerfile` in the repository root for containerizing the server and frontend. Build and run (example):

```powershell
docker build -t smart-recycle .
docker run -p 5000:8000 smart-recycle
```

---

## Development Notes

- `backend/predict_utils.py` performs preprocessing (resize, scaling) — keep it synced with training preprocessing.
- `backend/model_meta.json` contains the label list and other metadata used at inference.

---

## Contributing

Contributions are welcome.

- Add new data in `data_raw/` and run `split_dataset.py`.
- Train improved models and place them in `models/` with accompanying `model_meta.json` updates.
- Improve the frontend in `static/` or add a simple React/Vue UI if desired.

Please open an issue or submit a pull request.

---

## License

Include or add your preferred license file. If none is present, add `LICENSE` to this repository and update this section.

---

## Contact

Maintainer: Keshav (repository owner `kTechKeshav`). For questions or help, open an issue.

---

Thank you for exploring the Smart Recycle System project — happy recycling!