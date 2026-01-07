const API_BASE = 'http://127.0.0.1:8000/recipes'; // כתובת ה-API שלך

let currentCategory = null;
let isAdminMode = false;
let editingRecipeId = null;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    document.getElementById('recipeForm').addEventListener('submit', handleRecipeSubmit);
    document.getElementById('recipeImage').addEventListener('change', handleImagePreview);

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            loadCategory(parseInt(this.getAttribute('data-category')));
        });
    });

    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            loadCategory(parseInt(this.getAttribute('data-category')));
        });
    });
});

function toggleAdminMode() {
    isAdminMode = !isAdminMode;
    const adminBtn = document.getElementById('adminBtn');
    const addBtn = document.getElementById('addRecipeBtn');

    adminBtn.textContent = isAdminMode ? 'יציאה ממצב מנהל' : 'מצב מנהל';
    adminBtn.classList.toggle('active', isAdminMode);
    if (addBtn) addBtn.classList.toggle('hidden', !isAdminMode);

    if (currentCategory) loadCategory(currentCategory);
}

function showAddRecipe() {
    editingRecipeId = null;
    document.getElementById('formTitle').textContent = 'הוסף מתכון חדש';
    document.getElementById('recipeForm').reset();
    document.getElementById('recipeCategory').value = currentCategory;
    document.getElementById('imagePreview').classList.add('hidden');
    showPage('recipeFormPage');
}

function editRecipe(recipeId) {
    editingRecipeId = recipeId;
    document.getElementById('formTitle').textContent = 'ערוך מתכון';

    fetch(`${API_BASE}/${recipeId}`)
        .then(response => response.json())
        .then(recipe => {
            document.getElementById('recipeTitle').value = recipe.Title || '';
            document.getElementById('recipeDescription').value = recipe.Description || '';
            document.getElementById('recipeIngredients').value = recipe.Ingredients || '';
            document.getElementById('recipeInstructions').value = recipe.Instructions || '';
            document.getElementById('recipeCategory').value = recipe.CategoryId || currentCategory;

            if (recipe.Images) {
                const preview = document.getElementById('imagePreview');
                preview.innerHTML = `<img src="${recipe.Images}" alt="${recipe.Title}">`;
                preview.classList.remove('hidden');
            }
        });

    showPage('recipeFormPage');
}

function deleteRecipe(recipeId) {
    if (!confirm('האם אתה בטוח שברצונך למחוק את המתכון?')) return;

    fetch(`${API_BASE}/${recipeId}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                alert('המתכון נמחק בהצלחה');
                loadCategory(currentCategory);
            }
        });
}

function handleRecipeSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('Title', document.getElementById('recipeTitle').value);
    formData.append('Description', document.getElementById('recipeDescription').value);
    formData.append('Ingredients', document.getElementById('recipeIngredients').value);
    formData.append('Instructions', document.getElementById('recipeInstructions').value);
    formData.append('PrepTime', parseInt(document.getElementById('recipePrepTime').value) || 0);
    formData.append('CategoryId', parseInt(document.getElementById('recipeCategory').value));

    const imageFile = document.getElementById('recipeImage').files[0];
    if (imageFile) formData.append('Images', imageFile);

    const url = editingRecipeId ? `${API_BASE}/${editingRecipeId}` : `${API_BASE}/`;
    const method = editingRecipeId ? 'PUT' : 'POST';

    fetch(url, { method, body: formData })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            alert(editingRecipeId ? 'המתכון עודכן בהצלחה' : 'המתכון נוסף בהצלחה');
            goBack();
            loadCategory(currentCategory);
        })
        .catch(err => alert('שגיאה בהוספה/עדכון המתכון: ' + err.message));
}

function handleImagePreview(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="תצוגה מקדימה">`;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        preview.classList.add('hidden');
    }
}

async function loadCategory(categoryId) {
    currentCategory = categoryId;
    const categoryNames = {1: 'קינחים', 2: 'עוגות', 3: 'עוגיות'};

    showPage('categoryPage');
    document.getElementById('categoryTitle').textContent = categoryNames[categoryId];

    const addBtn = document.getElementById('addRecipeBtn');
    if (addBtn) addBtn.classList.toggle('hidden', !isAdminMode);

    const recipesGrid = document.getElementById('recipesGrid');
    recipesGrid.innerHTML = '<div class="loading">טוען מתכונים...</div>';

    try {
        const response = await fetch(`${API_BASE}/categories/${categoryId}`);
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        recipesGrid.innerHTML = '<div class="loading">שגיאה בטעינת המתכונים</div>';
    }
}

function displayRecipes(recipes) {
    const recipesGrid = document.getElementById('recipesGrid');

    if (!recipes || recipes.length === 0) {
        recipesGrid.innerHTML = '<div class="loading">אין מתכונים זמינים</div>';
        return;
    }

    recipesGrid.innerHTML = recipes.map(recipe => `
        <div class="recipe-card" onclick="showRecipe(${recipe.Id})">
            <div class="recipe-image">
                ${recipe.Images ? `<img src="${recipe.Images}" alt="${recipe.Title}">` : `<div class="emoji-placeholder">${getRecipeEmoji(recipe.Title)}</div>`}
            </div>
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.Title}</h3>
                <p class="recipe-description">${recipe.Description || 'מתכון מתוק ומיוחד'}</p>
                ${isAdminMode ? `
                    <div class="recipe-actions">
                        <button onclick="event.stopPropagation(); editRecipe(${recipe.Id})" class="edit-btn">עריכה</button>
                        <button onclick="event.stopPropagation(); deleteRecipe(${recipe.Id})" class="delete-btn">מחיקה</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// שאר הפונקציות (showRecipe, getRecipeEmoji, showPage, goHome, goBack, toggleChat, sendMessage, addMessage)
// נשארות כפי שהן בקוד שלך
