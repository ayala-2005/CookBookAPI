# db/connection.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# טען משתני סביבה
load_dotenv()

DB_SERVER = os.getenv("DB_SERVER")
DB_NAME = os.getenv("DB_NAME")

# מחרוזת חיבור עם Windows Authentication
connection_string = (
    f"mssql+pyodbc://@{DB_SERVER}/{DB_NAME}"
    "?driver=ODBC+Driver+17+for+SQL+Server"
    "&Trusted_Connection=yes"
    "&Encrypt=yes"
    "&TrustServerCertificate=yes"
)

# צור engine
engine = create_engine(
    connection_string,
    pool_size=10,
    max_overflow=20,
    echo=False  # True אם רוצים לראות את כל השאילתות שמבוצעות
)

# Session factory
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

