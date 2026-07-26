from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.gemini import generate_report
from backend.analyze import predict_disease

app = FastAPI(
    title="AI Farming Doctor API",
    version="1.0.0",
    description="Backend API for AI Farming Doctor Hackathon Project"
)

# ==========================
# CORS Configuration
# ==========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# Request Models
# ==========================

class DiseaseRequest(BaseModel):
    disease: str

# ==========================
# Routes
# ==========================

@app.get("/")
def home():
    return {
        "success": True,
        "message": "AI Farming Doctor Backend Running Successfully 🚀",
        "version": "1.0.0"
    }


@app.get("/health")
def health():
    return {
        "success": True,
        "status": "healthy",
        "backend": "running"
    }


@app.post("/generate-report")
def report(request: DiseaseRequest):

    try:
        report = generate_report(request.disease)

        return {
            "success": True,
            "disease": request.disease,
            "report": report
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.post("/analyze")
async def analyze(image: UploadFile = File(...)):

    try:

        prediction = predict_disease(
            (
                image.filename,
                await image.read(),
                image.content_type
            )
        )

        disease = prediction.get("disease")
        confidence = prediction.get("confidence")

        report = generate_report(disease)

        return {
            "success": True,
            "disease": disease,
            "confidence": confidence,
            "report": report
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
