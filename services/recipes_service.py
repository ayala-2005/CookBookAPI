# service/recipe_service.py
from fastapi import HTTPException
from db.queries import *
from db.connection import SessionLocal
from db.schemas import RecipeCreate


def list_recipes():
    with SessionLocal() as db:
        recipes = query_get_all_recipes(db)
        return recipes

def get_recipe_by_id(recipe_id: int):
    with SessionLocal() as db:
        recipe = query_get_recipe_by_id(db,recipe_id)
        if recipe is None:
            raise HTTPException(status_code=404, detail="Recipe not found")
        return recipe

def get_recipe_by_category_id(category_id: int):
    with SessionLocal() as db:
        recipe = query_get_recipe_by_category(db,category_id)
        if recipe is None:
            raise HTTPException(status_code=404, detail="Recipe not found")
        return recipe

def add_recipe(recipe: RecipeCreate):
    # הופך את Pydantic ל-SQLAlchemy
    db_recipe = Recipe(**recipe.dict())
    with SessionLocal() as db:
        result = query_add_recipe(db, db_recipe)
        return result

def update_recipe(recipe: Recipe):
    with SessionLocal() as db:
        updated_recipe = query_update_recipe(db, recipe)
        if updated_recipe is None:
            raise HTTPException(status_code=500, detail="Failed to update recipe")
        return updated_recipe

def delete_recipe(recipe: Recipe):
    with SessionLocal() as db:
        recipe = query_delete_recipe(db,recipe)
        return recipe
