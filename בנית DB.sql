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
-- הכנסת עוד מתכונים
INSERT INTO Recipes
(Title, Description, Ingredients, Instructions, PrepTime, CategoryId)
VALUES
(
    N'סלט טונה קליל',
    N'סלט קריר וטעים',
    N'טונה, חסה, עגבניות, מלפפון, שמן זית, לימון',
    N'לערבב את כל המרכיבים בקערה ולהגיש',
    15,
    3
),
(
    N'לחמניות גבינה',
    N'לחמניות רכות עם גבינה מלוחה',
    N'קמח, שמרים, מים, מלח, גבינה צהובה',
    N'ללוש את הבצק, לעצב לחמניות, למלא בגבינה ולאפות 25 דקות ב-180 מעלות',
    60,
    4
),
(
    N'עוגיות שוקולד צ’יפס',
    N'עוגיות פריכות מבחוץ ורכות מבפנים',
    N'קמח, סוכר חום, חמאה, ביצים, שוקולד צ’יפס',
    N'לערבב את כל החומרים, ליצור עוגיות קטנות ולאפות 12-15 דקות ב-175 מעלות',
    30,
    5
),
(
    N'מרק עוף עם ירקות',
    N'מרק חם ומשביע',
    N'עוף, גזר, סלרי, בצל, תבלינים, מים',
    N'לבשל את כל המרכיבים כשעה ולהגיש חם',
    70,
    2
),
(
    N'עוגת גבינה קלה',
    N'עוגת גבינה אפויה וקלילה',
    N'גבינה לבנה, ביצים, סוכר, קורנפלור, ביסקוויטים',
    N'להכין תחתית מביסקוויטים, לערבב את הגבינה עם שאר החומרים, לאפות 45 דקות ב-160 מעלות',
    60,
    5
);
ALTER TABLE recipes
ADD image_path TEXT;

UPDATE r
SET r.image_path = CONCAT('img/', c.Name, '/', r.Title, '.jpg')
FROM Recipes r
INNER JOIN Categories c ON r.CategoryId = c.Id;

DELETE FROM Recipes
WHERE Id IN (1, 2);

select * from Recipes