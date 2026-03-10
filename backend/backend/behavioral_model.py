def predict_behavior(data, user_history):
    """
    This is your 'Other Prediction Model'
    It focuses ONLY on the user's history in the dataset.
    """
    if not user_history:
        return "TRUSTED_NEW", 0  # First time user, no red flags yet

    # Behavioral Rule 1: High Frequency (Velocity)
    if len(user_history) > 3:
        return "HIGH_VELOCITY", 1 

    # Behavioral Rule 2: History of Failure
    has_blocked = any(tx['status'] == 'BLOCKED' for tx in user_history)
    if has_blocked:
        return "REPEAT_OFFENDER", 1

    return "CONSISTENT_USER", 0