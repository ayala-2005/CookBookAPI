// כתובת השרת
const API_BASE = 'http://127.0.0.1:8000/recipes';

// משתנים גלובליים
let currentCategory = null;
let currentRecipe = null;
let isAdminMode = false;
let editingRecipeId = null;

// טעינת הדף
document.addEventListener('DOMContentLoaded', function() {
    // Enter לצ'אט
    const chatInput = document.getElementById('chatInput');
    if (chatInput) chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

    // טופס מתכון
    const recipeForm = document.getElementById('recipeForm');
    if (recipeForm) recipeForm.addEventListener('submit', handleRecipeSubmit);

    // תצוגת תמונה
    const recipeImage = document.getElementById('recipeImage');
    if (recipeImage) recipeImage.addEventListener('change', handleImagePreview);

    // לחיצה על קטגוריות
    document.querySelectorAll('.nav-link, .category-card').forEach(elem => {
        elem.addEventListener('click', function(e) {
            e.preventDefault();
            const catId = parseInt(this.getAttribute('data-category'));
            if (catId) loadCategory(catId);
        });
    });
});

// מצב מנהל
function toggleAdminMode() {
    if (!isAdminMode) {
        const password = prompt('הכנס סיסמת מנהל:');
        if (password !== '2005') {
            alert('סיסמה שגויה!');
            return;
        }
    }
    
    isAdminMode = !isAdminMode;
    document.getElementById('adminBtn').textContent = isAdminMode ? 'יציאה ממצב מנהל' : 'Admin Mode';
    const addBtn = document.getElementById('addRecipeBtn');
    if (addBtn) addBtn.classList.toggle('hidden', !isAdminMode);
    if (currentCategory) loadCategory(currentCategory);
}

// הצגת טופס מתכון חדש
function showAddRecipe() {
    editingRecipeId = null;
    document.getElementById('formTitle').textContent = 'הוסף מתכון חדש';
    document.getElementById('recipeForm').reset();
    document.getElementById('recipeCategory').value = currentCategory;
    document.getElementById('imagePreview').classList.add('hidden');
    showPage('recipeFormPage');
}

// עריכת מתכון
function editRecipe(recipeId) {
    editingRecipeId = recipeId;
    document.getElementById('formTitle').textContent = 'ערוך מתכון';

    fetch(`${API_BASE}/${recipeId}`)
        .then(res => res.json())
        .then(recipe => {
            document.getElementById('recipeTitle').value = recipe.Title || '';
            document.getElementById('recipeDescription').value = recipe.Description || '';
            document.getElementById('recipeIngredients').value = recipe.Ingredients || '';
            document.getElementById('recipeInstructions').value = recipe.Instructions || '';
            document.getElementById('recipeCategory').value = recipe.CategoryId || currentCategory;
            if (recipe.Images) {
                document.getElementById('imagePreview').innerHTML = `<img src="${recipe.Images}" alt="תמונה קיימת">`;
                document.getElementById('imagePreview').classList.remove('hidden');
            }
        })
        .catch(err => alert('שגיאה בטעינת המתכון'));

    showPage('recipeFormPage');
}

// מחיקת מתכון
function deleteRecipe(recipeId) {
    if (!confirm('האם אתה בטוח שברצונך למחוק את המתכון?')) return;

    fetch(`${API_BASE}/${recipeId}`, { method: 'DELETE' })
        .then(res => { if (!res.ok) throw new Error(); })
        .then(() => loadCategory(currentCategory))
        .catch(() => alert('שגיאה במחיקת המתכון'));
}

// טיפול בשליחת טופס
function handleRecipeSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('recipeTitle').value.trim();
    const ingredients = document.getElementById('recipeIngredients').value.trim();
    const instructions = document.getElementById('recipeInstructions').value.trim();
    const categoryId = parseInt(document.getElementById('recipeCategory').value);

    if (!title || !ingredients || !instructions || !categoryId) {
        alert('נא למלא את כל השדות החובה');
        return;
    }

    const data = {
        Title: title,
        Description: document.getElementById('recipeDescription').value.trim() || '',
        Ingredients: ingredients,
        Instructions: instructions,
        CategoryId: categoryId,
        PrepTime: parseInt(document.getElementById('recipePrepTime')?.value) || 0,
        Images: null
    };

    const imageFile = document.getElementById('recipeImage').files[0];
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            data.Images = e.target.result; // Base64
            sendRecipeData(data);
        };
        reader.readAsDataURL(imageFile);
    } else {
        sendRecipeData(data);
    }
}

// שליחת הנתונים ל-API
function sendRecipeData(data) {
    const url = editingRecipeId ? `${API_BASE}/${editingRecipeId}` : API_BASE;
    const method = editingRecipeId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    })
    .then(() => {
        alert(editingRecipeId ? 'המתכון עודכן בהצלחה' : 'המתכון נוסף בהצלחה');
        goBack();
        loadCategory(currentCategory);
    })
    .catch(err => alert(`שגיאה בשמירת המתכון: ${err.message}`));
}

// תצוגת תמונה
function handleImagePreview(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            preview.innerHTML = `<img src="${e.target.result}" alt="תצוגה מקדימה">`;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        preview.classList.add('hidden');
    }
}

// טעינת קטגוריה
async function loadCategory(categoryId) {
    currentCategory = categoryId;
    const categoryNames = {1: 'עוגות', 2: 'עוגיות', 3: 'קינחים'};
    document.getElementById('categoryTitle').textContent = categoryNames[categoryId];
    
    // הצגת/הסתרת כפתור הוספה
    const addBtn = document.getElementById('addRecipeBtn');
    console.log('isAdminMode:', isAdminMode);
    if (addBtn) {
        if (isAdminMode) {
            addBtn.classList.remove('hidden');
            console.log('כפתור הוספה מוצג');
        } else {
            addBtn.classList.add('hidden');
            console.log('כפתור הוספה מוסתר');
        }
    }
    
    showPage('categoryPage');

    const recipesGrid = document.getElementById('recipesGrid');
    recipesGrid.innerHTML = '<div class="loading">טוען מתכונים...</div>';

    try {
        const res = await fetch(`http://127.0.0.1:8000/recipes/categories/${categoryId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const recipes = await res.json();
        displayRecipes(recipes);
    } catch (err) {
        recipesGrid.innerHTML = `<div class="loading">שגיאה בטעינת המתכונים: ${err.message}</div>`;
    }
}

// הצגת מתכונים
function displayRecipes(recipes) {
    const recipesGrid = document.getElementById('recipesGrid');
    if (!recipes || recipes.length === 0) {
        recipesGrid.innerHTML = '<div class="loading">אין מתכונים זמינים</div>';
        return;
    }

    recipesGrid.innerHTML = recipes.map(r => `
        <div class="recipe-card" onclick="showRecipe(${r.Id})">
            <div class="recipe-image">
                ${r.Images ? `<img src="${r.Images}" alt="${r.Title}">` : `<div style="font-size:3rem; text-align:center;">🍰</div>`}
            </div>
            <div class="recipe-content">
                <h3>${r.Title}</h3>
                <p>${r.Description || ''}</p>
                ${isAdminMode ? `
                    <div class="recipe-actions">
                        <button onclick="event.stopPropagation(); editRecipe(${r.Id})" class="edit-btn">
                            UPDATE
                        </button>
                        <button onclick="event.stopPropagation(); deleteRecipe(${r.Id})" class="delete-btn">
                            DELETE
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// הצגת מתכון מפורט
async function showRecipe(recipeId) {
    try {
        const res = await fetch(`${API_BASE}/${recipeId}`);
        if (!res.ok) throw new Error('שגיאה בטעינת המתכון');
        const r = await res.json();
        currentRecipe = r;
        showPage('recipePage');
        document.getElementById('recipeDetails').innerHTML = `
            <div class="recipe-hero">
                ${r.Images ? `<img src="${r.Images}" alt="${r.Title}" style="width: 100%; max-width: 400px; height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 1rem;">` : `<div class="recipe-hero-icon">🍰</div>`}
                <h1>${r.Title}</h1>
            </div>
            
            <div class="recipe-section">
                <h3>תיאור</h3>
                <p>${r.Description || 'מתכון מתוק ומיוחד'}</p>
            </div>
            
            <div class="recipe-section">
                <h3>רכיבים</h3>
                <p>${r.Ingredients}</p>
            </div>
            
            <div class="recipe-section">
                <h3>הוראות הכנה</h3>
                <p>${r.Instructions}</p>
            </div>
        `;
    } catch (err) {
        alert(err.message);
    }
}

// ניווט בין דפים
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

function goBack() {
    const recipePage = document.getElementById('recipePage');
    const recipeFormPage = document.getElementById('recipeFormPage');
    
    if (!recipePage.classList.contains('hidden')) {
        showPage('categoryPage');
    } else if (!recipeFormPage.classList.contains('hidden')) {
        showPage('categoryPage');
    }
}

function goHome() {
    showPage('homePage');
}

// צ'אט
function toggleChat() {
    const chatBody = document.getElementById('chatBody');
    const chatToggle = document.getElementById('chatToggle');
    
    if (chatBody.classList.contains('collapsed')) {
        chatBody.classList.remove('collapsed');
        chatToggle.textContent = '▼';
    } else {
        chatBody.classList.add('collapsed');
        chatToggle.textContent = '▲';
    }
}

async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    if (!message) return;
    
    addMessage(message, 'user');
    chatInput.value = '';
    
    const typingDiv = addMessage('כותב...', 'bot');
    
    try {
        const response = await fetch(`http://127.0.0.1:8000/chat?user_question=${encodeURIComponent(message)}`);
        if (!response.ok) throw new Error('שגיאה בשליחת ההודעה');
        
        const data = await response.json();
        typingDiv.remove();
        
        if (data.answer) {
            addMessage(data.answer, 'bot');
        } else if (data.error) {
            addMessage(`שגיאה: ${data.error}`, 'bot');
        }
    } catch (error) {
        typingDiv.remove();
        addMessage('שגיאה בחיבור לשרת', 'bot');
    }
}

function addMessage(text, type) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}
