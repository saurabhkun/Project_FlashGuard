from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import TransactionRequest
from predict import make_decision
from redis_logger import log_transaction, get_history
from behavioral_model import predict_behavior

app = FastAPI(title="FlashGuard Pro API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... imports ...
@app.post("/predict")
async def predict_route(data: TransactionRequest):
    # 1. Get history from our new memory list
    history = get_history()
    user_history = [tx for tx in history if tx.get('nameOrig') == data.nameOrig]
    
    # 2. Run Models
    status_a, pred_a = make_decision(data)
    behavior_label, behavior_score = predict_behavior(data, user_history)

    # 3. Decision
    final_status = "BLOCKED" if (status_a == "BLOCKED" or behavior_score == 1) else "SUCCESS"

    # 4. SAVE IT (So the next time this user shows up, history_count > 0)
    log_transaction(data, final_status)

    return {
        "status": final_status,
        "behavioral_insight": behavior_label,
        "history_count": len(user_history)
    }

@app.get("/history")
async def history_route():
    return get_history()