import base64
from fastapi import APIRouter, HTTPException, status
import uuid
from datetime import datetime
from app.schemas.transaction import CheckoutRequest, CheckoutResponse
from app.db.session import get_db
from app.db.models import Transaction
import httpx

router = APIRouter()

@router.post(
    "/",
    response_model=CheckoutResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_checkout(request: CheckoutRequest):
    if request.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Amount must be greater than 0"
        )

    db = next(get_db())

    try:
        raw_uuid = uuid.uuid4()
        transaction_id = base64.urlsafe_b64encode(raw_uuid.bytes).rstrip(b'=').decode('ascii')[:16]
        payment_url = f"https://fake.coinbase.com/pay/{transaction_id}"

        # Create transaction in DB with status 'pending'
        db_transaction = Transaction(
            email=request.email,
            amount=request.amount,
            status="pending",
            transaction_id=transaction_id
        )

        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)

        return CheckoutResponse(
            payment_url=payment_url,
            transaction_id=transaction_id
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

__all__ = ["router"]
