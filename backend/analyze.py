import requests

MODEL_API = "http://10.238.51.182:8001/predict"


def predict_disease(image_file):
    files = {
        "image": image_file
    }

    try:
        response = requests.post(
            MODEL_API,
            files=files,
            timeout=30
        )

        response.raise_for_status()

        data = response.json()

        if not data.get("success", False):
            raise Exception("Prediction API returned failure.")

        return data

    except requests.exceptions.ConnectionError:
        raise Exception(
            "Unable to connect to the AI Prediction Server. Make sure Member 1's FastAPI server is running."
        )

    except requests.exceptions.Timeout:
        raise Exception(
            "Prediction request timed out."
        )

    except requests.exceptions.HTTPError as e:
        raise Exception(
            f"Prediction API HTTP Error: {e}"
        )

    except Exception as e:
        raise Exception(
            f"Prediction Failed: {str(e)}"
        )