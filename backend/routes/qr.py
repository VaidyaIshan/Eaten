from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db  
from schemas.qr_schema import QRVerifyRequest
from services.qr_verification import process_qr_verification

router = APIRouter(
    prefix="/qr",
    tags=["QR Verification"]
)

@router.post("/verify")
def verify_qr(request: QRVerifyRequest, db: Session = Depends(get_db)):
    return process_qr_verification(request.qr_string, db)