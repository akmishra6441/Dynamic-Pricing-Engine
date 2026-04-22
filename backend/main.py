from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from models.schemas import PricingRequest, PricingResponse
from services.pricing_engine import calculate_optimal_price
from database.db import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Dynamic Pricing Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/optimize-price", response_model=PricingResponse)
async def optimize_price(req: PricingRequest):
    try:
        result = calculate_optimal_price(
            current_price=req.current_price,
            comp_price=req.competitor_price,
            cost=req.cost_price,
            base_demand=req.historical_sales_volume
        )
        
        return PricingResponse(
            product_id=req.product_id,
            **result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))