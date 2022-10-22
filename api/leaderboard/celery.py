import os
from celery import Celery
import requests

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "leaderboard.settings")
app = Celery("leaderboard")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


@app.task(bind=True)
def codechef_user_update(self):
    from leaderboard.models import codechefUser
    from bs4 import BeautifulSoup

    cc_users = codechefUser.objects.all()
    for i, cc_user in enumerate(cc_users):
        if cc_user.is_outdated:
            url = "https://www.codechef.com/users/{}".format(cc_user.username)
            page = requests.get(url)
            data_cc = BeautifulSoup(page.text, "html.parser")
            cc_user.rating = data_cc.find("div", class_="rating-number").text
            container_highest_rating = data_cc.find(
                "div", class_="rating-header"
            )
            cc_user.max_rating = (
                container_highest_rating.find_next("small")
                .text.split()[-1]
                .rstrip(")")
            )
            container_ranks = data_cc.find("div", class_="rating-ranks")
            ranks = container_ranks.find_all("a")
            cc_user.Global_rank = ranks[0].strong.text
            cc_user.Country_rank = ranks[1].strong.text
            cc_user.save()


@app.task(bind=True)
def github_user_update(self):
    from leaderboard.models import githubUser
    from bs4 import BeautifulSoup

    gh_users = githubUser.objects.all()
    for i, gh_user in enumerate(gh_users):
        if gh_user.is_outdated:
            url = "https://github.com/{}".format(gh_user.username)
            page = requests.get(url)
            data_gh = BeautifulSoup(page.text, "html.parser")
            a = data_gh.find("div", class_="js-yearly-contributions")
            b = a.find("h2", class_="f4 text-normal mb-2").text
            gh_user.contributions = int(b.split(" ")[6])
            url = f"https://api.github.com/users/{gh_user.username}/repos"
            response = requests.get(url).json()
            gh_user.repositories = len(response)
            stars = 0
            for i in range(len(response)):
                stars = stars + response[i]["stargazers_count"]
            gh_user.stars = stars
            gh_user.save()

@app.task(bind=True)
def openlake_contributor__update(self):
    from leaderboard.models import openlakeContributor
    
    updated_list = {}
    url = "https://api.github.com/users/OpenLake/repos"
    response = requests.get(url).json()
    print(len(response))
    for i in range(len(response)):
        repo_url = str(response[i]["contributors_url"])
        print(repo_url)
        try:
            repo_response = requests.get(repo_url).json()
            for j in range(len(repo_response)):
                try:
                    print(repo_response[j]["login"])
                    print(updated_list)
                    if repo_response[j]["login"] in updated_list.keys():
                        updated_list[repo_response[j]["login"]] = (
                            updated_list[repo_response[j]["login"]]
                            + repo_response[j]["contributions"]
                        )
                    else:
                        updated_list[
                            repo_response[j]["login"]
                        ] = repo_response[j]["contributions"]
                except Exception as ex:
                    print("=========================", ex)
                    continue
        except Exception as ex:
            print("=========================", ex)
            continue
    openlakeContributor.objects.all().delete()
    for i in updated_list.keys():
        ol_contributor = openlakeContributor()
        ol_contributor.username = i
        ol_contributor.contributions = updated_list[i]
        ol_contributor.save()