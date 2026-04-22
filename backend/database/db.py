from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Using SQLite for zero-config local development on macOS. 
# Swap to: "postgresql://user:password@localhost/dbname" for production.
SQLALCHEMY_DATABASE_URL = "sqlite:///./pricing_engine.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()