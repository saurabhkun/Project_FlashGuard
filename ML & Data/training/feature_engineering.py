import pandas as pd
import os

def engineer_features():
    # 1. The RAW data (The source)
    raw_path = r"D:\FlashGuard\CHK-1772903081690-6260\data\paysim.csv"
    
    # 2. The PROCESSED data (The output)
    output_dir = r"D:\FlashGuard\CHK-1772903081690-6260\ML & Data\training\data"
    output_file = os.path.join(output_dir, "processed_paysim.csv")

    if not os.path.exists(raw_path):
        print(f"❌ ERROR: Cannot find raw data at {raw_path}")
        return

    print("1. Loading raw transaction logs...")
    df = pd.read_csv(raw_path, nrows=100000) # Increased to 100k for better training
    
    print("2. Building Threat Indicators...")
    df['errorBalanceOrig'] = df['newbalanceOrig'] + df['amount'] - df['oldbalanceOrg']
    df = pd.get_dummies(df, columns=['type'], drop_first=True)

    print("3. Cleaning up data...")
    cols_to_drop = ['nameOrig', 'nameDest', 'isFlaggedFraud', 'step']
    df = df.drop(columns=[c for c in cols_to_drop if c in df.columns])
    
    # Create the 'data' folder if it's missing
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    print(f"4. Saving to {output_file}...")
    df.to_csv(output_file, index=False)
    print("✅ Feature engineering complete!")

if __name__ == "__main__":
    engineer_features()