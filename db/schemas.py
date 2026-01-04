# db/schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# למתכון שהמשתמש שולח ב-POST
class RecipeCreate(BaseModel):
    Title: str
    Description: Optional[str] = None
    Ingredients: str
    Instructions: str
    PrepTime: Optional[int] = None
    CategoryId: int

# למתכון שה-API מחזיר, כולל ID ו-CreatedAt
class RecipeRead(RecipeCreate):
    Id: int
    CreatedAt: datetime

    # שינוי ל-Pydantic v2 במקום orm_mode
    model_config = {
        "from_attributes": True
    }
