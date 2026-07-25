"""Module for sending recognized text queries to the backend API."""

import time
from dataclasses import dataclass
from typing import Any, Dict, Optional
import requests


@dataclass
class APIClientConfig:
    """Configuration settings for APIClient."""

    base_url: str = "http://localhost:8000"
    endpoint = "/analyze"
    timeout: float = 5.0


@dataclass
class APIResponse:
    """Dataclass encapsulating backend API response payload and metadata."""

    success: bool
    status_code: Optional[int]
    data: Optional[Dict[str, Any]]
    processing_time: float
    error: Optional[str]

    def to_dict(self) -> Dict[str, Any]:
        """Converts result object into a standard dictionary.

        Returns:
            Dict[str, Any]: Dictionary representation of APIResponse.
        """
        return {
            "success": self.success,
            "status_code": self.status_code,
            "data": self.data,
            "processing_time": self.processing_time,
            "error": self.error,
        }


class APIClient:
    """Client responsible for communicating with the backend API service."""

    def __init__(self, config: Optional[APIClientConfig] = None) -> None:
        """Initializes the APIClient with configuration options.

        Args:
            config (Optional[APIClientConfig]): API client configuration.
        """
        self.config = config or APIClientConfig()

    def send_message(
        self, text: str, language: str = "en-IN"
    ) -> APIResponse:
        """Sends recognized text query to the backend API endpoint.

        Args:
            text (str): Recognized text query from farmer speech.
            language (str): Target language tag. Defaults to 'en-IN'.

        Returns:
            APIResponse: Result of HTTP API request attempt.
        """
        start_time = time.time()

        if not text or not text.strip():
            processing_time = round(time.time() - start_time, 4)
            return APIResponse(
                success=False,
                status_code=None,
                data=None,
                processing_time=processing_time,
                error="Text payload is empty.",
            )

        url = f"{self.config.base_url.rstrip('/')}{self.config.endpoint}"
        payload = {
            "text": text.strip(),
            "language": language,
        }

        try:
            response = requests.post(
                url, json=payload, timeout=self.config.timeout
            )
            processing_time = round(time.time() - start_time, 4)

            try:
                response_data = response.json()
            except ValueError:
                response_data = None

            if (
                response.status_code == 200
                and isinstance(response_data, dict)
                and response_data.get("success", False)
            ):
                return APIResponse(
                    success=True,
                    status_code=response.status_code,
                    data=response_data,
                    processing_time=processing_time,
                    error=None,
                )

            if (
                response.status_code == 200
                and isinstance(response_data, dict)
                and not response_data.get("success", False)
            ):
                return APIResponse(
                    success=False,
                    status_code=response.status_code,
                    data=response_data,
                    processing_time=processing_time,
                    error=response_data.get(
                        "message",
                        "Backend returned success=False",
                    ),
                )

            error_msg = f"HTTP Error {response.status_code}"
            if isinstance(response_data, dict) and "detail" in response_data:
                error_msg += f": {response_data['detail']}"

            return APIResponse(
                success=False,
                status_code=response.status_code,
                data=response_data,
                processing_time=processing_time,
                error=error_msg,
            )

        except requests.exceptions.Timeout:
            processing_time = round(time.time() - start_time, 4)
            return APIResponse(
                success=False,
                status_code=None,
                data=None,
                processing_time=processing_time,
                error=f"Connection timed out after {self.config.timeout} seconds.",
            )
        except requests.exceptions.ConnectionError:
            processing_time = round(time.time() - start_time, 4)
            return APIResponse(
                success=False,
                status_code=None,
                data=None,
                processing_time=processing_time,
                error=f"Failed to connect to backend server at {url}.",
            )
        except requests.exceptions.RequestException as exc:
            processing_time = round(time.time() - start_time, 4)
            return APIResponse(
                success=False,
                status_code=None,
                data=None,
                processing_time=processing_time,
                error=f"HTTP Request failed: {str(exc)}",
            )
        except Exception as exc:
            processing_time = round(time.time() - start_time, 4)
            return APIResponse(
                success=False,
                status_code=None,
                data=None,
                processing_time=processing_time,
                error=f"Unexpected error during API request: {str(exc)}",
            )


def send_query(
    text: str,
    language: str = "en-IN",
    config: Optional[APIClientConfig] = None,
) -> Dict[str, Any]:
    """Helper function to send a text query to the backend API.

    Args:
        text (str): Input text query.
        language (str): Target language tag. Defaults to 'en-IN'.
        config (Optional[APIClientConfig]): Optional client configuration.

    Returns:
        Dict[str, Any]: Dictionary output of APIResponse.
    """
    client = APIClient(config=config)
    result = client.send_message(text=text, language=language)
    return result.to_dict()
