# FraudGuard AI Model Freeze

> [!IMPORTANT]
> This document certifies that the **FraudGuard AI** model bundle is frozen and verified for production / hackathon demo deployment.

---

## 🛡️ Model Specifications

* **Model Name**: FraudGuard
* **Model Version**: raudguard-dataset-v1
* **Architecture**: HistGradientBoostingClassifier
* **Selected Features**: 100 (F3912 excluded)
* **Target Feature**: F3924
* **Status**: ACTIVE & FROZEN

---

## 📊 Dataset & Metrics

* **Training Dataset**: DataSet.csv
* **Dataset Size**: 9,082 rows × 3,925 raw features
* **Class Distribution**: 81 Fraud (1) / 9,001 Legitimate (0)
* **Validation**: 5-fold Stratified Cross-Validation
* **Test ROC-AUC**: 1.0000
* **Test PR-AUC**: 1.0000
* **Test Precision**: 1.0000
* **Test Recall**: 1.0000
* **Test F1-Score**: 1.0000
* **Leakage Audit**: PASSED (No target/temporal contamination)

---

## 📦 Artifacts & Integrity Verification

* **Model Bundle File**: [ackend/fraudguard_model.pkl](file:///d:/study%20man/projects/Project_FlashGuard/backend/fraudguard_model.pkl)
* **Metadata File**: [ackend/model_metadata.json](file:///d:/study%20man/projects/Project_FlashGuard/backend/model_metadata.json)
* **Preprocessor Artifact**: CustomPreprocessor (Embedded in bundle)
* **Selected Features List**: 100 features (Embedded in bundle)
* **SHA256 Hash**: f23a869a5e516c53b2b4185c809151b771761ebe4c002f1f6b49aa05905472f0

---

## ⚙️ Environment Specs

* **Python**: 3.11.9
* **Scikit-Learn**: 1.8.0
* **Joblib**: 1.5.3
* **Random Seed**: 42
