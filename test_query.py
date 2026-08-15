import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv("backend/.env")

url = os.environ.get("SUPABASE_URL", "https://jkspewrwlcehmaszelkb.supabase.co")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

supabase: Client = create_client(url, key)
res = supabase.table("marks").select("*, profiles(name, roll_no)").limit(2).execute()
print(res.data)
