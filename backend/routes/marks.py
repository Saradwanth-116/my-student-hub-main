from fastapi import APIRouter, Depends
from auth import get_current_user
from supabase_client import supabase

router = APIRouter(prefix="/api/student", tags=["marks"])


@router.get("/marks")
async def get_marks(user: dict = Depends(get_current_user)):
    uid = user["sub"]
    result = supabase.table("marks").select("*").eq("user_id", uid).order("code").execute()

    grouped: dict[str, list[dict]] = {}
    for row in result.data:
        year_label = row.pop("year_label", "Unknown")
        row.pop("user_id", None)
        row.pop("id", None)
        if year_label not in grouped:
            grouped[year_label] = []
        grouped[year_label].append(row)

    return grouped
