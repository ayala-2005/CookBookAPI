-- יצירת Database חדש בשם RecipesDB
CREATE DATABASE RecipesDB;
GO

-- בחירת ה-Database לשימוש
USE RecipesDB;
GO

-- יצירת טבלת קטגוריות
CREATE TABLE Categories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE
);

-- יצירת טבלת מתכונים
CREATE TABLE Recipes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Ingredients NVARCHAR(MAX) NOT NULL,
    Instructions NVARCHAR(MAX) NOT NULL,
    PrepTime INT,
    CategoryId INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Recipes_Categories
        FOREIGN KEY (CategoryId)
        REFERENCES Categories(Id)
);

-- הכנסת קטגוריות התחלתיות
INSERT INTO Categories (Name)
VALUES (N'עוגות'), (N'מרקים'), (N'סלטים'), (N'מאפים'), (N'קינוחים');

-- הכנסת מתכונים לדוגמה
INSERT INTO Recipes
(Title, Description, Ingredients, Instructions, PrepTime, CategoryId)
VALUES
(
    N'עוגת שוקולד פשוטה',
    N'עוגה רכה ומהירה',
    N'קמח, סוכר, קקאו, ביצים, שמן, מים',
    N'לערבב הכל, לשפוך לתבנית ולאפות 35 דקות ב-170 מעלות',
    45,
    1
),
(
    N'מרק ירקות',
    N'מרק חם ומזין',
    N'גזר, תפוח אדמה, בצל, קישוא, מים, מלח',
    N'לבשל הכל יחד כשעה ולטחון',
    60,
    2
);
