import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("service-account.json")

default_app = firebase_admin.initialize_app(cred)
