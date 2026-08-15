import os
from dotenv import load_dotenv
from supabase import create_client, Client
import json

load_dotenv("backend/.env")
url = os.environ.get("SUPABASE_URL", "https://jkspewrwlcehmaszelkb.supabase.co")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
supabase: Client = create_client(url, key)

try:
    res = supabase.table("marks").select("*, profiles(name, roll_no)").execute()
    print(json.dumps(res.data[0], indent=2))
except Exception as e:
    import traceback
    traceback.print_exc()
