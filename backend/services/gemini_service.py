import base64
import io
import json
import logging
from typing import Optional, Dict, Any
from PIL import Image
import requests
from ..config import GEMINI_API_KEY

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.api_key = GEMINI_API_KEY

    def is_live_available(self, override_key: Optional[str] = None) -> bool:
        key = (override_key or self.api_key or "").strip()
        return len(key) > 8

    def generate_json_response(
        self,
        prompt: str,
        image: Optional[Image.Image] = None,
        system_instruction: Optional[str] = None,
        override_key: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Calls Google Gemini 1.5 Flash via official REST API.
        Returns parsed JSON dict or None to trigger domain fallback.
        """
        active_key = (override_key or self.api_key or "").strip()
        if not active_key:
            return None

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={active_key}"

        parts = []
        if image is not None:
            # Resize image if large for fast transfer
            img_copy = image.copy()
            if max(img_copy.size) > 1200:
                img_copy.thumbnail((1200, 1200))
            buffer = io.BytesIO()
            img_copy.save(buffer, format="JPEG", quality=85)
            img_b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
            parts.append({
                "inline_data": {
                    "mime_type": "image/jpeg",
                    "data": img_b64
                }
            })

        parts.append({"text": prompt})

        payload = {
            "contents": [{"parts": parts}],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json"
            }
        }

        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }

        try:
            resp = requests.post(url, json=payload, timeout=25)
            if resp.status_code == 200:
                data = resp.json()
                text_content = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                if text_content.startswith("```json"):
                    text_content = text_content[7:]
                if text_content.startswith("```"):
                    text_content = text_content[3:]
                if text_content.endswith("```"):
                    text_content = text_content[:-3]
                text_content = text_content.strip()
                return json.loads(text_content)
            else:
                logger.warning(f"Gemini API returned status {resp.status_code}: {resp.text}")
                return None
        except Exception as e:
            logger.warning(f"Gemini call exception: {e}")
            return None

gemini_service = GeminiService()
