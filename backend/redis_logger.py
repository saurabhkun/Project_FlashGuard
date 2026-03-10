# Temporary Mock Logger - NO REDIS REQUIRED
# This keeps history in your computer's RAM while the server is running

_mock_storage = []

def log_transaction(data, status):
    """Saves the transaction to our temporary memory list"""
    try:
        # Convert the incoming data to a dictionary
        entry = data.dict()
        entry['status'] = status
        _mock_storage.append(entry)
        print(f"💾 Memory Log: User {data.nameOrig} saved. Total history: {len(_mock_storage)}")
    except Exception as e:
        print(f"❌ Error logging to memory: {e}")

def get_history():
    """Retrieves all previous transactions from memory"""
    return _mock_storage