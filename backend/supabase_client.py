import os
from supabase import create_client, Client

_url = os.getenv("SUPABASE_URL", "https://nkjmhlfxtgyjdmvknbis.supabase.co")
_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

supabase: Client = create_client(_url, _key)
