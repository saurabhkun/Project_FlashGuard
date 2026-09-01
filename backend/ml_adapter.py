"""
FraudGuard ML Adapter (v2 Hybrid)
Responsible for loading the trained ML risk model (fraudguard_v2)
and generating bounded, coverage-aware machine-learned fraud signals.
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Optional, List


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_MODEL_PATH = os.path.join(BASE_DIR, "fraudguard_model.pkl")

class FraudGuardAdapter:
    """
    Adapter for FraudGuard ML model.
    Supports both full high-dimensional benchmark payloads and standard
    mobile transaction payloads via feature coverage tracking and
    smooth attenuation.
    """
    def __init__(self, bundle_path: Optional[str] = None):
        self.model = None
        self.num_imputer = None
        self.cat_encoder = None
        self.selected_features: List[str] = []
        self.feature_medians: Dict[str, float] = {}
        self.threshold: float = 0.50
        self.target: str = "F3924"
        self.model_version: str = "fraudguard-v2-hybrid"
        self.model_type: str = "CalibratedRandomForestClassifier"
        self.is_loaded: bool = False
        
        path_to_load = bundle_path or DEFAULT_MODEL_PATH
        if path_to_load and os.path.exists(path_to_load):
            self.load_bundle(path_to_load)

    def load_bundle(self, bundle_path: str) -> bool:
        try:
            bundle = joblib.load(bundle_path)
            if isinstance(bundle, dict):
                self.model = bundle.get("model")
                self.num_imputer = bundle.get("num_imputer")
                self.cat_encoder = bundle.get("cat_encoder")
                self.selected_features = bundle.get("selected_features", bundle.get("features", []))
                self.feature_medians = bundle.get("feature_medians", {})
                self.threshold = float(bundle.get("threshold", 0.50))
                self.target = bundle.get("target", "F3924")
                self.model_version = bundle.get("model_version", "fraudguard-v2-hybrid")
                self.model_type = bundle.get("model_type", type(self.model).__name__ if self.model else "Unknown")
            else:
                self.model = bundle
                self.model_type = type(bundle).__name__
            
            self.is_loaded = (self.model is not None)
            return self.is_loaded
        except Exception as e:
            print(f"Error loading FraudGuard bundle ({bundle_path}): {e}")
            self.is_loaded = False
            return False

    def build_feature_vector(self, data_dict: Dict[str, Any]) -> tuple[pd.DataFrame, float]:
        """
        Constructs the feature vector for model input and returns (DataFrame, coverage_ratio).
        """
        vector = {}
        explicit_count = 0

        for feat in self.selected_features:
            if feat in data_dict and data_dict[feat] is not None and not pd.isna(data_dict[feat]):
                try:
                    vector[feat] = float(data_dict[feat])
                    explicit_count += 1
                except (ValueError, TypeError):
                    vector[feat] = self.feature_medians.get(feat, 0.0)
            else:
                vector[feat] = self.feature_medians.get(feat, 0.0)

        coverage = explicit_count / len(self.selected_features) if self.selected_features else 0.0
        df_vector = pd.DataFrame([vector])[self.selected_features]
        return df_vector, coverage

    def predict_payload(self, data_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluates an incoming transaction payload.
        Returns probability, bounded ML score contribution (0-35), coverage, and reasons.
        """
        if not self.is_loaded or not self.selected_features:
            return {
                "fraud_probability": 0.0,
                "ml_score": 0.0,
                "feature_coverage": 0.0,
                "is_fraud": False,
                "risk_level": "LOW",
                "reasons": ["ML model not loaded - using deterministic rules"],
                "model_version": self.model_version,
                "selected_features_count": 0
            }

        X_pred, coverage = self.build_feature_vector(data_dict)

        # 1. Compute raw model prediction probability
        try:
            if hasattr(self.model, "predict_proba"):
                raw_prob = float(self.model.predict_proba(X_pred)[0, 1])
            elif hasattr(self.model, "decision_function"):
                score = float(self.model.decision_function(X_pred)[0])
                raw_prob = float(1.0 / (1.0 + np.exp(-score)))
            else:
                raw_prob = float(self.model.predict(X_pred)[0])
        except Exception as e:
            print(f"Prediction error in FraudGuardAdapter: {e}")
            raw_prob = 0.0

        # 2. Coverage-aware ML score calculation
        # If payload has high benchmark coverage (>50%), trust the ML probability fully.
        # If payload is standard mobile payload (coverage < 50%), calibrate the ML contribution
        # smoothly without injecting artificial fraud medians.
        if coverage >= 0.50:
            effective_prob = raw_prob
            # Full ML contribution: maps 0.0..1.0 to 0..35 risk points
            ml_score = min(max(effective_prob * 35.0, 0.0), 35.0)
        else:
            # Standard mobile transaction payload:
            # Base ML signal on baseline medians is low/neutral (~0.05..0.15)
            # Attenuate by coverage to prevent baseline bias
            effective_prob = raw_prob * max(coverage, 0.1)
            ml_score = min(max(effective_prob * 35.0, 0.0), 35.0)

        # Determine ML risk tier
        if effective_prob >= 0.70:
            risk_level = "HIGH"
            is_fraud = True
        elif effective_prob >= 0.35:
            risk_level = "MEDIUM"
            is_fraud = False
        else:
            risk_level = "LOW"
            is_fraud = False

        reasons = []
        if effective_prob >= 0.70:
            reasons.append(f"Machine learning model flagged high statistical anomaly ({effective_prob:.1%})")
        elif effective_prob >= 0.40:
            reasons.append(f"Machine learning model indicated elevated anomaly pattern ({effective_prob:.1%})")

        return {
            "fraud_probability": round(effective_prob, 4),
            "raw_probability": round(raw_prob, 4),
            "ml_score": round(ml_score, 1),
            "feature_coverage": round(coverage, 2),
            "is_fraud": is_fraud,
            "risk_level": risk_level,
            "reasons": reasons,
            "model_version": self.model_version,
            "selected_features_count": len(self.selected_features)
        }
