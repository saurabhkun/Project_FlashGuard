def predict_behavior(data, user_history):
    """
    Model B: Behavioral Analysis
    Checks how many times a user has transacted and if they were blocked before.
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