import scipy.optimize as optimize
from .ml_model import predict_demand
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def calculate_optimal_price(current_price: float, comp_price: float, cost: float, base_demand: int) -> dict:
    """
    Core Business Logic: Maximize profit given the demand prediction.
    """
    def objective_function(price_array):
        p = price_array
        demand = predict_demand(p, comp_price, base_demand)
        profit = (p - cost) * demand
        return -profit # Minimize negative profit to find the maximum positive profit

    # Bounds: Do not sell below cost + 5% margin, cap at 2x cost to prevent price gouging
    bounds = [(cost * 1.05, cost * 2.0)]
    initial_guess = [current_price]

    try:
        result = optimize.minimize(
            objective_function, 
            initial_guess, 
            bounds=bounds, 
            method='L-BFGS-B'
        )
        
        optimal_price = result.x
        expected_demand = predict_demand(optimal_price, comp_price, base_demand)
        projected_revenue = optimal_price * expected_demand
        projected_profit = (optimal_price - cost) * expected_demand
        
        return {
            "suggested_price": round(optimal_price, 2),
            "expected_demand": round(expected_demand, 0),
            "projected_revenue": round(projected_revenue, 2),
            "projected_profit": round(projected_profit, 2)
        }
    except Exception as e:
        logger.error(f"Optimization failed: {e}")
        raise ValueError("Failed to calculate optimal price")