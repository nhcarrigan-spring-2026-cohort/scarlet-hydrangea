from src.extensions import db
from app.models.revoked_token import RevokedToken
from sqlalchemy import select
from datetime import datetime, timezone

def add_revoked_token(jti: str, expires_at: datetime):
    """
    Adds a revoked token to the database
    """
    revoked_token = RevokedToken(
        jti=jti, expires_at=expires_at)
    db.session.add(revoked_token)
    db.session.commit()
    return revoked_token

def get_revoked_token(jti: str):
    stmt = select(RevokedToken).where(RevokedToken.jti == jti)
    return db.session.execute(stmt).scalar_one_or_none()