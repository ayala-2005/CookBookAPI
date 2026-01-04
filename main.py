#main
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.recipes_api import router as recipes_router
from api.gemini_api import router as chat_router

app = FastAPI()

# הגדרות CORS - מצוין לעבודה עם Front-end
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# תיקון ה-Prefixes:
# כאן אנחנו מגדירים שכל מה שקשור למתכונים יתחיל ב-/recipes
app.include_router(recipes_router, prefix="/recipes", tags=["Recipes"])

# כאן אנחנו מחברים את ה-Gemini (הוא כבר מכיל את הנתיב /chat בתוך ה-router שלו)
app.include_router(chat_router, tags=["Chat"])

@app.get("/")
def root():
    return {"message": "Welcome to the Baking App API!"}