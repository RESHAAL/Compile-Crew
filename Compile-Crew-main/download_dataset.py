import kagglehub

path = kagglehub.dataset_download(
    "abdallahalidev/plantvillage-dataset"
)

print("Dataset downloaded successfully!")
print("Dataset path:")
print(path)