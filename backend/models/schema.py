from pydantic import BaseModel

class PricingRequest(BaseModel):
    product_id: str
    current_price: float
    competitor_price: float
    cost_price: float
    historical_sales_volume: int

class PricingResponse(BaseModel):
    product_id: str
    suggested_price: float
    expected_demand: float
    projected_revenue: float
    projected_profit: float