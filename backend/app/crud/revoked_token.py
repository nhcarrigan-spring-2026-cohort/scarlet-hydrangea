from src.extensions import db
from app.models.revoked_token import RevokedToken
from sqlalchemy import select
from datetime import datetime, timezone, timedelta

def add_revoked_token(jti):
    """
    Adds a revoked token to the database
    """
    revoked_at = datetime.now(timezone.utc)     # Assuming immediate handoff
    delete_at = datetime.now(timezone.utc) + timedelta(days=7)
    revoked_token = RevokedToken(
        jti=jti, revoked_at=revoked_at, delete_at=delete_at)
    db.session.add(revoked_token)
    db.session.commit()
    return revoked_token

def get_revoked_token(jti: str):
    stmt = select(RevokedToken).where(RevokedToken.jti == jti)
    return db.session.execute(stmt).scalar_one_or_none()