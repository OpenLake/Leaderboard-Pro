import requests
from bs4 import BeautifulSoup

def find_codechef_streak(username):
    url = f"https://www.codechef.com/users/{username}"
    page = requests.get(url)
    soup = BeautifulSoup(page.text, "html.parser")
    
    # Just grab all text and search
    text = soup.get_text()
    idx = text.lower().find("streak")
    if idx != -1:
        print(text[max(0, idx-100):idx+100])
    else:
        print("No streak text found in whole page")

find_codechef_streak("tourist")
find_codechef_streak("arpit-mahajan09")
