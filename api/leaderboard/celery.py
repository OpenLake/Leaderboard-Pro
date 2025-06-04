import logging
import os
from datetime import datetime

import requests
from celery import Celery

logger = logging.getLogger(__name__)


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "leaderboard.settings")
app = Celery("leaderboard")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


def listToString(s):
    str1 = ""
    for ele in s:
        str1 += ele
    return str1


TIMESTAMP_NOW = datetime.now()


@app.task(bind=True)
def codechef_user_update(self):
    from bs4 import BeautifulSoup

    from leaderboard.models import codechefUser
    from leaderboard.serializers import CC_Update_Serializer

    cc_users = codechefUser.objects.all()
    updates = []
    for i, cc_user in enumerate(cc_users):

        url = "https://www.codechef.com/users/{}".format(cc_user.username)
        page = requests.get(url)
        data_cc = BeautifulSoup(page.text, "html.parser")
        instance = {}

        try:
            instance["rating"] = int(data_cc.find("div", class_="rating-number").text)
            container_highest_rating = data_cc.find("div", class_="rating-header")
            ttg = data_cc.findAll("img", class_="profileImage")
            instance["avatar"] = ttg[-1]["src"]
            instance["max_rating"] = (
                container_highest_rating.find_next("small").text.split()[-1].rstrip(")")
            )
            container_ranks = data_cc.find("div", class_="rating-ranks")
            ranks = container_ranks.find_all("a")
            instance["Global_rank"] = ranks[0].strong.text
            instance["Country_rank"] = ranks[1].strong.text
            instance["username"] = cc_user.username
            updates.append(instance)

        except:
            value = cc_user.avatar
            if len(value) == 0:
                value = "https://cdn.codechef.com/sites/all/themes/abessive/images/user_default_thumb.jpg"
            instance = {
                "username": cc_user.username,
                "rating": cc_user.rating,
                "avatar": value,
                "max_rating": cc_user.max_rating,
                "Global_rank": cc_user.Global_rank,
                "Country_rank": cc_user.Country_rank,
            }
            updates.append(instance)

    serializer = CC_Update_Serializer(cc_users, data=updates, many=True)
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)


@app.task(bind=True)
def codeforces_user_update(self):
    from leaderboard.models import codeforcesUser
    from leaderboard.serializers import CF_Update_Serializer

    cf_users = codeforcesUser.objects.all()
    updates = []

    try:
        cf_usernames = []
        for i in range(len(cf_users)):
            cf_usernames.append(cf_users[i].username)
        url = f"https://codeforces.com/api/user.info?handles=\{';'.join(cf_usernames)}"
        response = requests.get(url).json()["result"]
        for i in range(len(response)):
            user_data = response[i]
            instance = {}
            instance["username"] = cf_usernames[i]
            instance["maxRating"] = user_data.get("maxRating", 0)
            instance["rating"] = user_data.get("rating", 0)
            instance["last_activity"] = user_data.get(
                "lastOnlineTimeSeconds", TIMESTAMP_NOW
            )
            instance["avatar"] = user_data.get(
                "avatar", "https://userpic.codeforces.org/no-avatar.jpg"
            )
            updates.append(instance)
        serializer = CF_Update_Serializer(cf_users, data=updates, many=True)
        if serializer.is_valid():
            serializer.save()
            print("done")
        else:
            print(serializer.errors)
    except:
        pass


@app.task(bind=True)
def github_user_update(self):
    from bs4 import BeautifulSoup

    from leaderboard.models import githubUser
    from leaderboard.serializers import GH_Update_Serializer

    gh_users = githubUser.objects.all()
    updates = []
    for i, gh_user in enumerate(gh_users):

        url = "https://github.com/{}".format(gh_user.username)
        page = requests.get(url)
        data_gh = BeautifulSoup(page.text, "html.parser")
        instance = {}

        try:
            a = data_gh.find("div", class_="js-yearly-contributions")
            b = a.find("h2", class_="f4 text-normal mb-2").text
            instance["contributions"] = int(b.split(" ")[6])
            url = f"https://api.github.com/users/{gh_user.username}/repos"
            response = requests.get(url).json()
            instance["repositories"] = len(response)
            ttg = data_gh.findAll(
                "img", class_="avatar avatar-user width-full border color-bg-default"
            )
            instance["avatar"] = ttg[-1]["src"]
            stars = 0
            for i in range(len(response)):
                stars = stars + response[i]["stargazers_count"]
            instance["stars"] = stars
            instance["username"] = gh_user.username
            updates.append(instance)

        except Exception as e:
            value = gh_user.avatar
            if len(value) == 0:
                value = "https://avatars.githubusercontent.com/u/109169835?v=4"
            instance = {
                "username": gh_user.username,
                "stars": gh_user.stars,
                "avatar": value,
                "repositories": gh_user.repositories,
                "contributions": gh_user.contributions,
            }
            updates.append(instance)
    serializer = GH_Update_Serializer(gh_users, data=updates, many=True)
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)


@app.task(bind=True)
def leetcode_user_update(self):
    from bs4 import BeautifulSoup

    from leaderboard.models import LeetcodeUser
    from leaderboard.serializers import LT_Update_Serializer

    lt_users = LeetcodeUser.objects.all()
    updates = []
    for i, lt_user in enumerate(lt_users):

        url = "https://leetcode.com/{}".format(lt_user.username)
        page = requests.get(url)
        data_cc = BeautifulSoup(page.text, "html.parser")
        instance = {}

        try:
            ttg = data_cc.findAll("img", class_="h-20 w-20 rounded-lg object-cover")
            lt_ranking = data_cc.find(
                "span", class_="ttext-label-1 dark:text-dark-label-1 font-medium"
            )
            lt_questions = data_cc.findAll(
                "span",
                class_="mr-[5px] text-base font-medium leading-[20px] text-label-1 dark:text-dark-label-1",
            )
            instance["ranking"] = int(listToString(lt_ranking.text.split(",")))
            instance["easy_solved"] = int(listToString(lt_questions[0].text.split(",")))
            instance["medium_solved"] = int(
                listToString(lt_questions[1].text.split(","))
            )
            instance["hard_solved"] = int(listToString(lt_questions[2].text.split(",")))
            instance["avatar"] = ttg[-1]["src"]
            instance["username"] = lt_user.username
            updates.append(instance)

        except Exception as e:
            value = lt_user.avatar
            if len(value) == 0:
                value = "https://s3-us-west-1.amazonaws.com/s3-lc-upload/assets/default_avatar.jpg"
            instance = {
                "username": lt_user.username,
                "ranking": lt_user.ranking,
                "easy_solved": lt_user.easy_solved,
                "medium_solved": lt_user.medium_solved,
                "hard_solved": lt_user.hard_solved,
                "avatar": value,
            }
            updates.append(instance)

    serializer = LT_Update_Serializer(lt_users, data=updates, many=True)
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)


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
                        updated_list[repo_response[j]["login"]] = repo_response[j][
                            "contributions"
                        ]
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
