import os

DATASET_PATH = r"C:\Users\Namrata Vaidya\.cache\kagglehub\datasets\abdallahalidev\plantvillage-dataset\versions\3\plantvillage dataset\color"

print("Dataset classes:")

for item in os.listdir(DATASET_PATH):
    print(item)