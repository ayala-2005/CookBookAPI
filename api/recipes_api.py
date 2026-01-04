#api/recipes_api.py
from fastapi import APIRouter, HTTPException
from services.recipes_service import *
from db.schemas import  *
router = APIRouter(
    prefix="/recipes",
    tags=["recipes"]
)

@router.get("/")
async def get_all():
    return list_recipes()

@router.get("/{recipe_id}")
async def get_recipe(recipe_id: int):
    recipe = get_recipe_by_id(recipe_id)
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@router.get("/categories/{category_id}")
async def get_recipe_categories(category_id: int):
    return get_recipe_by_category_id(category_id)

@router.post("/", response_model=RecipeRead)
async def create_recipe(recipe: RecipeCreate):
    new_recipe = add_recipe(recipe)
    if not new_recipe:
        raise HTTPException(status_code=500, detail="Failed to add recipe")
    return new_recipe

@router.put("/{recipe_id}", response_model=RecipeRead)
async def update_recipe_db(recipe_id: int, recipe_data: RecipeCreate):
    updated_recipe = query_update_recipe(SessionLocal(), recipe_id, recipe_data)
    if not updated_recipe:
        raise HTTPException(status_code=500, detail="Failed to update recipe")
    return updated_recipe

@router.delete("/{recipe_id}")
async def delete_recipe_db(recipe_id: int):
    recipe = get_recipe_by_id(recipe_id)
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    delete_recipe(recipe)
