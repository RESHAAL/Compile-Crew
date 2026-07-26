import tensorflow as tf
import numpy as np
import json
from PIL import Image

# ==============================
# 1. LOAD TRAINED MODEL
# ==============================

model = tf.keras.models.load_model(
    "ai_model/plant_disease_model.keras"
)

# ==============================
# 2. LOAD CLASS NAMES
# ==============================

with open("ai_model/class_names.json", "r") as f:
    class_names = json.load(f)

# ==============================
# 3. IMAGE PATH
# ==============================

image_path = input("Enter image path: ")

# ==============================
# 4. LOAD AND PREPARE IMAGE
# ==============================

image = Image.open(image_path).convert("RGB")

image = image.resize((160, 160))

image_array = np.array(image)

image_array = image_array / 255.0

image_array = np.expand_dims(image_array, axis=0)

# ==============================
# 5. PREDICT
# ==============================

predictions = model.predict(image_array)

predicted_index = np.argmax(predictions[0])

predicted_class = class_names[predicted_index]

confidence = predictions[0][predicted_index] * 100

# ==============================
# 6. DISPLAY RESULT
# ==============================

print("\n================================")
print("AI FARMING DOCTOR RESULT")
print("================================")

print("Predicted Disease:", predicted_class)

print("Confidence:", round(confidence, 2), "%")

print("================================")