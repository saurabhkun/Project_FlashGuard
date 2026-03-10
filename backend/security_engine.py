import math

def calculate_distance(lat1, lon1, lat2, lon2):
    # Haversine formula or simple Euclidean for demo
    return math.sqrt((lat1 - lat2)**2 + (lon1 - lon2)**2)

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