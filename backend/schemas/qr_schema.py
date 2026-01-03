from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class QRVerifyRequest(BaseModel):
    qr_string: str