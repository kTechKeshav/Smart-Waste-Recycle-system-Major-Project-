import os
import json
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing import image_dataset_from_directory

# Configuration (adjustable at top)
EPOCHS = 30
FINE_TUNE_EPOCHS = 30
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
TRAIN_DIR = 'data/train'
VAL_DIR = 'data/val'
MODEL_DIR = 'models'
MODEL_FILE = 'models/model.keras'

METADATA_FILE = 'model_meta.json'

# Create models directory if it doesn't exist
os.makedirs(MODEL_DIR, exist_ok=True)

print("="*60)
print("SMART RECYCLE - MODEL TRAINING")
print("="*60)

# Load datasets
print("\nLoading datasets...")
train_ds = image_dataset_from_directory(
    TRAIN_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode='categorical',
    shuffle=True,
    seed=42
)

val_ds = image_dataset_from_directory(
    VAL_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode='categorical',
    shuffle=False,
    seed=42
)

# Get class names
class_names = train_ds.class_names
num_classes = len(class_names)

print(f"\nFound {num_classes} classes:")
for i, class_name in enumerate(class_names):
    print(f"  {i}: {class_name}")

print(f"\nTraining samples: {len(train_ds) * BATCH_SIZE}")
print(f"Validation samples: {len(val_ds) * BATCH_SIZE}")

# Data augmentation
print("\nSetting up data augmentation...")
data_augmentation = keras.Sequential([
    layers.RandomFlip('horizontal'),
    layers.RandomRotation(0.2),
    layers.RandomZoom(0.2),
    layers.RandomBrightness(factor=0.2),
])

# Create base model (MobileNetV2)
print("\nCreating MobileNetV2 base model...")
base_model = MobileNetV2(
    input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3),
    include_top=False,
    weights='imagenet'
)

# Freeze base model
print("Freezing base model...")
base_model.trainable = False

# Build model
print("Building model architecture...")
inputs = keras.Input(shape=(IMG_SIZE[0], IMG_SIZE[1], 3))
x = data_augmentation(inputs)
x = base_model(x, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.3)(x)
outputs = layers.Dense(num_classes, activation='softmax')(x)

model = keras.Model(inputs, outputs)

# Compile model
print("Compiling model...")
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-4),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Print model summary
print("\n" + "="*60)
print("MODEL SUMMARY")
print("="*60)
model.summary()

# Train model
print("\n" + "="*60)
print("TRAINING MODEL")
print("="*60)
print(f"Epochs: {EPOCHS}")
print(f"Batch size: {BATCH_SIZE}")
print(f"Image size: {IMG_SIZE}")

history = model.fit(
    train_ds,
    epochs=EPOCHS,
    validation_data=val_ds,
    verbose=1
)

# Save model
print(f"\nSaving model to {MODEL_FILE}...")
model.save(MODEL_FILE)
print("Model saved successfully!")

# Save metadata
metadata = {
    "classes": class_names,
    "img_size": list(IMG_SIZE),
    "model_file": MODEL_FILE
}

print(f"Saving metadata to {METADATA_FILE}...")
with open(METADATA_FILE, 'w') as f:
    json.dump(metadata, f, indent=2)
print("Metadata saved successfully!")

# Print initial training summary
print("\n" + "="*60)
print("INITIAL TRAINING SUMMARY")
print("="*60)
print(f"\nClasses ({num_classes}):")
for i, class_name in enumerate(class_names):
    print(f"  {i}: {class_name}")

print(f"\nFinal Training Accuracy: {history.history['accuracy'][-1]:.4f}")
print(f"Final Validation Accuracy: {history.history['val_accuracy'][-1]:.4f}")
print(f"Final Training Loss: {history.history['loss'][-1]:.4f}")
print(f"Final Validation Loss: {history.history['val_loss'][-1]:.4f}")

# Fine-tuning phase
print("\n" + "="*60)
print("FINE-TUNING PHASE")
print("="*60)

# Unfreeze top 80 layers of the base model
print("\nUnfreezing top 80 layers of MobileNetV2...")
for layer in base_model.layers[-80:]:
    layer.trainable = True

# Re-compile with lower learning rate
print("Re-compiling model with lower learning rate (1e-5)...")
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-5),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Train for additional epochs
print(f"\nFine-tuning for {FINE_TUNE_EPOCHS} additional epochs...")
fine_tune_history = model.fit(
    train_ds,
    epochs=EPOCHS + FINE_TUNE_EPOCHS,
    validation_data=val_ds,
    verbose=1,
    initial_epoch=EPOCHS
)

# Save fine-tuned model
print(f"\nSaving fine-tuned model to {MODEL_FILE}...")
model.save(MODEL_FILE)
print("Fine-tuned model saved successfully!")

# Update metadata (same structure, but model is now fine-tuned)
print(f"Updating metadata to {METADATA_FILE}...")
with open(METADATA_FILE, 'w') as f:
    json.dump(metadata, f, indent=2)
print("Metadata updated successfully!")

# Print fine-tuning summary
print("\n" + "="*60)
print("FINE-TUNING SUMMARY")
print("="*60)
print(f"\nFinal Training Accuracy: {fine_tune_history.history['accuracy'][-1]:.4f}")
print(f"Final Validation Accuracy: {fine_tune_history.history['val_accuracy'][-1]:.4f}")
print(f"Final Training Loss: {fine_tune_history.history['loss'][-1]:.4f}")
print(f"Final Validation Loss: {fine_tune_history.history['val_loss'][-1]:.4f}")

print("\n" + "="*60)
print("Training complete!")
print("="*60)