# app.py
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import redis
import time
import os
import base64
import secrets
from dotenv import load_dotenv
import logging

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()  # Load environment variables from .env

app = FastAPI()

# Configure CORS
allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Set to your frontend's URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Redis
redis_host = os.getenv('REDIS_HOST', 'localhost')
try:
    redis_client = redis.Redis(host=redis_host, port=6379, db=0, decode_responses=True)
    # Test Redis connection
    redis_client.ping()
    logger.info("Connected to Redis successfully.")
except redis.RedisError as e:
    logger.error(f"Redis connection failed: {e}")
    raise e

# Load API keys from environment variables (comma-separated)
API_KEYS = set(os.getenv('API_KEYS', '').split(','))  # e.g., "key1,key2,key3"

if not API_KEYS:
    logger.error("No API keys found. Please set the API_KEYS environment variable.")
    raise Exception("No API keys found.")

# Constants
TIME_LIMIT_SECONDS = 30  # Very stringent time constraint

class VerificationRequest(BaseModel):
    session_id: str
    answer: str

def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key not in API_KEYS:
        logger.warning(f"Unauthorized access attempt with API key: {x_api_key}")
        raise HTTPException(status_code=401, detail="Unauthorized")

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/challenge")
def get_challenge(x_api_key: str = Header(...)):
    verify_api_key(x_api_key)
    # Generate a large random number for the challenge
    challenge_number = secrets.randbits(256)
    challenge_number_hex = hex(challenge_number)[2:]
    challenge_number_bytes = bytes.fromhex(challenge_number_hex)
    challenge_base64 = base64.b64encode(challenge_number_bytes).decode('utf-8')

    # Calculate expected result using the mathematical formula
    n = challenge_number
    expected_result = (n * (n + 1) * (2 * n + 1)) // 6

    # Store the expected result and timestamp in Redis
    session_id = secrets.token_hex(16)
    try:
        redis_client.hset(session_id, mapping={
            'expected_result': expected_result,
            'timestamp': time.time()
        })
        redis_client.expire(session_id, TIME_LIMIT_SECONDS + 1)  # Slight buffer
        logger.info(f"Generated challenge with session_id: {session_id}")
    except redis.RedisError as e:
        logger.error(f"Failed to store session data: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

    return {
        'challenge': challenge_base64,
        'session_id': session_id
    }

@app.post("/verify")
def verify_answer(data: VerificationRequest, x_api_key: str = Header(...)):
    verify_api_key(x_api_key)
    session_id = data.session_id
    user_answer_base64 = data.answer

    logger.info(f"Received verification attempt for session_id: {session_id}")

    # Retrieve expected result and timestamp
    try:
        session_data = redis_client.hgetall(session_id)
    except redis.RedisError as e:
        logger.error(f"Redis error while retrieving session_id {session_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

    if not session_data:
        logger.warning(f"Session ID {session_id} not found or expired.")
        raise HTTPException(status_code=400, detail="Invalid or expired session ID.")

    expected_result = session_data.get('expected_result')
    timestamp = session_data.get('timestamp')

    if expected_result is None or timestamp is None:
        logger.warning(f"Incomplete session data for session_id {session_id}.")
        redis_client.delete(session_id)
        raise HTTPException(status_code=400, detail="Invalid session data.")

    try:
        expected_result = int(expected_result)
        timestamp = float(timestamp)
    except ValueError as e:
        logger.error(f"Error parsing session data for session_id {session_id}: {e}")
        redis_client.delete(session_id)
        raise HTTPException(status_code=400, detail="Invalid session data.")

    current_time = time.time()

    # Check time constraint
    time_elapsed = current_time - timestamp
    if time_elapsed > TIME_LIMIT_SECONDS:
        logger.warning(f"Session ID {session_id} exceeded time limit. Time elapsed: {time_elapsed}s")
        redis_client.delete(session_id)
        raise HTTPException(status_code=400, detail="Time limit exceeded.")

    # Decode user's answer
    try:
        user_answer_bytes = base64.b64decode(user_answer_base64)
        user_answer_int = int.from_bytes(user_answer_bytes, 'big')
        logger.info(f"Decoded user answer for session_id {session_id}: {user_answer_int}")
    except Exception as e:
        logger.error(f"Error decoding user answer for session_id {session_id}: {e}")
        raise HTTPException(status_code=400, detail="Invalid answer format.")

    # Validate the answer
    if user_answer_int == expected_result:
        logger.info(f"Session ID {session_id} verified successfully.")
        redis_client.delete(session_id)
        return {"status": "success"}
    else:
        logger.warning(f"Session ID {session_id} failed verification. Expected: {expected_result}, Got: {user_answer_int}")
        redis_client.delete(session_id)
        return {"status": "failure"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
