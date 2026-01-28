# 📖 Recipe Manager

A full-stack web application for managing recipes with a Hebrew interface, featuring CRUD operations, category filtering, and AI-powered cooking assistance using Google's Gemini API.

## 🌟 Features

### User Interface
- 🎨 Modern, clean design with Hebrew (RTL) support
- 📱 Responsive layout for all devices
- 🖼️ Image support for recipes
- 🔍 Search and filter recipes by categories
- 🎭 Admin mode for managing recipes

### Recipe Categories
The system supports 5 main categories:
- 🍰 Cakes (עוגות)
- 🍲 Soups (מרקים)
- 🥗 Salads (סלטים)
- 🥐 Pastries (מאפים)
- 🍮 Desserts (קינוחים)

### Functionality
- ➕ Add new recipes
- ✏️ Edit existing recipes
- 🗑️ Delete recipes
- 👁️ View detailed recipe information
- 🤖 AI-powered cooking assistant (Gemini integration)
- 📊 Category-based organization

## 🏗️ Architecture

### Backend (Python FastAPI)
```
Recipe Manager/
├── main.py                 # FastAPI application entry point
├── api/
│   ├── recipes_api.py     # Recipe endpoints
│   └── gemini_api.py      # AI chat endpoints
├── db/
│   ├── connection.py      # Database connection
│   ├── models.py          # SQLAlchemy models
│   ├── schemas.py         # Pydantic schemas
│   └── queries.py         # Database queries
└── services/
    └── recipes_service.py # Business logic
```

### Frontend (HTML/CSS/JavaScript)
```
js/
├── index.html             # Main HTML file
├── styles.css             # Styling
├── script.js              # Frontend logic
├── app.js                 # Application initialization
└── img/                   # Recipe images by category
```

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation
- **SQL Server** - Database (with pyodbc driver)
- **Google Gemini API** - AI integration
- **python-dotenv** - Environment variables management

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with modern features
- **Vanilla JavaScript** - Interactive functionality
- **Heebo Font** - Hebrew typography

## 📦 Installation

### Prerequisites
- Python 3.8+
- SQL Server
- ODBC Driver 17 for SQL Server
- Google Gemini API key

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd "Recipe Manager"
```

### Step 2: Install Python Dependencies
```bash
pip install fastapi uvicorn sqlalchemy pyodbc python-dotenv requests urllib3
```

### Step 3: Set Up Environment Variables
Create a `.env` file in the root directory:
```env
DB_SERVER=your_server_name
DB_NAME=RecipeDB
GEMINI_API_KEY=your_gemini_api_key
```

### Step 4: Set Up the Database
1. Create a SQL Server database named `RecipeDB`
2. Run the SQL script `בניית DB.sql` to create tables:
   - Categories
   - Recipes

### Step 5: Run the Application

Start the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Open the frontend:
- Navigate to `js/index.html` in your browser
- Or serve it with a local server:
```bash
cd js
python -m http.server 3000
```

## 🗄️ Database Schema

### Categories Table
```sql
CREATE TABLE Categories (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL UNIQUE
);
```

### Recipes Table
```sql
CREATE TABLE Recipes (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200) NOT NULL,
    Description NTEXT,
    Ingredients NTEXT NOT NULL,
    Instructions NTEXT NOT NULL,
    PrepTime INT,
    CategoryId INT FOREIGN KEY REFERENCES Categories(Id),
    CreatedAt DATETIME DEFAULT GETDATE(),
    image_path NVARCHAR(MAX)
);
```

## 🔌 API Endpoints

### Recipes
- `GET /recipes/` - Get all recipes
- `GET /recipes/{recipe_id}` - Get specific recipe
- `GET /recipes/categories/{category_id}` - Get recipes by category
- `POST /recipes/` - Create new recipe
- `PUT /recipes/{recipe_id}` - Update recipe
- `DELETE /recipes/{recipe_id}` - Delete recipe

### AI Chat
- `GET /chat?user_question=<question>` - Ask the AI cooking assistant

### Root
- `GET /` - API welcome message

## 🤖 Gemini AI Integration

The application includes an AI-powered cooking assistant that:
- Answers cooking and baking questions in Hebrew
- Has context of all recipes in the database
- Provides professional baking advice
- Uses Google's Gemini 2.5 Flash model

Example usage:
```
GET /chat?user_question=איך מכינים עוגת שוקולד?
```

## 🎨 Frontend Features

### Admin Mode
Toggle admin mode to:
- Add new recipes
- Edit existing recipes
- Delete recipes
- Manage all content

### Recipe Display
- Grid layout for browsing
- Detailed view with ingredients and instructions
- Preparation time display
- Category badges
- Recipe images

### Responsive Design
- Mobile-friendly interface
- Touch-optimized buttons
- Adaptive layouts
- Smooth animations

## 🔒 Security Notes

### Current Implementation
- CORS enabled for all origins (development mode)
- SSL verification disabled for Gemini API (for network filtering)
- Windows Authentication for SQL Server

### Production Recommendations
1. Restrict CORS to specific origins
2. Enable SSL verification
3. Add user authentication
4. Implement rate limiting
5. Secure API keys properly
6. Add input validation and sanitization

## 🚀 Future Enhancements

- [ ] User authentication and authorization
- [ ] Recipe rating and reviews
- [ ] Shopping list generation
- [ ] Nutrition information
- [ ] Recipe sharing features
- [ ] Advanced search with filters
- [ ] Recipe import/export
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Recipe video integration

## 📝 Configuration

### Database Connection
The application uses Windows Authentication by default. Modify `db/connection.py` for different authentication methods.

### Gemini API
The AI assistant uses Gemini 2.5 Flash. You can change the model in `api/gemini_api.py`:
```python
target_url = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.5-flash:generateContent?key=" + API_KEY
)
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure SQL Server is running
- Verify ODBC Driver 17 is installed
- Check connection string in `.env`
- Confirm Windows Authentication permissions

### API Connection Issues
- Verify backend is running on port 8000
- Check CORS settings
- Ensure Gemini API key is valid
- Review network/firewall settings

### Frontend Issues
- Clear browser cache
- Check console for JavaScript errors
- Verify API endpoints are accessible
- Ensure images paths are correct

## 📄 License

This project is provided as-is for educational and personal use.

## 👥 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Note**: This application is designed for Hebrew-speaking users with a right-to-left (RTL) interface. All user-facing text is in Hebrew, while code and documentation are in English.
