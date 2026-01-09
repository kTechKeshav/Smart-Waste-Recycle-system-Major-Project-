import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model

# Global cached objects
_model = None
_metadata = None


# ----------------------------------------------------
# Load metadata only once
# ----------------------------------------------------
def load_metadata(meta_path="model_meta.json"):
    global _metadata

    if _metadata is None:
        if not os.path.exists(meta_path):
            raise FileNotFoundError(f"Metadata file not found: {meta_path}")

        with open(meta_path, "r") as f:
            _metadata = json.load(f)

    return _metadata


# ----------------------------------------------------
# Load model once (cached)
# ----------------------------------------------------
def load_model_cached():
    global _model

    if _model is None:
        metadata = load_metadata()
        model_file = metadata.get("model_file", "models/model.keras")

        if not os.path.exists(model_file):
            raise FileNotFoundError(f"Model file not found: {model_file}")

        print(f"[INFO] Loading model: {model_file}")
        _model = load_model(model_file)
        print("[INFO] Model loaded successfully.")

    return _model


# ----------------------------------------------------
# Prepare image from raw bytes for MobileNetV2 (224x224)
# ----------------------------------------------------
def prepare_image_bytes(image_bytes):
    """
    Prepare image for prediction directly from file bytes.
    This ALWAYS resizes to (224, 224) because the model
    was trained with this size.
    """

    img = tf.io.decode_image(image_bytes, channels=3)
    img = tf.image.resize(img, (224, 224))  # <-- FIXED (use 224x224 always)
    img = img / 255.0
    img = tf.expand_dims(img, axis=0)

    return img


# ----------------------------------------------------
# Main prediction function used by FastAPI
# ----------------------------------------------------
async def load_model_and_predict(uploaded_file):
    metadata = load_metadata()
    classes = metadata["classes"]

    model = load_model_cached()

    # Read uploaded image bytes
    image_bytes = await uploaded_file.read()

    # Preprocess properly
    img_tensor = prepare_image_bytes(image_bytes)

    # Get predictions
    preds = model.predict(img_tensor, verbose=0)[0]

    # Top 3 classes
    top_indices = preds.argsort()[-3:][::-1]
    top_results = [
        {"label": classes[i], "confidence": float(preds[i])}
        for i in top_indices
    ]

    final_label = classes[top_indices[0]]
    final_confidence = float(preds[top_indices[0]])

    return {
        "prediction": {
            "label": final_label,
            "confidence": final_confidence,
            "top": top_results
        }
    }


# ----------------------------------------------------
# Optional test mode
# ----------------------------------------------------
if __name__ == "__main__":
    print("[INFO] predict_utils.py test mode — FastAPI not running.")
