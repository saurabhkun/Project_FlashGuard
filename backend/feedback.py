"""
Feedback Learning System for FlashGuard Pro
Allows users to provide feedback on transactions (false positive/negative learning)
The AI learns from feedback to improve future predictions
"""

import os
import json
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path

# Feedback storage file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FEEDBACK_FILE = os.path.join(BASE_DIR, "feedback_data.json")

# In-memory feedback store (would be database in production)
feedback_store: List[dict] = []
learned_patterns: Dict[str, dict] = {}

def load_feedback_data():
    """Load feedback data from file if exists"""
    global feedback_store, learned_patterns
    try:
        if os.path.exists(FEEDBACK_FILE):
            with open(FEEDBACK_FILE, 'r') as f:
                data = json.load(f)
                feedback_store = data.get('feedback', [])
                learned_patterns = data.get('patterns', {})
    except Exception as e:
        print(f"Error loading feedback data: {e}")

def save_feedback_data():
    """Save feedback data to file"""
    try:
        with open(FEEDBACK_FILE, 'w') as f:
            json.dump({
                'feedback': feedback_store,
                'patterns': learned_patterns
            }, f, indent=2, default=str)
    except Exception as e:
        print(f"Error saving feedback data: {e}")

def submit_feedback(transaction_id: str, user_feedback: str, feedback_type: str, 
                    comments: Optional[str] = None, user_id: Optional[str] = None) -> dict:
    """
    Submit feedback for a transaction
    - transaction_id: The ID of the transaction
    - user_feedback: "GENUINE" or "FRAUD" 
    - feedback_type: "false_positive" (blocked but was genuine) or "false_negative" (got through but was fraud)
    - comments: Optional user comments
    """
    feedback_entry = {
        "id": f"FB-{len(feedback_store) + 1:05d}",
        "transaction_id": transaction_id,
        "user_feedback": user_feedback.upper(),
        "feedback_type": feedback_type.lower(),
        "comments": comments,
        "user_id": user_id,
        "timestamp": datetime.now().isoformat(),
        "processed": False
    }
    
    feedback_store.append(feedback_entry)
    
    # Learn from this feedback
    learn_from_feedback(feedback_entry)
    
    # Save to file
    save_feedback_data()
    
    return {
        "success": True,
        "message": f"Feedback submitted successfully. AI will learn from this feedback",
        "feedback_id": feedback_entry["id"]
    }

def learn_from_feedback(feedback: dict):
    """Update learned patterns based on feedback"""
    feedback_type = feedback['feedback_type']
    
    # Extract key patterns to learn
    if feedback_type == "false_positive":
        # Transaction was blocked but was actually genuine
        # Learn to be less strict in similar situations
        pattern_key = "reduce_strictness"
        if pattern_key not in learned_patterns:
            learned_patterns[pattern_key] = {"count": 0, "learned_factors": []}
        learned_patterns[pattern_key]["count"] += 1
        
    elif feedback_type == "false_negative":
        # Transaction got through but was actually fraud
        # Learn to be more strict in similar situations
        pattern_key = "increase_strictness"
        if pattern_key not in learned_patterns:
            learned_patterns[pattern_key] = {"count": 0, "learned_factors": []}
        learned_patterns[pattern_key]["count"] += 1

def get_adjustment_factor() -> float:
    """
    Get the adjustment factor based on learned patterns
    Positive = more strict, Negative = less strict
    """
    adjust = 0.0
    
    # Reduce strictness for false positives
    if "reduce_strictness" in learned_patterns:
        count = learned_patterns["reduce_strictness"]["count"]
        # Reduce risk score by up to 10 points per false positive
        adjust -= min(count * 2, 15)
    
    # Increase strictness for false negatives
    if "increase_strictness" in learned_patterns:
        count = learned_patterns["increase_strictness"]["count"]
        # Increase risk score by up to 5 points per false negative
        adjust += min(count * 1, 10)
    
    return adjust

def get_feedback_history(user_id: Optional[str] = None, limit: int = 50) -> List[dict]:
    """Get feedback history, optionally filtered by user"""
    if user_id:
        user_feedback = [f for f in feedback_store if f.get('user_id') == user_id]
        return user_feedback[-limit:]
    return feedback_store[-limit:]

def get_feedback_stats() -> dict:
    """Get feedback statistics"""
    false_positives = len([f for f in feedback_store if f.get('feedback_type') == 'false_positive'])
    false_negatives = len([f for f in feedback_store if f.get('feedback_type') == 'false_negative'])
    genuine_feedback = len([f for f in feedback_store if f.get('user_feedback') == 'GENUINE'])
    fraud_feedback = len([f for f in feedback_store if f.get('user_feedback') == 'FRAUD'])
    
    return {
        "total_feedback": len(feedback_store),
        "false_positives": false_positives,
        "false_negatives": false_negatives,
        "genuine_confirmations": genuine_feedback,
        "fraud_confirmations": fraud_feedback,
        "adjustment_factor": get_adjustment_factor(),
        "learned_patterns": learned_patterns
    }

def apply_feedback_learning(base_risk_score: int) -> int:
    """Apply learned feedback to adjust risk score"""
    adjustment = get_adjustment_factor()
    adjusted_score = base_risk_score + int(adjustment)
    return max(0, min(100, adjusted_score))

# Initialize feedback data on module load
load_feedback_data()

