import logging
import os
from datetime import datetime

import requests
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand, CommandError

from leaderboard.models import (
    LeetcodeUser,
    codechefUser,
    codeforcesUser,
    githubUser,
    openlakeContributor,
    AtcoderUser,
)
from leaderboard.serializers import (
    AC_Update_Serializer,
    CC_Update_Serializer,
    CF_Update_Serializer,
    GH_Update_Serializer,
    LT_Update_Serializer,
)

logger = logging.getLogger(__name__)
logging.getLogger("urllib3").setLevel(logging.ERROR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "leaderboard.settings")


def listToString(s):
    str1 = ""
    for ele in s:
        str1 += ele
    return str1


TIMESTAMP_NOW = datetime.now()


class Command(BaseCommand):
    help = "Updates the database with new info after fetching it from the individual sites."

    def handle(self, *args, **options):
        self.codechef_user_update()
        self.stdout.write(self.style.SUCCESS("Codechef DB updated."))

        self.codeforces_user_update()
        self.stdout.write(self.style.SUCCESS("Codeforces DB updated."))

        self.github_user_update()
        self.stdout.write(self.style.SUCCESS("Github DB updated."))

        self.leetcode_user_update()
        self.stdout.write(self.style.SUCCESS("LeetCode DB updated."))

        self.openlake_contributor_update()
        self.stdout.write(self.style.SUCCESS("OpenLake DB updated."))

        self.atcoder_user_update()
        self.stdout.write(self.style.SUCCESS("AtCoder DB updated."))

    def codechef_user_update(self):
        cc_users = codechefUser.objects.all()
        updates = []
        for i, cc_user in enumerate(cc_users):

            url = "https://www.codechef.com/users/{}".format(cc_user.username)
            try:
                page = requests.get(url, timeout=10)
            except Exception as e:
                self.stderr.write(f"Error fetching CodeChef data for {cc_user.username}: {e}")
                continue
            data_cc = BeautifulSoup(page.text, "html.parser")
            instance = {}

            try:
                instance["rating"] = int(
                    data_cc.find("div", class_="rating-number").text
                )
                container_highest_rating = data_cc.find("div", class_="rating-header")
                ttg = data_cc.findAll("img", class_="profileImage")
                instance["avatar"] = ttg[-1]["src"]
                instance["max_rating"] = (
                    container_highest_rating.find_next("small")
                    .text.split()[-1]
                    .rstrip(")")
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
            self.stderr.write(serializer.errors)

    def codeforces_user_update(self):
        cf_users = codeforcesUser.objects.all()
        updates = []

        try:
            cf_usernames = []
            for i in range(len(cf_users)):
                cf_usernames.append(cf_users[i].username)
            url = (
                f"https://codeforces.com/api/user.info?handles={';'.join(cf_usernames)}"
            )
            response = requests.get(url, timeout=10).json()["result"]
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
            else:
                self.stderr.write(serializer.errors)
        except:
            pass

    def github_user_update(self):
        gh_users = githubUser.objects.all()
        updates = []
        for i, gh_user in enumerate(gh_users):
            headers = {
                "Authorization": f"Bearer {os.environ.get("GITHUB_TOKEN")}",
                "Accept": "application/vnd.github.v3+json",  # Recommended for GitHub API
            }
            url = "https://github.com/{}".format(gh_user.username)
            try:
                page = requests.get(url, headers=headers, timeout=10)
            except Exception as e:
                self.stderr.write(f"Error fetching GitHub data for {gh_user.username}: {e}")
                continue
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
                    "img",
                    class_="avatar avatar-user width-full border color-bg-default",
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
            self.stderr.write(serializer.errors)

    def leetcode_user_update(self):
        lt_users = LeetcodeUser.objects.all()
        updates = []
        for i, lt_user in enumerate(lt_users):

            url = "https://leetcode.com/{}".format(lt_user.username)
            try:
                page = requests.get(url, timeout=10)
            except Exception as e:
                self.stderr.write(f"Error fetching LeetCode data for {lt_user.username}: {e}")
                continue
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
                instance["easy_solved"] = int(
                    listToString(lt_questions[0].text.split(","))
                )
                instance["medium_solved"] = int(
                    listToString(lt_questions[1].text.split(","))
                )
                instance["hard_solved"] = int(
                    listToString(lt_questions[2].text.split(","))
                )
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
            self.stderr.write(serializer.errors)

    def openlake_contributor_update(self):
        updated_list = {}
        url = "https://api.github.com/users/OpenLake/repos"
        if os.environ.get("GITHUB_TOKEN", False):
            headers = {
                "Authorization": f"Bearer {os.environ.get("GITHUB_TOKEN")}",
                "Accept": "application/vnd.github.v3+json",  # Recommended for GitHub API
            }
        else:
            headers = {}
        response = requests.get(url, headers=headers).json()

        for i in range(len(response)):
            repo_url = str(response[i]["contributors_url"])
            try:
                repo_response = requests.get(repo_url).json()
                for j in range(len(repo_response)):
                    try:
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
                        self.stderr.write(f"{ex}")
                        continue
            except Exception as ex:
                self.stderr.write(f"{ex}")
                continue
        openlakeContributor.objects.all().delete()
        for i in updated_list.keys():
            ol_contributor = openlakeContributor()
            ol_contributor.username = i
            ol_contributor.contributions = updated_list[i]
            ol_contributor.save()

    def atcoder_user_update(self):
        import re
        ac_users = AtcoderUser.objects.all()
        updates = []
        for i, ac_user in enumerate(ac_users):
            url = "https://atcoder.jp/users/{}".format(ac_user.username)
            try:
                page = requests.get(url, timeout=10)
                data_ac = BeautifulSoup(page.text, "html.parser")
                instance = {}
                
                # Scrape Rating and Rank from multiple potential tables
                tables = data_ac.find_all("table", class_="dl-table")
                for table in tables:
                    rows = table.find_all("tr")
                    for row in rows:
                        th = row.find("th")
                        td = row.find("td")
                        if th and td:
                            th_text = th.text.strip()
                            if th_text == "Rating":
                                span = td.find("span")
                                if span:
                                    instance["rating"] = int(span.text)
                            elif th_text == "Highest Rating":
                                span = td.find("span")
                                if span:
                                    instance["highest_rating"] = int(span.text)
                            elif th_text == "Rank":
                                rank_text = td.text.strip()
                                match = re.search(r'\d+', rank_text)
                                if match:
                                    instance["rank"] = int(match.group())

                instance["username"] = ac_user.username

                # Validation: Ensure all required fields are present
                required_fields = ["rating", "highest_rating", "rank"]
                if not all(field in instance for field in required_fields):
                    # If any required field is missing, trigger the except block to use old data
                    raise ValueError(f"Missing required fields for {ac_user.username}")

                updates.append(instance)

            except Exception as e:
                self.stderr.write(f"Error updating {ac_user.username}: {e}")
                instance = {
                    "username": ac_user.username,
                    "rating": ac_user.rating,
                    "highest_rating": ac_user.highest_rating,
                    "rank": ac_user.rank
                }
                updates.append(instance)

        serializer = AC_Update_Serializer(ac_users, data=updates, many=True)
        if serializer.is_valid():
            serializer.save()
        else:
            self.stderr.write(serializer.errors)
