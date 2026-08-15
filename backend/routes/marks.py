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

@router.get("/peer-averages")
async def get_peer_averages(user: dict = Depends(get_current_user)):
    # Calculate true averages across all users
    result = supabase.table("marks").select("code, semester, year_label").execute()
    
    sums: dict[str, float] = {}
    counts: dict[str, int] = {}
    
    for row in result.data:
        code = row.get("code")
        score = row.get("semester")
        if code and score is not None:
            sums[code] = sums.get(code, 0) + score
            counts[code] = counts.get(code, 0) + 1
            
    averages = {code: round(sums[code] / counts[code]) for code in sums}
    return averages

@router.get("/all-marks-with-profiles")
async def get_all_marks_with_profiles():
    """
    Unprotected route for the Teacher Analytics Dashboard bypass demo.
    Fetches all student marks and joins them with their profile information manually.
    """
    marks_res = supabase.table("marks").select("*").execute()
    profiles_res = supabase.table("profiles").select("id, name, roll_no").execute()
    
    profiles_dict = {p["id"]: p for p in profiles_res.data}
    
    joined_data = []
    for m in marks_res.data:
        p = profiles_dict.get(m["user_id"], {})
        m_copy = dict(m)
        m_copy["profiles"] = {"name": p.get("name", "Unknown"), "roll_no": p.get("roll_no", "Unknown")}
        joined_data.append(m_copy)
        
    return joined_data
