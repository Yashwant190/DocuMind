import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

"""
This module initializes Supabase clients using configuration from environment variables.
It attempts to load a .env file from multiple likely locations to avoid import-time failures
when the working directory differs from the project root.
"""

# Try loading environment variables from multiple likely locations
# 1) Current working directory
# 2) This file's directory (Backend/app/)
# 3) Backend/ directory
# 4) Repository root (two levels up)
def _load_env_robustly() -> None:
    # Load from CWD first
    load_dotenv()

    # If required keys are still missing, try other locations
    required = ["SUPABASE_URL", "SUPABASE_SERVICE_KEY", "SUPABASE_ANON_KEY"]
    def _missing_keys():
        return [k for k in required if not os.getenv(k)]

    if not _missing_keys():
        return

    here = Path(__file__).resolve()
    candidates = [
        here.parent / ".env",                 # Backend/app/.env
        here.parent.parent / ".env",          # Backend/.env
        here.parent.parent.parent / ".env",   # Repo root/.env
    ]

    for dotenv_path in candidates:
        try:
            if dotenv_path.exists():
                load_dotenv(dotenv_path=dotenv_path, override=False)
                if not _missing_keys():
                    break
        except Exception:
            # Ignore and continue trying other locations
            pass

_load_env_robustly()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

missing = [name for name, val in {
    "SUPABASE_URL": SUPABASE_URL,
    "SUPABASE_SERVICE_KEY": SUPABASE_SERVICE_KEY,
    "SUPABASE_ANON_KEY": SUPABASE_ANON_KEY,
}.items() if not val]

if missing:
    searched_paths = [
        str(Path.cwd() / ".env"),
        str(Path(__file__).resolve().parent / ".env"),
        str(Path(__file__).resolve().parent.parent / ".env"),
        str(Path(__file__).resolve().parent.parent.parent / ".env"),
    ]
    raise ValueError(
        "Missing Supabase configuration. Please check your .env file.\n"
        f"Missing keys: {', '.join(missing)}\n"
        "Searched .env paths (in order):\n - " + "\n - ".join(searched_paths)
    )

# Create Supabase client with service role key for backend operations
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Create client with anon key for user operations
supabase_anon: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def get_supabase_client() -> Client:
    """Get Supabase client with service role key"""
    return supabase

def get_supabase_anon_client() -> Client:
    """Get Supabase client with anonymous key"""
    return supabase_anon