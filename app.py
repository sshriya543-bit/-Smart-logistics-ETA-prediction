from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import joblib
import pandas as pd
import uuid
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

# Load model and preprocessing pipeline
model = joblib.load("eta_xgboost_model.pkl")
preprocessor = joblib.load("eta_preprocessing_pipeline.pkl")

app = FastAPI(title="Smart Logistics ETA Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -----------------------------
# Order Storage (Temporary In-Memory DB)
# -----------------------------
orders_db = []

# -----------------------------
# Request Schemas
# -----------------------------
class ETAPredictionRequest(BaseModel):
    distance: float
    avg_speed: float
    traffic_level: int
    weather: str
    hour: int
    weekday: int
    road_type: str
    vehicle_type: str
    driver_rating: float


class CreateOrderRequest(BaseModel):
    customer_name: str
    pickup_location: str
    delivery_location: str
    distance: float
    avg_speed: float
    traffic_level: int
    weather: str
    hour: int
    weekday: int
    road_type: str
    vehicle_type: str
    driver_rating: float


class OrderResponse(BaseModel):
    order_id: str
    customer_name: str
    pickup_location: str
    delivery_location: str
    predicted_eta_minutes: float
    created_at: datetime


# -----------------------------
# Root Endpoint
# -----------------------------
@app.get("/")
def home():
    return {"message": "Smart Logistics ETA Prediction API Running 🚀"}


# -----------------------------
# ETA Prediction Endpoint
# -----------------------------
@app.post("/predict")
def predict_eta(data: ETAPredictionRequest):

    input_data = pd.DataFrame([data.dict()])

    input_data["is_peak_hour"] = input_data["hour"].apply(
        lambda x: 1 if (8 <= x <= 11) or (17 <= x <= 21) else 0
    )

    input_data["is_weekend"] = input_data["weekday"].apply(
        lambda x: 1 if x >= 5 else 0
    )

    input_data["traffic_distance"] = (
        input_data["distance"] * input_data["traffic_level"]
    )

    input_data["speed_efficiency"] = (
        input_data["avg_speed"] / input_data["distance"]
    )

    processed_data = preprocessor.transform(input_data)
    prediction = model.predict(processed_data)

    return {
        "predicted_eta_minutes": round(float(prediction[0]), 2)
    }


# -----------------------------
# Create Order API
# -----------------------------
@app.post("/orders", response_model=OrderResponse)
def create_order(order: CreateOrderRequest):

    input_data = pd.DataFrame([order.dict()])

    # Same feature engineering
    input_data["is_peak_hour"] = input_data["hour"].apply(
        lambda x: 1 if (8 <= x <= 11) or (17 <= x <= 21) else 0
    )

    input_data["is_weekend"] = input_data["weekday"].apply(
        lambda x: 1 if x >= 5 else 0
    )

    input_data["traffic_distance"] = (
        input_data["distance"] * input_data["traffic_level"]
    )

    input_data["speed_efficiency"] = (
        input_data["avg_speed"] / input_data["distance"]
    )

    processed_data = preprocessor.transform(input_data)
    prediction = model.predict(processed_data)

    eta = round(float(prediction[0]), 2)

    new_order = {
        "order_id": str(uuid.uuid4()),
        "customer_name": order.customer_name,
        "pickup_location": order.pickup_location,
        "delivery_location": order.delivery_location,
        "predicted_eta_minutes": eta,
        "created_at": datetime.utcnow()
    }

    orders_db.append(new_order)

    return new_order


# -----------------------------
# Get All Orders API
# -----------------------------
@app.get("/orders", response_model=List[OrderResponse])
def get_all_orders():
    return orders_db