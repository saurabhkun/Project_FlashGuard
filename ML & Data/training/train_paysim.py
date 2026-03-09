import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score

# 1) Change this path if needed
csv_path = "dataset/paysim dataset.csv"

# 2) Load data
df = pd.read_csv(csv_path)

# 3) Target and basic features
target = "isFraud"          # PaySim label column
features = [
    "amount",
    "oldbalanceOrg",
    "newbalanceOrig",
    "oldbalanceDest",
    "newbalanceDest",
]

# 4) Add transaction type as one‑hot
X_num = df[features]
X_cat = pd.get_dummies(df[["type"]], drop_first=True)
X = pd.concat([X_num, X_cat], axis=1)
y = df[target]

# 5) Train/test split (stratify because data is imbalanced)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 6) Train a simple model with class_weight balanced
model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced",
    n_jobs=-1
)
model.fit(X_train, y_train)

# 7) Evaluate
y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]

print(classification_report(y_test, y_pred))
print("ROC-AUC:", roc_auc_score(y_test, y_proba))

