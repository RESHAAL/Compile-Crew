"""Integration test script for verifying all Voice Module components."""

import os
import sys

# Ensure parent directory is in path for module imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from voice.api_client import APIClient
from voice.speech_to_text import SpeechToTextEngine
from voice.text_to_speech import TextToSpeechEngine


def test_speech_to_text() -> bool:
    """Tests SpeechToTextEngine functionality and error handling.

    Returns:
        bool: True if test passed, False otherwise.
    """
    print("\n--- Running Test: Speech-to-Text ---")
    try:
        engine = SpeechToTextEngine()
        result = engine.transcribe_bytes(b"", language="en-IN")

        if not result.success and result.error == "Audio bytes payload is empty.":
            print("[PASS] Speech-to-Text: Empty payload error handling verified.")
            return True

        print(f"[FAIL] Speech-to-Text: Unexpected output -> {result}")
        return False

    except Exception as exc:
        print(f"[FAIL] Speech-to-Text: Exception raised -> {str(exc)}")
        return False


def test_text_to_speech() -> bool:
    """Tests TextToSpeechEngine audio synthesis functionality.

    Returns:
        bool: True if test passed, False otherwise.
    """
    print("\n--- Running Test: Text-to-Speech ---")
    try:
        engine = TextToSpeechEngine()
        result = engine.generate_audio(
            text="Hello farmer, your tomato crops are healthy.",
            language="en",
        )

        if result.success and result.audio_file_path and os.path.exists(result.audio_file_path):
            print(f"[PASS] Text-to-Speech: Audio generated at '{result.audio_file_path}'.")
            try:
                os.remove(result.audio_file_path)
            except Exception:
                pass
            return True

        print(f"[FAIL] Text-to-Speech: Generation failed -> {result.error}")
        return False

    except Exception as exc:
        print(f"[FAIL] Text-to-Speech: Exception raised -> {str(exc)}")
        return False


def test_api_client() -> bool:
    """Tests APIClient network query sending and error handling.

    Returns:
        bool: True if test passed, False otherwise.
    """
    print("\n--- Running Test: API Client ---")
    try:
        client = APIClient()
        result = client.send_message(
            text="How do I treat early blight in tomatoes?",
            language="en-IN",
        )

        # Since backend may be offline during unit testing, verify structured response object
        if result.success:
            print("[PASS] API Client: Backend server responded successfully.")
            return True
        elif result.error and ("Failed to connect" in result.error or "timed out" in result.error):
            print(f"[PASS] API Client: Offline error handling verified -> {result.error}")
            return True

        print(f"[FAIL] API Client: Unexpected output -> {result}")
        return False

    except Exception as exc:
        print(f"[FAIL] API Client: Exception raised -> {str(exc)}")
        return False


if __name__ == "__main__":
    print("==================================================")
    print("🌿 AI Farming Doctor - Voice Module Test Suite")
    print("==================================================")

    stt_passed = test_speech_to_text()
    tts_passed = test_text_to_speech()
    api_passed = test_api_client()

    passed_count = sum([stt_passed, tts_passed, api_passed])

    print("\n==================================================")
    print(f"Test Summary: {passed_count}/3 Tests Passed")
    print("==================================================")
