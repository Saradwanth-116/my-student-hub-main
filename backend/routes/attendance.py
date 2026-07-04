from fastapi import APIRouter, Depends
from auth import get_current_user
from supabase_client import supabase

router = APIRouter(prefix="/api/student", tags=["attendance"])


@router.get("/attendance")
async def get_attendance(user: dict = Depends(get_current_user)):
    uid = user["sub"]
    result = supabase.table("attendance").select("*").eq("user_id", uid).order("code").execute()
    return result.data
