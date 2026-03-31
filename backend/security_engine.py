import math
from geopy.distance import geodesic

# --- TASK 2: MOCK GLOBAL ANOMALY REGISTRY ---
APP_USERS = {"user_123@upi", "user_456@upi", "trust_dest@upi"}

GLOBAL_ANOMALY_REGISTRY = {
    "suspicious@upi": {"is_new": True, "recent_small_payments_count": 45},
    "fraudster@upi": {"is_new": False, "recent_small_payments_count": 120},
    "new_user@upi": {"is_new": True, "recent_small_payments_count": 2}
}

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculates geographic distance in kilometers using geopy.
    """
    try:
        coord1 = (float(lat1), float(lon1))
        coord2 = (float(lat2), float(lon2))
        return geodesic(coord1, coord2).kilometers
    except Exception as e:
        print(f"Error calculating distance: {e}")
        return 0

def check_security_rules(data):
    """
    Returns True if a hard security rule is broken.
    """
    # Rule 1: Flag 'Remote IP' as high risk
    if data.location == "Remote IP":
        return True
        
    # Rule 2: Flag unrealistic amounts (e.g., negative or zero)
    if data.amount <= 0:
        return True
        
    return False

def calculate_recipient_risk(recipient_id: str) -> int:
    """
    Checks recipient UPI ID against registry to assess risk.
    """
    if recipient_id in APP_USERS: return 0
    
    metadata = GLOBAL_ANOMALY_REGISTRY.get(recipient_id, {"is_new": False, "recent_small_payments_count": 0})
    risk_factor = 0
    
    # Is it a newly created ID?
    if metadata.get("is_new"): 
        risk_factor += 20
        
    # Has it received high-velocity small payments recently?
    if metadata.get("recent_small_payments_count", 0) > 10: 
        risk_factor += 30
        
    return risk_factor