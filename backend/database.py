# SQLite Database Manager for FlashGuard
# Provides persistent storage for transactions and alerts

import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Optional
import os

# Database file path
DB_PATH = os.path.join(os.path.dirname(__file__), 'flashguard.db')

def init_db():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Transactions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transaction_id TEXT UNIQUE,
            step INTEGER,
            type TEXT,
            amount REAL,
            nameOrig TEXT,
            oldbalanceOrg REAL,
            newbalanceOrig REAL,
            nameDest TEXT,
            oldbalanceDest REAL,
            newbalanceDest REAL,
            location TEXT,
            device_id TEXT,
            gps_coords TEXT,
            status TEXT,
            risk_score INTEGER,
            level TEXT,
            reasons TEXT,
            timestamp TEXT,
            is_fraud_label INTEGER DEFAULT 0
        )
    ''')
    
    # Alerts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            alert_id TEXT UNIQUE,
            type TEXT,
            severity TEXT,
            message TEXT,
            timestamp TEXT,
            related_user TEXT,
            metadata TEXT,
            acknowledged INTEGER DEFAULT 0
        )
    ''')
    
    # Feedback table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            feedback_id TEXT UNIQUE,
            transaction_id TEXT,
            user_feedback TEXT,
            feedback_type TEXT,
            comments TEXT,
            timestamp TEXT
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"✅ Database initialized at: {DB_PATH}")

def get_connection():
    """Get a database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def log_transaction(data, status, risk_score=0, level="LOW", reasons=None) -> str:
    """Save transaction to database"""
    import uuid
    
    conn = get_connection()
    cursor = conn.cursor()
    
    # Convert data to dict if it's a Pydantic model
    if hasattr(data, 'dict'):
        data = data.dict()
    elif hasattr(data, 'model_dump'):
        data = data.model_dump()
    
    transaction_id = f"TXN-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.now().isoformat()
    
    try:
        cursor.execute('''
            INSERT INTO transactions (
                transaction_id, step, type, amount, nameOrig, oldbalanceOrg,
                newbalanceOrig, nameDest, oldbalanceDest, newbalanceDest,
                location, device_id, gps_coords, status, risk_score, level,
                reasons, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            transaction_id,
            data.get('step', 1),
            data.get('type', 'TRANSFER'),
            data.get('amount', 0),
            data.get('nameOrig', 'UNKNOWN'),
            data.get('oldbalanceOrg', 0),
            data.get('newbalanceOrig', 0),
            data.get('nameDest', 'UNKNOWN'),
            data.get('oldbalanceDest', 0),
            data.get('newbalanceDest', 0),
            data.get('location', 'Unknown'),
            data.get('device_id', 'Unknown'),
            data.get('gps_coords', '0,0'),
            status,
            risk_score,
            level,
            json.dumps(reasons or []),
            timestamp
        ))
        
        conn.commit()
        print(f"💾 DB Log: Transaction {transaction_id} saved. Status: {status}")
        
    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
        conn.rollback()
    finally:
        conn.close()
    
    return transaction_id

def get_history() -> List[Dict]:
    """Retrieve all transactions from database"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM transactions ORDER BY timestamp DESC')
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

def get_all_transactions(limit: int = 100, status_filter: Optional[str] = None) -> List[Dict]:
    """Get transactions with optional filtering"""
    conn = get_connection()
    cursor = conn.cursor()
    
    if status_filter:
        cursor.execute(
            'SELECT * FROM transactions WHERE status = ? ORDER BY timestamp DESC LIMIT ?',
            (status_filter, limit)
        )
    else:
        cursor.execute(
            'SELECT * FROM transactions ORDER BY timestamp DESC LIMIT ?',
            (limit,)
        )
    
    rows = cursor.fetchall()
    conn.close()
    
    transactions = []
    for row in rows:
        txn = dict(row)
        # Parse reasons JSON
        if txn.get('reasons'):
            try:
                txn['reasons'] = json.loads(txn['reasons'])
            except:
                txn['reasons'] = []
        transactions.append(txn)
    
    return transactions

def get_dashboard_stats() -> Dict:
    """Calculate dashboard statistics from database"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Get total count
    cursor.execute('SELECT COUNT(*) as total FROM transactions')
    total = cursor.fetchone()['total']
    
    if total == 0:
        conn.close()
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
    
    # Get counts by status
    cursor.execute("SELECT COUNT(*) as count FROM transactions WHERE status = 'FRAUD'")
    fraudulent = cursor.fetchone()['count']
    
    cursor.execute("SELECT COUNT(*) as count FROM transactions WHERE status = 'SUSPICIOUS'")
    suspicious = cursor.fetchone()['count']
    
    cursor.execute("SELECT COUNT(*) as count FROM transactions WHERE status = 'SAFE'")
    safe = cursor.fetchone()['count']
    
    # Get today's blocked count
    today = datetime.now().date().isoformat()
    cursor.execute(
        "SELECT COUNT(*) as count FROM transactions WHERE status = 'FRAUD' AND timestamp LIKE ?",
        (f"{today}%",)
    )
    blocked_today = cursor.fetchone()['count']
    
    # Get total volume
    cursor.execute('SELECT SUM(amount) as total FROM transactions')
    total_volume = cursor.fetchone()['total'] or 0
    
    # Get average transaction
    avg_transaction = total_volume / total if total > 0 else 0
    
    # Get overall risk score (average of recent 100)
    cursor.execute('SELECT AVG(risk_score) as avg_risk FROM (SELECT risk_score FROM transactions ORDER BY timestamp DESC LIMIT 100)')
    overall_risk = int(cursor.fetchone()['avg_risk'] or 0)
    
    # Get recent high risk transactions
    cursor.execute(
        "SELECT transaction_id, amount, location, risk_score, timestamp, nameOrig FROM transactions WHERE level = 'HIGH' ORDER BY timestamp DESC LIMIT 5"
    )
    high_risk_rows = cursor.fetchall()
    
    recent_high_risk = []
    for row in high_risk_rows:
        recent_high_risk.append({
            "id": row['transaction_id'],
            "amount": row['amount'],
            "location": row['location'],
            "risk_score": row['risk_score'],
            "timestamp": row['timestamp'],
            "nameOrig": row['nameOrig']
        })
    
    conn.close()
    
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

def add_alert(alert_type: str, severity: str, message: str, related_user: Optional[str] = None, metadata: Optional[Dict] = None) -> Dict:
    """Add a new alert to database"""
    import uuid
    
    conn = get_connection()
    cursor = conn.cursor()
    
    alert_id = f"ALT-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.now().isoformat()
    
    cursor.execute('''
        INSERT INTO alerts (alert_id, type, severity, message, timestamp, related_user, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (alert_id, alert_type, severity, message, timestamp, related_user, json.dumps(metadata or {})))
    
    conn.commit()
    conn.close()
    
    return {
        "id": alert_id,
        "type": alert_type,
        "severity": severity,
        "message": message,
        "timestamp": timestamp,
        "related_user": related_user
    }

def get_alerts(limit: int = 50, severity_filter: Optional[str] = None) -> List[Dict]:
    """Get alerts with optional filtering"""
    conn = get_connection()
    cursor = conn.cursor()
    
    if severity_filter:
        cursor.execute(
            'SELECT * FROM alerts WHERE severity = ? ORDER BY timestamp DESC LIMIT ?',
            (severity_filter, limit)
        )
    else:
        cursor.execute(
            'SELECT * FROM alerts ORDER BY timestamp DESC LIMIT ?',
            (limit,)
        )
    
    rows = cursor.fetchall()
    conn.close()
    
    alerts = []
    for row in rows:
        alert = dict(row)
        if alert.get('metadata'):
            try:
                alert['metadata'] = json.loads(alert['metadata'])
            except:
                pass
        alerts.append(alert)
    
    return alerts

def clear_history() -> Dict:
    """Clear all transaction history"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM transactions')
    cursor.execute('DELETE FROM alerts')
    
    conn.commit()
    conn.close()
    
    return {"message": "History cleared"}

def get_chart_data() -> Dict:
    """Get data formatted for dashboard charts"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Get transactions ordered by timestamp
    cursor.execute('SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 200')
    rows = cursor.fetchall()
    conn.close()
    
    if not rows:
        return {
            "transaction_trends": [],
            "transactions_by_type": [],
            "risk_trend": []
        }
    
    transactions = [dict(row) for row in rows]
    
    # 1. Transaction Trends (group by hour)
    hourly_data = {}
    for txn in transactions:
        try:
            timestamp = txn.get('timestamp', '')
            # Extract hour from timestamp (format: 2024-01-15T10:30:00)
            hour = timestamp[:13] if len(timestamp) >= 13 else 'Unknown'
            if hour not in hourly_data:
                hourly_data[hour] = {"hour": hour, "count": 0, "total_amount": 0}
            hourly_data[hour]["count"] += 1
            hourly_data[hour]["total_amount"] += txn.get('amount', 0)
        except:
            pass
    
    transaction_trends = sorted(hourly_data.values(), key=lambda x: x['hour'])[:24]
    
    # 2. Transactions by Type
    type_data = {}
    for txn in transactions:
        txn_type = txn.get('type', 'Other')
        if txn_type not in type_data:
            type_data[txn_type] = {"type": txn_type, "count": 0, "amount": 0}
        type_data[txn_type]["count"] += 1
        type_data[txn_type]["amount"] += txn.get('amount', 0)
    
    transactions_by_type = list(type_data.values())
    
    # 3. Risk Trend (group by hour with average risk score)
    risk_data = {}
    for txn in transactions:
        try:
            timestamp = txn.get('timestamp', '')
            hour = timestamp[:13] if len(timestamp) >= 13 else 'Unknown'
            risk_score = txn.get('risk_score', 0)
            if hour not in risk_data:
                risk_data[hour] = {"hour": hour, "avg_risk": 0, "count": 0}
            risk_data[hour]["avg_risk"] += risk_score
            risk_data[hour]["count"] += 1
        except:
            pass
    
    # Calculate averages
    for hour in risk_data:
        if risk_data[hour]["count"] > 0:
            risk_data[hour]["avg_risk"] = round(risk_data[hour]["avg_risk"] / risk_data[hour]["count"], 1)
    
    risk_trend = sorted(risk_data.values(), key=lambda x: x['hour'])[:24]
    
    return {
        "transaction_trends": transaction_trends,
        "transactions_by_type": transactions_by_type,
        "risk_trend": risk_trend
    }

# Initialize database on module import
init_db()

