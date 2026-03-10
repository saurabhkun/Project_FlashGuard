# redis_logger.py - SQLite Persistence Version
# This file bridges the API routes to the SQLite database.

from database import (
    log_transaction as db_log_transaction,
    get_history as db_get_history,
    get_all_transactions as db_get_all_transactions,
    get_dashboard_stats as db_get_dashboard_stats,
    get_alerts as db_get_alerts,
    add_alert as db_add_alert,
    clear_history as db_clear_history
)

# --- Standard Interface for API Routes ---

def log_transaction(data, status, risk_score=0, level="LOW", reasons=None):
    """Saves the transaction to SQLite database via database helper"""
    return db_log_transaction(data, status, risk_score, level, reasons)

def get_history():
    """Retrieves all previous transactions from the database"""
    return db_get_history()

def get_all_transactions(limit: int = 100, status_filter: str = None):
    """Get transactions with optional filtering"""
    return db_get_all_transactions(limit, status_filter)

def get_dashboard_stats():
    """Returns aggregated stats (Total Tx, Fraud Count, etc.)"""
    return db_get_dashboard_stats()

def get_alerts(limit: int = 50, severity_filter: str = None):
    """Retrieves system alerts"""
    return db_get_alerts(limit, severity_filter)

def add_alert(alert_type: str, severity: str, message: str, related_user: str = None, metadata: dict = None):
    """Adds a new security alert"""
    return db_add_alert(alert_type, severity, message, related_user, metadata)

def clear_history():
    """Wipes the database history"""
    return db_clear_history()

def get_transactions_by_user(user_id: str):
    """Filter transactions for a specific user ID"""
    transactions = db_get_history()
    return [t for t in transactions if t.get('nameOrig') == user_id]

# --- Chart Formatting Logic ---

def get_chart_data():
    """
    Processes SQLite history into a format suitable for the 
    frontend AreaChart (frequency) and BarChart (spending).
    """
    try:
        # 1. Fetch raw data from SQLite
        history = db_get_history() or []
        
        # 2. Safety check: If no history, return empty structures
        if not history:
            return {"frequency": [], "spending": []}

        # 3. Process Spending Map (for Bar Chart)
        # Groups by 'type' (CASH_OUT, TRANSFER, etc.)
        spending_map = {}
        for tx in history:
            tx_type = tx.get('type', 'Other')
            try:
                amount = float(tx.get('amount', 0))
            except (ValueError, TypeError):
                amount = 0
            
            spending_map[tx_type] = spending_map.get(tx_type, 0) + amount

        formatted_spending = [
            {"category": k, "amount": round(v, 2)} for k, v in spending_map.items()
        ]

        # 4. Prepare Frequency Data (for Area Chart)
        # We take the last 15 transactions to show recent activity
        return {
            "frequency": history[-15:], 
            "spending": formatted_spending
        }
        
    except Exception as e:
        print(f"Error in get_chart_data processing: {e}")
        return {"frequency": [], "spending": []}