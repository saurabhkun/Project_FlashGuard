import os
import sys
import json
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from typing import Dict, Any, Tuple, List, Optional
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OrdinalEncoder

# ------------------------------------------------------------------------------
# 1. CustomPreprocessor Class Definition
# Matches training pipeline from DataSet.csv (d:/Hackathon/preprocessor.py)
# ------------------------------------------------------------------------------
class CustomPreprocessor(BaseEstimator, TransformerMixin):
    """
    Reproducible preprocessing transformer for FraudGuard pipeline.
    Handles ID removal, leakage column removal, categorical encoding,
    missing value imputation, and constant column removal.
    """
    def __init__(self, target_col="F3924", leakage_cols=None, drop_missing_pct=95.0, drop_const_pct=99.5):
        self.target_col = target_col
        self.leakage_cols = leakage_cols if leakage_cols is not None else ["F3912", "Unnamed: 0"]
        self.drop_missing_pct = drop_missing_pct
        self.drop_const_pct = drop_const_pct
        
        # Fitted attributes
        self.columns_to_drop_ = []
        self.categorical_cols_ = []
        self.numeric_cols_ = []
        self.cat_encoder_ = None
        self.num_imputer_ = None
        self.feature_names_out_ = []
        
    def fit(self, X, y=None):
        X = X.copy()
        drop_set = set()
        for col in self.leakage_cols:
            if col in X.columns:
                drop_set.add(col)
                
        if self.target_col in X.columns:
            drop_set.add(self.target_col)
            
        for col in X.columns:
            if col not in drop_set:
                if col.lower() in ['id', 'index'] or X[col].dtype == 'object':
                    if X[col].nunique(dropna=True) > 1000:
                        drop_set.add(col)
                        
        n_rows = len(X)
        missing_series = (X.isna().sum() / n_rows) * 100
        uniques = X.nunique(dropna=True)
        
        for col in X.columns:
            if col not in drop_set:
                if missing_series[col] >= self.drop_missing_pct:
                    drop_set.add(col)
                    continue
                    
                if uniques[col] <= 1:
                    drop_set.add(col)
                    continue

        self.columns_to_drop_ = sorted(list(drop_set))
        
        remaining_cols = [c for c in X.columns if c not in self.columns_to_drop_]
        self.categorical_cols_ = [c for c in remaining_cols if X[c].dtype == 'object' or not pd.api.types.is_numeric_dtype(X[c])]
        self.numeric_cols_ = [c for c in remaining_cols if c not in self.categorical_cols_]
        
        if self.categorical_cols_:
            cat_df = X[self.categorical_cols_].fillna("Missing").astype(str)
            self.cat_encoder_ = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
            self.cat_encoder_.fit(cat_df)
            
        if self.numeric_cols_:
            self.num_imputer_ = SimpleImputer(strategy='median')
            self.num_imputer_.fit(X[self.numeric_cols_])
            
        self.feature_names_out_ = self.categorical_cols_ + self.numeric_cols_
        return self

    def transform(self, X):
        X = X.copy()
        cols_to_drop = [c for c in self.columns_to_drop_ if c in X.columns]
        X_clean = X.drop(columns=cols_to_drop, errors='ignore')
        
        # Single-call reindex for instant column alignment
        expected_cols = self.categorical_cols_ + self.numeric_cols_
        X_clean = X_clean.reindex(columns=expected_cols)
        
        if self.categorical_cols_:
            cat_data = X_clean[self.categorical_cols_].fillna("Missing").astype(str)
            cat_trans = self.cat_encoder_.transform(cat_data)
            cat_df = pd.DataFrame(cat_trans, columns=self.categorical_cols_, index=X.index)
        else:
            cat_df = pd.DataFrame(index=X.index)
            
        if self.numeric_cols_:
            num_trans = self.num_imputer_.transform(X_clean[self.numeric_cols_])
            num_df = pd.DataFrame(num_trans, columns=self.numeric_cols_, index=X.index)
        else:
            num_df = pd.DataFrame(index=X.index)
            
        return pd.concat([cat_df, num_df], axis=1)

# Register CustomPreprocessor in sys.modules under 'preprocessor' for joblib pickling compatibility
import types
preprocessor_module = types.ModuleType('preprocessor')
preprocessor_module.CustomPreprocessor = CustomPreprocessor
sys.modules['preprocessor'] = preprocessor_module

# ------------------------------------------------------------------------------
# 2. FraudGuardAdapter Class
# Bridge between incoming transaction payloads and HistGradientBoosting model
# ------------------------------------------------------------------------------
class FraudGuardAdapter:
    """
    Adapter layer for FraudGuard HistGradientBoosting model trained on DataSet.csv.
    """
    def __init__(self, bundle_path: Optional[str] = None):
        self.model = None
        self.preprocessor = None
        self.selected_features = []
        self.threshold = 0.5
        self.target = "F3924"
        self.model_version = "fraudguard-dataset-v1"
        self.model_type = "HistGradientBoostingClassifier"
        self.is_loaded = False
        
        if bundle_path and os.path.exists(bundle_path):
            self.load_bundle(bundle_path)

    def load_bundle(self, bundle_path: str):
        """Loads self-contained model bundle."""
        try:
            bundle = joblib.load(bundle_path)
            if isinstance(bundle, dict):
                self.model = bundle.get("model")
                self.preprocessor = bundle.get("preprocessor")
                self.selected_features = bundle.get("selected_features", bundle.get("features", []))
                self.threshold = float(bundle.get("threshold", 0.5))
                self.target = bundle.get("target", "F3924")
                self.model_version = bundle.get("model_version", "fraudguard-dataset-v1")
                self.model_type = bundle.get("model_type", "HistGradientBoostingClassifier")
            else:
                self.model = bundle
            
            self.is_loaded = (self.model is not None and self.preprocessor is not None)
            return self.is_loaded
        except Exception as e:
            print(f"❌ Error loading FraudGuard bundle ({bundle_path}): {e}")
            self.is_loaded = False
            return False

    def predict_payload(self, data_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs inference on raw feature dictionary or TransactionRequest dictionary.
        """
        if not self.is_loaded:
            return {
                "fraud_probability": 0.0,
                "is_fraud": False,
                "risk_level": "LOW",
                "reasons": ["FraudGuard ML model not loaded"],
                "top_features": []
            }
            
        df_raw = pd.DataFrame([data_dict])
        
        # Preprocess via CustomPreprocessor
        try:
            df_clean = self.preprocessor.transform(df_raw)
        except Exception as e:
            print(f"⚠️ Preprocessor transform warning: {e}")
            df_clean = pd.DataFrame(index=df_raw.index)

        # Align selected 100 features
        for feat in self.selected_features:
            if feat not in df_clean.columns:
                # If record contains explicit raw key in data_dict, use it, else default 0.0
                if feat in data_dict:
                    try:
                        df_clean[feat] = float(data_dict[feat])
                    except (ValueError, TypeError):
                        df_clean[feat] = 0.0
                else:
                    df_clean[feat] = 0.0
                    
        X_pred = df_clean[self.selected_features]
        
        # Predict probability
        if hasattr(self.model, "predict_proba"):
            prob = float(self.model.predict_proba(X_pred)[0, 1])
        elif hasattr(self.model, "decision_function"):
            raw_score = float(self.model.decision_function(X_pred)[0])
            prob = float(1.0 / (1.0 + np.exp(-raw_score)))
        else:
            pred_val = int(self.model.predict(X_pred)[0])
            prob = 1.0 if pred_val == 1 else 0.0
            
        is_fraud = bool(prob >= self.threshold or prob >= 0.80)
        
        if prob >= 0.80:
            risk_level = "HIGH"
        elif prob >= 0.40:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
            
        reasons = []
        if is_fraud:
            reasons.append(f"FraudGuard ML model detected high fraud probability ({prob:.1%})")
            
        return {
            "fraud_probability": prob,
            "is_fraud": is_fraud,
            "risk_level": risk_level,
            "reasons": reasons,
            "selected_features_count": len(self.selected_features)
        }
