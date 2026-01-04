#api/gemini_api.py
import os
import requests
import urllib3
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.connection import SessionLocal
from db.models import Recipe

# ביטול אזהרות SSL עבור סינון רימון
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/chat")
def chat(user_question: str, db: Session = Depends(get_db)):
    # 1. הגדרת המפתח בתוך הפונקציה
    API_KEY = "AIzaSyAGlbdOzneJ1K4OMZmZVkJ73Eif4sEVIo0"
    target_url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            "gemini-2.5-flash:generateContent?key=" + API_KEY
    )
    # 2. בניית הכתובת - ודאי שהיא בשורה נפרדת
    try:
        # שליפת מתכונים מהמסד
        recipes = db.query(Recipe).all()
        context = "\n".join([f"מתכון: {r.Title}" for r in recipes])

        payload = {
            "contents": [{
                "parts": [{
                              "text": f"ענה בעברית כעוזר אפייה מקצועי. המשתמש שואל על אפייה. המתכונים הקיימים במאגר שלך הם: {context}. השאלה היא: {user_question}"}]
            }]
        }

        print(f"DEBUG: Sending request to: {target_url}")

        # שליחת הבקשה עם ביטול אימות SSL (חשוב לרימון)
        response = requests.post(target_url, json=payload, verify=False, timeout=30)

        if response.status_code != 200:
            return {"error": f"שגיאה {response.status_code}", "details": response.json()}

        data = response.json()

        # חילוץ התשובה מה-JSON של גוגל
        if "candidates" in data and len(data["candidates"]) > 0:
            answer = data["candidates"][0]["content"]["parts"][0]["text"]
            return {"answer": answer}
        else:
            return {"error": "No response from AI", "details": data}

    except Exception as e:
        return {"error": "Connection error", "details": str(e)}