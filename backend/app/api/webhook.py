from fastapi import APIRouter, HTTPException, status, Request
from app.schemas.transaction import WebhookPayload, TransactionResponse
from app.db.session import get_db
from app.db.models import Transaction
from datetime import datetime

router = APIRouter()

@router.post(
    "/",
    response_model=TransactionResponse
)
async def handle_webhook(request: Request, payload: WebhookPayload):
    if not payload.transaction_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing transaction_id"
        )
    
    if not payload.status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing status"
        )
    
    db = next(get_db())
    
    try:
        transaction = db.query(Transaction).filter(
            Transaction.transaction_id == payload.transaction_id
        ).first()
        
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found"
            )
        
        transaction.status = payload.status
        transaction.updated_at = datetime.utcnow()
        
        if payload.email:
            transaction.email = payload.email
        if payload.amount:
            transaction.amount = payload.amount
        
        db.commit()
        db.refresh(transaction)
        
        return transaction
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

__all__ = ["router"]