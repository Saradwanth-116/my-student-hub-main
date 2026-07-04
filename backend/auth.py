from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase_client import supabase

_bearer = HTTPBearer()

async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(_bearer),
) -> dict:
    try:
        # Use Supabase's native auth validation instead of python-jose.
        # This handles signature verification (HS256/RS256) automatically.
        response = supabase.auth.get_user(creds.credentials)
        if not response or not response.user:
            raise Exception("User not found")
            
        return {
            "sub": response.user.id,
            "email": response.user.email
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )
