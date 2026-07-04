import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

_url = os.getenv("SUPABASE_URL", "https://jkspewrwlcehmaszelkb.supabase.co")
_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

supabase: Client = create_client(_url, _key)
