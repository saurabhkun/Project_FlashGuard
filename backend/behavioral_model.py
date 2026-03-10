def predict_behavior(data, user_history):
    """
    Model B: Behavioral Analysis
    Checks how many times a user has transacted and if they were blocked before.
    Enhanced with per-user behavioral learning
    """
    # 0 history = New User
    if not user_history or len(user_history) == 0:
        return "New User Profile", 0

    # If they were ever BLOCKED in the past (Permanent Blacklist)
    if any(tx.get('status') == 'BLOCKED' for tx in user_history):
        return "Known Fraudulent Pattern", 1

    # If they appear more than 1 time in the current session (Velocity Check)
    if len(user_history) >= 1:
        return "High Velocity Activity", 1

    return "Typical Behavior", 0


def analyze_user_behavior(user_id: str, user_history: list) -> dict:
    """
    Analyze user behavior patterns for better fraud detection
    Returns behavioral profile with insights
    """
    if not user_history or len(user_history) == 0:
        return {
            "user_id": user_id,
            "is_new": True,
            "avg_amount": 0,
            "max_amount": 0,
            "transaction_count": 0,
            "usual_hours": [],
            "usual_locations": [],
            "trust_score": 50  # Default neutral trust score
        }
    
    amounts = [tx.get('amount', 0) for tx in user_history if tx.get('amount')]
    locations = [tx.get('location', '') for tx in user_history if tx.get('location')]
    
    # Calculate trust score based on behavior
    trust_score = 50  # Base score
    
    # Positive factors
    if len(user_history) > 10:
        trust_score += 10  # Established user
    if len(user_history) > 5:
        trust_score += 5
    
    # Calculate usual hours (most common transaction hours)
    hours = [tx.get('hour', 0) for tx in user_history if 'hour' in tx]
    usual_hours = list(set(hours)) if hours else []
    
    return {
        "user_id": user_id,
        "is_new": False,
        "avg_amount": sum(amounts) / len(amounts) if amounts else 0,
        "max_amount": max(amounts) if amounts else 0,
        "min_amount": min(amounts) if amounts else 0,
        "transaction_count": len(user_history),
        "usual_hours": usual_hours,
        "usual_locations": list(set(locations)),
        "trust_score": min(trust_score, 100),
        "fraud_count": len([tx for tx in user_history if tx.get('status') == 'BLOCKED']),
        "safe_count": len([tx for tx in user_history if tx.get('status') == 'SUCCESS'])
    }


def calculate_behavioral_risk(data, user_history: list) -> tuple:
    """
    Calculate additional risk score based on user behavior
    Returns (additional_risk, reason)
    """
    if not user_history or len(user_history) == 0:
        return 0, "New user - no historical data"
    
    additional_risk = 0
    reason = "Normal behavior"
    
    # Check amount deviation from user's normal
    amounts = [tx.get('amount', 0) for tx in user_history if tx.get('amount')]
    if amounts:
        avg_amount = sum(amounts) / len(amounts)
        if data.amount > avg_amount * 5:
            additional_risk += 15
            reason = f"Amount 5x above user's average"
        elif data.amount > avg_amount * 2:
            additional_risk += 5
            reason = f"Amount higher than user's average"
    
    # Check for unusual location
    locations = [tx.get('location', '') for tx in user_history if tx.get('location')]
    if locations and data.location not in locations:
        additional_risk += 10
        reason = "New location for user"
    
    return additional_risk, reason
