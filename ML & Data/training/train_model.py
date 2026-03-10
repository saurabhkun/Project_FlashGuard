import pandas as pd
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# 1. Load the processed data we just created
data_path = r"D:\FlashGuard\CHK-1772903081690-6260\ML & Data\training\data\processed_paysim.csv"

if not os.path.exists(data_path):
    print(f"❌ ERROR: Processed data not found at {data_path}. Run feature_engineering.py first!")
else:
    print("📂 Loading processed data...")
    df = pd.read_csv(data_path)

    # 2. Define Features and Target
    X = df.drop(columns=['isFraud'])
    y = df['isFraud']

    # 3. Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 4. Train Model
    print("🧠 Training the FlashGuard AI (Random Forest)...")
    model = RandomForestClassifier(n_estimators=50, class_weight='balanced', n_jobs=-1)
    model.fit(X_train, y_train)

    # 5. Save the Model (Safely creating the directory first)
    model_output = r"D:\FlashGuard\CHK-1772903081690-6260\notebook\flashguard_model.pkl"
    
    # NEW: This line creates the 'notebook' folder if it doesn't exist
    os.makedirs(os.path.dirname(model_output), exist_ok=True)
    
    with open(model_output, 'wb') as f:
        pickle.dump(model, f)

    print(f"✅ SUCCESS! Model saved to {model_output}")

    print(f"✅ SUCCESS! Model saved to {model_output}")
    print("\n--- Model Performance ---")
    print(classification_report(y_test, model.predict(X_test)))