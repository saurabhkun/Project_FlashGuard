import pandas as pd

def preprocess_features(data):
    """
    Matches the exact feature set used in the high-accuracy training.
    """
    # 1. Calculate the 'Threat Indicator' used in training
    error_balance = data.newbalanceOrig + data.amount - data.oldbalanceOrg
    
    # 2. Build the feature dictionary in the EXACT order the model saw it
    # Note: PaySim models usually expect these specific column names
    features = {
        "amount": data.amount,
        "oldbalanceOrg": data.oldbalanceOrg,
        "newbalanceOrig": data.newbalanceOrig,
        "oldbalanceDest": data.oldbalanceDest,
        "newbalanceDest": data.newbalanceDest,
        "errorBalanceOrig": error_balance,
        # One-hot encoding the types (Setting 0 for all except the current type)
        "type_CASH_OUT": 1 if data.type == "CASH_OUT" else 0,
        "type_DEBIT": 1 if data.type == "DEBIT" else 0,
        "type_PAYMENT": 1 if data.type == "PAYMENT" else 0,
        "type_TRANSFER": 1 if data.type == "TRANSFER" else 0
    }
    
    # Return as a DataFrame (The model expects a 2D structure)
    return pd.DataFrame([features])