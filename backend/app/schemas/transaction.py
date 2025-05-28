from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional

class CheckoutRequest(BaseModel):
    amount: float = Field(
        ...,
        gt=0,
        example=100.0,
        description="Payment amount in USD (must be greater than 0)"
    )
    email: EmailStr = Field(
        ...,
        example="customer@example.com",
        description="Email address for payment notifications"
    )

class CheckoutResponse(BaseModel):
    payment_url: str = Field(
        ...,
        example="https://fake.coinbase.com/pay/12345",
        description="URL to complete the payment"
    )
    transaction_id: str = Field(
        ...,
        example="txn_12345",
        description="Unique transaction identifier"
    )

class WebhookPayload(BaseModel):
    event_id: str = Field(
        ...,
        example="evt_123",
        description="Unique event identifier"
    )
    transaction_id: str = Field(
        ...,
        example="txn_12345",
        description="Transaction identifier"
    )
    status: str = Field(
        ...,
        example="completed",
        description="Payment status",
        enum=["created", "completed", "failed", "expired"]
    )
    email: Optional[EmailStr] = Field(
        None,
        example="customer@example.com",
        description="Customer email (optional)"
    )
    amount: Optional[float] = Field(
        None,
        example=100.0,
        description="Payment amount in USD (optional)"
    )

class TransactionResponse(BaseModel):
    id: int = Field(..., example=1, description="Database record ID")
    email: str = Field(..., example="customer@example.com", description="Customer email")
    amount: float = Field(..., example=100.0, description="Payment amount")
    status: str = Field(..., example="completed", description="Payment status")
    transaction_id: str = Field(..., example="txn_12345", description="Transaction ID")
    created_at: datetime = Field(..., example="2023-01-01T00:00:00", description="Creation timestamp")
    updated_at: datetime = Field(..., example="2023-01-01T00:00:00", description="Last update timestamp")

    class Config:
        orm_mode = True