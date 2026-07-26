"""Module for converting farmer speech into text using SpeechRecognition."""

import os
import tempfile
import time
from dataclasses import dataclass
from typing import Any, Dict, Optional
import speech_recognition as sr

LANGUAGE_REGISTRY: Dict[str, str] = {
    "english": "en-IN",
    "en": "en-IN",
    "en-us": "en-US",
    "en-in": "en-IN",
    "hindi": "hi-IN",
    "hi": "hi-IN",
    "hi-in": "hi-IN",
    "marathi": "mr-IN",
    "mr": "mr-IN",
    "mr-in": "mr-IN",
    "bengali": "bn-IN",
    "bn": "bn-IN",
    "bn-in": "bn-IN",
    "telugu": "te-IN",
    "te": "te-IN",
    "te-in": "te-IN",
    "tamil": "ta-IN",
    "ta": "ta-IN",
    "ta-in": "ta-IN",
    "gujarati": "gu-IN",
    "gu": "gu-IN",
    "gu-in": "gu-IN",
    "kannada": "kn-IN",
    "kn": "kn-IN",
    "kn-in": "kn-IN",
    "malayalam": "ml-IN",
    "ml": "ml-IN",
    "ml-in": "ml-IN",
    "punjabi": "pa-IN",
    "pa": "pa-IN",
    "pa-in": "pa-IN",
    "odia": "or-IN",
    "or": "or-IN",
    "or-in": "or-IN",
    "assamese": "as-IN",
    "as": "as-IN",
    "as-in": "as-IN",
    "urdu": "ur-IN",
    "ur": "ur-IN",
    "ur-in": "ur-IN",
    "nepali": "ne-IN",
    "ne": "ne-IN",
    "ne-in": "ne-IN",
    "konkani": "kok-IN",
    "kok": "kok-IN",
    "kok-in": "kok-IN",
    "manipuri": "mni-IN",
    "mni": "mni-IN",
    "mni-in": "mni-IN",
    "dogri": "doi-IN",
    "doi": "doi-IN",
    "doi-in": "doi-IN",
    "kashmiri": "ks-IN",
    "ks": "ks-IN",
    "ks-in": "ks-IN",
    "maithili": "mai-IN",
    "mai": "mai-IN",
    "mai-in": "mai-IN",
    "sanskrit": "sa-IN",
    "sa": "sa-IN",
    "sa-in": "sa-IN",
    "santali": "sat-IN",
    "sat": "sat-IN",
    "sat-in": "sat-IN",
    "sindhi": "sd-IN",
    "sd": "sd-IN",
    "sd-in": "sd-IN",
    "bodo": "brx-IN",
    "brx": "brx-IN",
    "brx-in": "brx-IN",
}

SUPPORTED_AUDIO_EXTENSIONS = (".wav", ".flac", ".aiff", ".aif")


@dataclass
class STTConfig:
    """Configuration settings for SpeechToTextEngine."""

    default_language: str = "en-IN"
    energy_threshold: int = 300
    dynamic_energy_threshold: bool = True
    ambient_noise_duration: float = 0.3


@dataclass
class STTResult:
    """Dataclass encapsulating Speech-to-Text transcription results."""

    success: bool
    text: str
    language: str
    confidence: Optional[float]
    processing_time: float
    error: Optional[str]

    def to_dict(self) -> Dict[str, Any]:
        """Converts result object into a standard dictionary.

        Returns:
            Dict[str, Any]: Dictionary representation of STTResult.
        """
        return {
            "success": self.success,
            "text": self.text,
            "language": self.language,
            "confidence": self.confidence,
            "processing_time": self.processing_time,
            "error": self.error,
        }


class SpeechToTextEngine:
    """Engine responsible for converting speech audio into text."""

    def __init__(self, config: Optional[STTConfig] = None) -> None:
        """Initializes the SpeechToTextEngine with configuration options.

        Args:
            config (Optional[STTConfig]): Engine configuration dataclass.
        """
        self.config = config or STTConfig()
        self.recognizer = sr.Recognizer()
        self.recognizer.energy_threshold = self.config.energy_threshold
        self.recognizer.dynamic_energy_threshold = (
            self.config.dynamic_energy_threshold
        )

    def _resolve_language(self, language: Optional[str]) -> str:
        """Resolves language names, codes, or aliases to a valid BCP-47 tag.

        Args:
            language (Optional[str]): Language name, alias, or code.

        Returns:
            str: Valid BCP-47 language tag. Defaults to 'en-IN'.
        """
        if not language:
            return self.config.default_language
        normalized = language.strip().lower()
        if normalized in LANGUAGE_REGISTRY:
            return LANGUAGE_REGISTRY[normalized]
        if normalized in LANGUAGE_REGISTRY.values():
            return normalized
        return self.config.default_language

    def transcribe_bytes(
        self, audio_bytes: bytes, language: Optional[str] = None
    ) -> STTResult:
        """Transcribes raw audio bytes into text.

        Args:
            audio_bytes (bytes): Raw audio file binary data.
            language (Optional[str]): Target language name, alias, or code.

        Returns:
            STTResult: Result of speech recognition attempt.
        """
        start_time = time.time()
        target_language = self._resolve_language(language)

        if not audio_bytes:
            processing_time = round(time.time() - start_time, 4)
            return STTResult(
                success=False,
                text="",
                language=target_language,
                confidence=None,
                processing_time=processing_time,
                error="Audio bytes payload is empty.",
            )

        temp_file_path: Optional[str] = None
        try:
            with tempfile.NamedTemporaryFile(
                delete=False, suffix=".wav"
            ) as temp_file:
                temp_file.write(audio_bytes)
                temp_file_path = temp_file.name

            with sr.AudioFile(temp_file_path) as source:
                if self.config.ambient_noise_duration > 0:
                    self.recognizer.adjust_for_ambient_noise(
                        source, duration=self.config.ambient_noise_duration
                    )
                audio_data = self.recognizer.record(source)

            text = self.recognizer.recognize_google(
                audio_data, language=target_language
            )
            processing_time = round(time.time() - start_time, 4)

            return STTResult(
                success=True,
                text=text.strip(),
                language=target_language,
                confidence=None,
                processing_time=processing_time,
                error=None,
            )

        except sr.UnknownValueError:
            processing_time = round(time.time() - start_time, 4)
            return STTResult(
                success=False,
                text="",
                language=target_language,
                confidence=None,
                processing_time=processing_time,
                error="Speech could not be understood.",
            )
        except sr.RequestError as exc:
            processing_time = round(time.time() - start_time, 4)
            return STTResult(
                success=False,
                text="",
                language=target_language,
                confidence=None,
                processing_time=processing_time,
                error=f"Speech recognition service error: {str(exc)}",
            )
        except Exception as exc:
            processing_time = round(time.time() - start_time, 4)
            return STTResult(
                success=False,
                text="",
                language=target_language,
                confidence=None,
                processing_time=processing_time,
                error=f"Unexpected error during transcription: {str(exc)}",
            )
        finally:
            if temp_file_path and os.path.exists(temp_file_path):
                try:
                    os.remove(temp_file_path)
                except Exception:
                    pass

    def transcribe_file(
        self, file_path: str, language: Optional[str] = None
    ) -> STTResult:
        """Transcribes audio from a local file path with format validation.

        Args:
            file_path (str): Path to audio file.
            language (Optional[str]): Target language name, alias, or code.

        Returns:
            STTResult: Result of speech recognition attempt.
        """
        target_language = self._resolve_language(language)

        if not os.path.exists(file_path):
            return STTResult(
                success=False,
                text="",
                language=target_language,
                confidence=None,
                processing_time=0.0,
                error=f"File not found: {file_path}",
            )

        ext = os.path.splitext(file_path)[1].lower()
        if ext not in SUPPORTED_AUDIO_EXTENSIONS:
            return STTResult(
                success=False,
                text="",
                language=target_language,
                confidence=None,
                processing_time=0.0,
                error=(
                    f"Unsupported audio format '{ext}'. "
                    f"Supported formats: {', '.join(SUPPORTED_AUDIO_EXTENSIONS)}"
                ),
            )

        try:
            with open(file_path, "rb") as audio_file:
                audio_bytes = audio_file.read()
            return self.transcribe_bytes(audio_bytes, language=target_language)
        except FileNotFoundError:
            return STTResult(
                success=False,
                text="",
                language=target_language,
                confidence=None,
                processing_time=0.0,
                error=f"File not found: {file_path}",
            )
        except Exception as exc:
            return STTResult(
                success=False,
                text="",
                language=target_language,
                confidence=None,
                processing_time=0.0,
                error=f"Failed to read file: {str(exc)}",
            )


def transcribe_audio(
    audio_bytes: bytes, language: str = "en-IN"
) -> Dict[str, Any]:
    """Helper function to transcribe audio bytes into a dictionary result.

    Args:
        audio_bytes (bytes): Raw audio binary data.
        language (str): Target language tag or name.

    Returns:
        Dict[str, Any]: Dictionary output of transcription result.
    """
    engine = SpeechToTextEngine()
    result = engine.transcribe_bytes(audio_bytes, language=language)
    return result.to_dict()
