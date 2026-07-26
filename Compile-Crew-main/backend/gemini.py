import os
import google.generativeai as genai
from dotenv import load_dotenv

# ==========================
# Load Environment Variables
# ==========================

load_dotenv()

# ==========================
# Configure Gemini API
# ==========================

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


# ==========================
# Generate AI Report
# ==========================

def generate_report(disease_name: str):

    prompt = f"""
You are an expert agricultural advisor helping Indian farmers.

A plant disease detection AI has identified the following disease:

Disease Name:
{disease_name}

Generate a detailed yet farmer-friendly report.

The report must contain the following sections exactly in this order:

🌿 Disease
Brief explanation of the disease.

🌱 Cause
Explain why this disease occurs.

🔍 Symptoms
Mention the common visible symptoms in bullet points.

💊 Treatment
Give a practical day-wise treatment plan.
Mention commonly available fungicides, pesticides or medicines if applicable.

🛡 Prevention
Explain how farmers can prevent this disease in future.

💰 Estimated Treatment Cost
Give an approximate cost in Indian Rupees.

📉 Crop Loss
Mention what can happen if the disease is ignored.

🌾 Fertilizer Recommendation
Suggest useful fertilizers or nutrients if required.

🚜 Additional Advice
Provide extra farming tips to recover the crop faster.

Rules:
- Keep the language simple.
- Use short paragraphs.
- Use bullet points wherever possible.
- Keep total response below 400 words.
- Focus on practical advice for Indian farmers.
"""

    try:
        response = model.generate_content(prompt)

        return response.text

    except Exception as e:

        return f"""
Unable to generate AI report.

Reason:
{str(e)}

Please try again after some time.
"""