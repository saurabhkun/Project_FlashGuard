"""
Alert Management System for FlashGuard Pro
Handles generation and management of security alerts
"""

from datetime import datetime
from typing import List, Dict, Optional
import uuid

# In-memory alert storage
_alerts_db: List[Dict] = []

# Alert types
class AlertType:
    LOGIN_ATTEMPT = "LOGIN_ATTEMPT"
    UNUSUAL_LOCATION = "UNUSUAL_LOCATION"
    HIGH_RISK_TXN = "HIGH_RISK_TXN"
    VELOCITY_ANOMALY = "VELOCITY_ANOMALY"
    DEVICE_CHANGE = "DEVICE_CHANGE"
    ACCOUNT_CREATION = "ACCOUNT_CREATION"
    PASSWORD_CHANGE = "PASSWORD_CHANGE"
    BLOCKED_TXN = "BLOCKED_TXN"

# Alert severities
class AlertSeverity:
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


def create_alert(
    alert_type: str,
    severity: str,
    message: str,
    related_user: Optional[str] = None,
    metadata: Optional[Dict] = None
) -> Dict:
    """Create a new alert"""
    alert = {
        "id": f"ALT-{uuid.uuid4().hex[:8].upper()}",
        "type": alert_type,
        "severity": severity,
        "message": message,
        "timestamp": datetime.now().isoformat(),
        "related_user": related_user,
        "metadata": metadata or {},
        "acknowledged": False
    }
    _alerts_db.append(alert)
    return alert


def get_alerts(
    limit: int = 50,
    severity: Optional[str] = None,
    alert_type: Optional[str] = None,
    acknowledged: Optional[bool] = None
) -> List[Dict]:
    """Get alerts with optional filtering"""
    alerts = _alerts_db.copy()
    
    if severity:
        alerts = [a for a in alerts if a.get('severity') == severity]
    
    if alert_type:
        alerts = [a for a in alerts if a.get('type') == alert_type]
    
    if acknowledged is not None:
        alerts = [a for a in alerts if a.get('acknowledged') == acknowledged]
    
    # Sort by timestamp descending
    alerts = sorted(alerts, key=lambda x: x.get('timestamp', ''), reverse=True)
    
    return alerts[:limit]


def acknowledge_alert(alert_id: str) -> Dict:
    """Acknowledge an alert"""
    for alert in _alerts_db:
        if alert.get('id') == alert_id:
            alert['acknowledged'] = True
            alert['acknowledged_at'] = datetime.now().isoformat()
            return alert
    return {"error": "Alert not found"}


def get_alert_stats() -> Dict:
    """Get alert statistics"""
    total = len(_alerts_db)
    high = len([a for a in _alerts_db if a.get('severity') == 'high'])
    medium = len([a for a in _alerts_db if a.get('severity') == 'medium'])
    low = len([a for a in _alerts_db if a.get('severity') == 'low'])
    unacknowledged = len([a for a in _alerts_db if not a.get('acknowledged')])
    
    return {
        "total": total,
        "high": high,
        "medium": medium,
        "low": low,
        "unacknowledged": unacknowledged
    }


# Convenience functions for common alert scenarios
def alert_login_attempt(user_id: str, success: bool, ip: str, location: str):
    """Create login attempt alert"""
    severity = AlertSeverity.LOW if success else AlertSeverity.MEDIUM
    message = f"Login {'successful' if success else 'failed'} from {location} ({ip})"
    
    return create_alert(
        alert_type=AlertType.LOGIN_ATTEMPT,
        severity=severity,
        message=message,
        related_user=user_id,
        metadata={"ip": ip, "location": location, "success": success}
    )


def alert_unusual_location(user_id: str, previous_location: str, new_location: str):
    """Create unusual location alert"""
    return create_alert(
        alert_type=AlertType.UNUSUAL_LOCATION,
        severity=AlertSeverity.MEDIUM,
        message=f"Unusual location detected: moved from {previous_location} to {new_location}",
        related_user=user_id,
        metadata={"previous_location": previous_location, "new_location": new_location}
    )


def alert_high_risk_transaction(user_id: str, amount: float, risk_score: int, reasons: List[str]):
    """Create high-risk transaction alert"""
    severity = AlertSeverity.HIGH if risk_score > 80 else AlertSeverity.MEDIUM
    return create_alert(
        alert_type=AlertType.HIGH_RISK_TXN,
        severity=severity,
        message=f"High-risk transaction blocked: ₹{amount} (Risk Score: {risk_score})",
        related_user=user_id,
        metadata={"amount": amount, "risk_score": risk_score, "reasons": reasons}
    )


def alert_velocity_anomaly(user_id: str, transaction_count: int, time_window: str):
    """Create velocity anomaly alert"""
    return create_alert(
        alert_type=AlertType.VELOCITY_ANOMALY,
        severity=AlertSeverity.HIGH,
        message=f"High velocity: {transaction_count} transactions in {time_window}",
        related_user=user_id,
        metadata={"transaction_count": transaction_count, "time_window": time_window}
    )

