# Enhanced Transaction Logger with Statistics
# NO REDIS REQUIRED - Uses in-memory storage

from datetime import datetime, timedelta
from typing import List, Dict, Optional
import uuid

_mock_storage = []
_alerts = []

def log_transaction(data, status, risk_score=0, level="LOW", reasons=None):
    """
    Saves the transaction to our temporary memory list with full details
    """
    try:
        # Convert the incoming data to a dictionary
        entry = data.dict() if hasattr(data, 'dict') else data.copy()
        entry['status'] = status  # SAFE, SUSPICIOUS, FRAUD
        entry['risk_score'] = risk_score
        entry['level'] = level
        entry['reasons'] = reasons or []
        entry['transaction_id'] = f"TXN-{uuid.uuid4().hex[:8].upper()}"
        entry['timestamp'] = entry.get('timestamp', datetime.now().isoformat())
        
        _mock_storage.append(entry)
        
        # Check if we should generate an alert
        if level == "HIGH":
            _alerts.append({
                "id": f"ALT-{len(_alerts) + 1:05d}",
                "type": "HIGH_RISK_TXN",
                "severity": "high",
                "message": f"High-risk transaction blocked: ₹{entry.get('amount', 0)} from {entry.get('nameOrig', 'Unknown')}",
                "timestamp": datetime.now().isoformat(),
                "related_user": entry.get('nameOrig'),
                "metadata": {
                    "amount": entry.get('amount'),
                    "risk_score": risk_score,
                    "location": entry.get('location')
                }
            })
        
        print(f"💾 Memory Log: User {data.nameOrig if hasattr(data, 'nameOrig') else data.get('nameOrig')} saved. Total history: {len(_mock_storage)}")
    except Exception as e:
        print(f"❌ Error logging to memory: {e}")

def get_history():
    """Retrieves all previous transactions from memory"""
    return _mock_storage

def get_all_transactions(limit: int = 100, status_filter: Optional[str] = None) -> List[Dict]:
    """Get all transactions with optional filtering"""
    transactions = _mock_storage
    
    if status_filter:
        transactions = [t for t in transactions if t.get('status') == status_filter]
    
    # Sort by timestamp descending
    transactions = sorted(transactions, key=lambda x: x.get('timestamp', ''), reverse=True)
    
    return transactions[:limit]

def get_dashboard_stats() -> Dict:
    """Calculate dashboard statistics"""
    transactions = _mock_storage
    
    if not transactions:
        return {
            "total_transactions": 0,
            "fraudulent_count": 0,
            "suspicious_count": 0,
            "safe_count": 0,
            "fraud_detection_rate": 0.0,
            "blocked_today": 0,
            "total_volume": 0.0,
            "average_transaction": 0.0,
            "overall_risk_score": 0,
            "recent_high_risk": []
        }
    
    total = len(transactions)
    fraudulent = len([t for t in transactions if t.get('status') == 'FRAUD'])
    suspicious = len([t for t in transactions if t.get('status') == 'SUSPICIOUS'])
    safe = len([t for t in transactions if t.get('status') == 'SAFE'])
    
    # Calculate today's blocked transactions
    today = datetime.now().date()
    blocked_today = 0
    for t in transactions:
        if t.get('timestamp'):
            try:
                tx_date = datetime.fromisoformat(t['timestamp']).date()
                if tx_date == today and t.get('status') == 'FRAUD':
                    blocked_today += 1
            except:
                pass
    
    # Total volume
    total_volume = sum(t.get('amount', 0) for t in transactions)
    avg_transaction = total_volume / total if total > 0 else 0
    
    # Overall risk score (average of recent transactions)
    recent_risks = [t.get('risk_score', 0) for t in transactions[-100:] if t.get('risk_score')]
    overall_risk = int(sum(recent_risks) / len(recent_risks)) if recent_risks else 0
    
    # Recent high risk transactions
    high_risk = [t for t in transactions if t.get('level') == 'HIGH'][:5]
    recent_high_risk = [
        {
            "id": t.get('transaction_id'),
            "amount": t.get('amount'),
            "location": t.get('location'),
            "risk_score": t.get('risk_score'),
            "timestamp": t.get('timestamp'),
            "nameOrig": t.get('nameOrig')
        }
        for t in high_risk
    ]
    
    return {
        "total_transactions": total,
        "fraudulent_count": fraudulent,
        "suspicious_count": suspicious,
        "safe_count": safe,
        "fraud_detection_rate": round((fraudulent / total * 100), 2) if total > 0 else 0.0,
        "blocked_today": blocked_today,
        "total_volume": round(total_volume, 2),
        "average_transaction": round(avg_transaction, 2),
        "overall_risk_score": overall_risk,
        "recent_high_risk": recent_high_risk
    }

def get_transactions_by_user(user_id: str) -> List[Dict]:
    """Get all transactions for a specific user"""
    return [t for t in _mock_storage if t.get('nameOrig') == user_id]

def get_alerts(limit: int = 50, severity_filter: Optional[str] = None) -> List[Dict]:
    """Get alerts with optional filtering"""
    alerts = _alerts
    
    if severity_filter:
        alerts = [a for a in alerts if a.get('severity') == severity_filter]
    
    # Sort by timestamp descending
    alerts = sorted(alerts, key=lambda x: x.get('timestamp', ''), reverse=True)
    
    return alerts[:limit]

def add_alert(alert_type: str, severity: str, message: str, related_user: Optional[str] = None, metadata: Optional[Dict] = None):
    """Add a new alert"""
    alert = {
        "id": f"ALT-{len(_alerts) + 1:05d}",
        "type": alert_type,
        "severity": severity,
        "message": message,
        "timestamp": datetime.now().isoformat(),
        "related_user": related_user,
        "metadata": metadata or {}
    }
    _alerts.append(alert)
    return alert

def clear_history():
    """Clear all transaction history (for testing)"""
    global _mock_storage, _alerts
    _mock_storage = []
    _alerts = []
    return {"message": "History cleared"}
