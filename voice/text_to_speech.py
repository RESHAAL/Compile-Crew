"""Module for converting backend response text into spoken speech using gTTS."""

import os
import tempfile
import time
from dataclasses import dataclass
from typing import Any, Dict, Optional
from gtts import gTTS

TTS_LANGUAGE_REGISTRY: Dict[str, str] = {
    # English
    "english": "en",
    "en": "en",
    "en-in": "en",
    "en-us": "en",
    # Hindi
    "hindi": "hi",
    "hi": "hi",
    "hi-in": "hi",
    # Marathi
    "marathi": "mr",
    "mr": "mr",
    "mr-in": "mr",
    # Gujarati
    "gujarati": "gu",
    "gu": "gu",
    "gu-in": "gu",
    # Punjabi
    "punjabi": "pa",
    "pa": "pa",
    "pa-in": "pa",
    # Bengali
    "bengali": "bn",
    "bn": "bn",
    "bn-in": "bn",
    # Assamese
    "assamese": "as",
    "as": "as",
    "as-in": "as",
    # Odia
    "odia": "or",
    "or": "or",
    "or-in": "or",
    # Tamil
    "tamil": "ta",
    "ta": "ta",
    "ta-in": "ta",
    # Telugu
    "telugu": "te",
    "te": "te",
    "te-in": "te",
    # Kannada
    "kannada": "kn",
    "kn": "kn",
    "kn-in": "kn",
    # Malayalam
    "malayalam": "ml",
    "ml": "ml",
    "ml-in": "ml",
    # Urdu
    "urdu": "ur",
    "ur": "ur",
    "ur-in": "ur",
    # Nepali
    "nepali": "ne",
    "ne": "ne",
    "ne-in": "ne",
    # Konkani
    "konkani": "kok",
    "kok": "kok",
    "kok-in": "kok",
    # Manipuri
    "manipuri": "mni",
    "mni": "mni",
    "mni-in": "mni",
    # Dogri
    "dogri": "doi",
    "doi": "doi",
    "doi-in": "doi",
    # Kashmiri
    "kashmiri": "ks",
    "ks": "ks",
    "ks-in": "ks",
    # Maithili
    "maithili": "mai",
    "mai": "mai",
    "mai-in": "mai",
    # Sanskrit
    "sanskrit": "sa",
    "sa": "sa",
    "sa-in": "sa",
    # Santali
    "santali": "sat",
    "sat": "sat",
    "sat-in": "sat",
    # Sindhi
    "sindhi": "sd",
    "sd": "sd",
    "sd-in": "sd",
    # Bodo
    "bodo": "brx",
    "brx": "brx",
    "brx-in": "brx",
}


@dataclass
class TTSConfig:
    """Configuration settings for TextToSpeechEngine."""

    default_language: str = "en"
    slow_speech: bool = False
    audio_format: str = "mp3"


@dataclass
class TTSResult:
    """Dataclass encapsulating Text-to-Speech synthesis results."""

    success: bool
    audio_file_path: Optional[str]
    language: str
    processing_time: float
    error: Optional[str]

    def to_dict(self) -> Dict[str, Any]:
        """Converts result object into a standard dictionary.

        Returns:
            Dict[str, Any]: Dictionary representation of TTSResult.
        """
        return {
            "success": self.success,
            "audio_file_path": self.audio_file_path,
            "language": self.language,
            "processing_time": self.processing_time,
            "error": self.error,
        }


class TextToSpeechEngine:
    """Engine responsible for converting response text into speech."""

    def __init__(self, config: Optional[TTSConfig] = None) -> None:
        """Initializes the TextToSpeechEngine with configuration options.

        Args:
            config (Optional[TTSConfig]): Engine configuration dataclass.
        """
        self.config = config or TTSConfig()

    def _resolve_language(self, language: Optional[str]) -> str:
        """Resolves language names, codes, or aliases to a valid ISO 639-1 tag.

        Args:
            language (Optional[str]): Language name, alias, or code.

        Returns:
            str: Valid ISO 639-1 language tag. Defaults to 'en'.
        """
        if not language:
            resolved = self.config.default_language
        else:
            normalized = language.strip().lower()

            if normalized in TTS_LANGUAGE_REGISTRY:
                resolved = TTS_LANGUAGE_REGISTRY[normalized]
            elif normalized in TTS_LANGUAGE_REGISTRY.values():
                resolved = normalized
            else:
                resolved = self.config.default_language

        try:
            from gtts.lang import tts_langs

            supported_langs = tts_langs()

            if resolved not in supported_langs:
                return self.config.default_language
        except Exception:
            pass

        return resolved

    def generate_audio(
        self,
        text: str,
        language: Optional[str] = None,
        output_path: Optional[str] = None,
    ) -> TTSResult:
        """Generates speech audio from text using gTTS.

        Args:
            text (str): Input text to synthesize.
            language (Optional[str]): Target language name, alias, or code.
            output_path (Optional[str]): Optional file path to save audio.

        Returns:
            TTSResult: Result of text-to-speech synthesis attempt.
        """
        start_time = time.time()
        target_language = self._resolve_language(language)

        if not text or not text.strip():
            processing_time = round(time.time() - start_time, 4)
            return TTSResult(
                success=False,
                audio_file_path=None,
                language=target_language,
                processing_time=processing_time,
                error="Text payload is empty.",
            )

        target_file_path: str = ""
        try:
            if output_path:
                target_file_path = output_path
                parent_dir = os.path.dirname(os.path.abspath(target_file_path))
                if parent_dir:
                    os.makedirs(parent_dir, exist_ok=True)
            else:
                with tempfile.NamedTemporaryFile(
                    delete=False, suffix=f".{self.config.audio_format}"
                ) as temp_file:
                    target_file_path = temp_file.name

            tts = gTTS(
                text=text.strip(),
                lang=target_language,
                slow=self.config.slow_speech,
            )
            tts.save(target_file_path)

            processing_time = round(time.time() - start_time, 4)
            return TTSResult(
                success=True,
                audio_file_path=target_file_path,
                language=target_language,
                processing_time=processing_time,
                error=None,
            )

        except ValueError as exc:
            processing_time = round(time.time() - start_time, 4)
            return TTSResult(
                success=False,
                audio_file_path=None,
                language=target_language,
                processing_time=processing_time,
                error=f"Unsupported language for gTTS: {str(exc)}",
            )
        except OSError as exc:
            processing_time = round(time.time() - start_time, 4)
            return TTSResult(
                success=False,
                audio_file_path=None,
                language=target_language,
                processing_time=processing_time,
                error=f"File write error: {str(exc)}",
            )
        except Exception as exc:
            processing_time = round(time.time() - start_time, 4)
            return TTSResult(
                success=False,
                audio_file_path=None,
                language=target_language,
                processing_time=processing_time,
                error=f"Unexpected error during TTS generation: {str(exc)}",
            )


def text_to_speech(
    text: str,
    language: str = "en",
    output_path: Optional[str] = None,
) -> Dict[str, Any]:
    """Helper function to synthesize speech from text into a dictionary result.

    Args:
        text (str): Text content to synthesize.
        language (str): Target language tag or name.
        output_path (Optional[str]): Optional file path to save audio.

    Returns:
        Dict[str, Any]: Dictionary output of TTS synthesis result.
    """
    engine = TextToSpeechEngine()
    result = engine.generate_audio(
        text=text, language=language, output_path=output_path
    )
    return result.to_dict()
