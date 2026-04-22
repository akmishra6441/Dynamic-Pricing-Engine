def predict_demand(price: float, competitor_price: float, base_demand: int) -> float:
    """
    Simulates an ML model (like XGBoost) predicting demand based on price elasticity.
    If our price is lower than the competitor, demand increases. 
    If higher, demand drops exponentially.
    """
    if price <= 0:
        return 0.0
        
    price_ratio = competitor_price / price
    expected_demand = base_demand * (price_ratio ** 1.5) 
    return max(0, expected_demand)