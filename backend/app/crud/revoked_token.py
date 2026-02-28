from src.extensions import db
from app.models.revoked_token import RevokedToken
from sqlalchemy import select, exists
from datetime import datetime

def add_revoked_token(jti: str, expires_at: datetime):
    """
    Adds a revoked token to the database
    """
    revoked_token = RevokedToken(
        jti=jti, expires_at=expires_at)
    db.session.add(revoked_token)
    db.session.commit()
    return revoked_token

def is_revoked_token(jti: str) -> bool:
    stmt = select(exists().where(RevokedToken.jti == jti))
    return db.session.execute(stmt).scalar()