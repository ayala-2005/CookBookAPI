# db/models.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()


class Category(Base):
    __tablename__ = "Categories"

    Id = Column(Integer, primary_key=True, autoincrement=True)
    Name = Column(String(100), nullable=False, unique=True)

    # קשר ל-Recipes
    recipes = relationship("Recipe", back_populates="category")


class Recipe(Base):
    __tablename__ = "Recipes"

    Id = Column(Integer, primary_key=True, autoincrement=True)
    Title = Column(String(200), nullable=False)
    Description = Column(Text)
    Ingredients = Column(Text, nullable=False)
    Instructions = Column(Text, nullable=False)
    PrepTime = Column(Integer)
    CategoryId = Column(Integer, ForeignKey("Categories.Id"), nullable=False)
    CreatedAt = Column(DateTime, default=datetime.now)

    # 🔹 הוספת עמודת תמונה
    image_path = Column(String) # מספיק מקום לנתיב ארוך

    # קשר ל-Category
    category = relationship("Category", back_populates="recipes")
