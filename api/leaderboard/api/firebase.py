import json
import os
from pathlib import Path

import firebase_admin
from firebase_admin import credentials


def _load_credentials():
    """
    Load Firebase credentials from one of:
    1. FIREBASE_SERVICE_ACCOUNT (raw JSON string),
    2. FIREBASE_SERVICE_ACCOUNT_PATH (path to JSON file),
    3. ./service-account.json (local development fallback).
    """
    raw_service_account = os.getenv("FIREBASE_SERVICE_ACCOUNT")
    if raw_service_account:
        return credentials.Certificate(json.loads(raw_service_account))

    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    if service_account_path:
        return credentials.Certificate(service_account_path)

    local_file = Path("service-account.json")
    if local_file.exists():
        return credentials.Certificate(str(local_file))

    return None


try:
    cred = _load_credentials()
    default_app = firebase_admin.initialize_app(cred) if cred else None
except Exception:
    default_app = None
