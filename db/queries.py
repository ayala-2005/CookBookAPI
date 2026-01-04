# db/queries.py
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from .models import Recipe
from db.schemas import RecipeCreate


def query_get_all_recipes(db: Session):
    try:
        recipes = db.query(Recipe).all()
        return recipes
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return []

def query_get_recipe_by_id(db: Session, recipe_id: int):
    try:
        recipe = db.query(Recipe).filter(Recipe.Id == recipe_id).first()
        return recipe
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return []

def query_get_recipe_by_category(db: Session, recipe_category_id: int):
    try:
        result = db.query(Recipe).filter(Recipe.CategoryId == recipe_category_id).all()
        return result
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return []

def query_add_recipe(db: Session, recipe: Recipe):
    try:
        db.add(recipe)
        db.commit()
        db.refresh(recipe)  # טוען את ה-ID והנתונים המעודכנים מה-DB
        return recipe
    except SQLAlchemyError as e:
        db.rollback()  # מבטלים את השינויים אם קרתה שגיאה
        print(f"Database error: {e}")
        print(f"Recipe data: {recipe.__dict__}")  # מדפיס את הנתונים שניסינו להוסיף
        return None  # מחזיר None במקום [] כדי שה-service ידע שהכשלה קרתה

def query_update_recipe(db: Session, recipe_id: int, recipe_data: RecipeCreate):
    try:
        update_data = {
            "Title": recipe_data.Title,
            "Description": recipe_data.Description,
            "Ingredients": recipe_data.Ingredients,
            "Instructions": recipe_data.Instructions,
            "PrepTime": recipe_data.PrepTime,
            "CategoryId": recipe_data.CategoryId
        }
        db.query(Recipe).filter(Recipe.Id == recipe_id).update(update_data)
        db.commit()
        updated_recipe = db.query(Recipe).filter(Recipe.Id == recipe_id).first()
        return updated_recipe
    except SQLAlchemyError as e:
        db.rollback()
        print(f"Database error: {e}")
        return None

def query_delete_recipe(db: Session, recipe: Recipe):
    try:
        db.query(Recipe).filter(Recipe.Id == recipe.Id).delete()
        db.commit()
        return recipe
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return []
